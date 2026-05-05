#!/usr/bin/env bun
/**
 * research-book.ts — Universal book-research CLI
 *
 * Usage:
 *   bun scripts/research-book.ts <ASIN>           # single book by ASIN
 *   bun scripts/research-book.ts --slug <slug>    # single book by slug
 *   bun scripts/research-book.ts --all            # all books from books.json
 *   bun scripts/research-book.ts --link           # second pass (Task 9, not yet implemented)
 *   bun scripts/research-book.ts --refresh-goodreads-only  # update YAMLs from Goodreads only
 *
 * Flags:
 *   --refresh   ignore cache (TTL=0)
 *   --en        language override → English
 *   --de        language override → German
 *   --refresh-goodreads-only   fetch Goodreads author-list & patch existing YAMLs
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { parse as parseYaml } from "yaml";
import type { BooksJsonEntry } from "../src/lib/research/types";
import { fetchWithCache } from "../src/lib/research/fetch-cache";
import { parseBookPage } from "../src/lib/research/parse-book-page";
import { parseSectionMap } from "../src/lib/research/parse-section-map";
import { fetchGoodreadsRss, matchGoodreadsToBook } from "../src/lib/research/goodreads-rss";
import { fetchAllAuthorBooks, crossMatchBooks, type GoodreadsBookDetail, type CrossMatchResult } from "../src/lib/research/goodreads-author-list";
import { generateTopics, extractTitleTokens } from "../src/lib/research/topic-generator";
import { calculateAppMatches, calculateAppMatchesFromText, type AppEntry } from "../src/lib/research/app-cross-linker";

// Author-blanket reviews appear on every dirkwernerbooks.com detail-page
// but only legitimately apply to the listed slug. Filter at research time so
// re-research never re-introduces them on unrelated books.
const AUTHOR_BLANKET_REVIEWS: Array<{ sourceMatch: string; onlySlug: string }> = [
  { sourceMatch: "Prairies Book Review", onlySlug: "the-battle-within" },
];

function filterBlanketReviews(reviews: any[], slug: string): any[] {
  return reviews.filter((r) => {
    const blanket = AUTHOR_BLANKET_REVIEWS.find((b) =>
      (r.source ?? "").toLowerCase().includes(b.sourceMatch.toLowerCase())
    );
    if (!blanket) return true; // not a blanket review → keep
    return slug === blanket.onlySlug;
  });
}
import { buildDescriptions, buildMarketing } from "../src/lib/research/description-builder";
import {
  writeBookYaml,
  logError,
  writeIndexManifest,
  type IndexManifest,
} from "../src/lib/research/yaml-writer";
import { toSlug } from "../src/lib/research/slug-utils";
import { cleanTitle } from "../src/lib/research/title-cleaner";
import { splitEditionUrls } from "../src/lib/research/url-splitter";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TTL_7D = 7 * 24 * 60 * 60 * 1000;
const TTL_24H = 24 * 60 * 60 * 1000;
const ALLE_BUECHER_URL = "https://dirkwernerbooks.com/buecher/";
const AUTHOR_REF = "https://books.werner-productions.com/#author";
const PUBLISHER = "Werner Productions";
const PUBLICATION_DATE_PLACEHOLDER = "2024-01-01";
const NARRATOR_PLACEHOLDER = "AI Voice (Werner Productions)";

// ---------------------------------------------------------------------------
// CLI args parsing
// ---------------------------------------------------------------------------

interface CliArgs {
  all: boolean;
  slug: string | null;
  asin: string | null;
  refresh: boolean;
  langOverride: "de" | "en" | null;
  link: boolean;
  refreshGoodreadsOnly: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  const args = argv.slice(2); // strip "bun" + script path
  const result: CliArgs = {
    all: false,
    slug: null,
    asin: null,
    refresh: false,
    langOverride: null,
    link: false,
    refreshGoodreadsOnly: false,
  };

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--all") result.all = true;
    else if (a === "--refresh") result.refresh = true;
    else if (a === "--en") result.langOverride = "en";
    else if (a === "--de") result.langOverride = "de";
    else if (a === "--link") result.link = true;
    else if (a === "--refresh-goodreads-only") result.refreshGoodreadsOnly = true;
    else if (a === "--slug") {
      result.slug = args[++i] ?? null;
    } else if (!a.startsWith("--")) {
      result.asin = a; // bare argument → ASIN
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// Load books.json
// ---------------------------------------------------------------------------

function loadBooksJson(): BooksJsonEntry[] {
  const candidates = [
    process.env.BOOKS_JSON_PATH,
    resolve(process.cwd(), "books.json"),
  ].filter(Boolean) as string[];

  for (const p of candidates) {
    if (existsSync(p)) {
      try {
        return JSON.parse(readFileSync(p, "utf-8")) as BooksJsonEntry[];
      } catch (e) {
        console.error(`Failed to parse books.json at ${p}: ${(e as Error).message}`);
        process.exit(1);
      }
    }
  }

  console.error("books.json not found. Set BOOKS_JSON_PATH or place it in the repo root.");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Load identity.yaml (optional)
// ---------------------------------------------------------------------------

interface IdentityYaml {
  apps?: AppEntry[] | Record<string, any>;
}

// Convert object-keyed apps (identity.yaml format) to AppEntry array
function normalizeApps(raw: IdentityYaml): AppEntry[] {
  if (!raw.apps) return [];

  // Array format (already normalized)
  if (Array.isArray(raw.apps)) return raw.apps as AppEntry[];

  // Object-keyed format: { shadow_integrator: { name, domain, topics, ... }, ... }
  const result: AppEntry[] = [];
  for (const [key, val] of Object.entries(raw.apps as Record<string, any>)) {
    if (!val || typeof val !== "object") continue;
    const domain: string = val.domain ?? "";
    if (!domain) continue; // skip apps without domain (e.g. sundamind null)
    result.push({
      id: `${domain}/#app`,
      slug: key,
      name: val.name ?? key,
      topics: Array.isArray(val.topics) ? val.topics : [],
    });
  }
  return result;
}

function loadIdentityYaml(): { apps: AppEntry[] } {
  const candidates = [
    process.env.IDENTITY_YAML_PATH,
    resolve(process.cwd(), "identity.yaml"),
    resolve(process.cwd(), "config/identity.yaml"),
    // Asset-YAMLs repo location
    resolve(process.cwd(), "../Hermes-Agent/Asset-YAMLs/identity.yaml"),
    "C:/Users/psych/OneDrive/Hermes-Agent/Asset-YAMLs/identity.yaml",
  ].filter(Boolean) as string[];

  for (const p of candidates) {
    if (existsSync(p)) {
      try {
        const raw = parseYaml(readFileSync(p, "utf-8")) as IdentityYaml;
        const apps = normalizeApps(raw);
        if (apps.length > 0) {
          console.log(`  Loaded identity.yaml from: ${p} (${apps.length} apps)`);
        }
        return { apps };
      } catch (e) {
        console.warn(`Warning: Could not parse identity.yaml at ${p}: ${(e as Error).message}`);
      }
    }
  }

  return { apps: [] }; // not found → skip app cross-linking
}

// ---------------------------------------------------------------------------
// Cover dimensions
// ---------------------------------------------------------------------------

function parseWebpDimensions(buffer: Buffer): { width: number; height: number } | null {
  if (buffer.length < 30) return null;
  if (buffer.toString("ascii", 0, 4) !== "RIFF") return null;
  if (buffer.toString("ascii", 8, 12) !== "WEBP") return null;

  const chunk = buffer.toString("ascii", 12, 16);
  if (chunk === "VP8X" && buffer.length >= 30) {
    const width = (buffer[24] | (buffer[25] << 8) | (buffer[26] << 16)) + 1;
    const height = (buffer[27] | (buffer[28] << 8) | (buffer[29] << 16)) + 1;
    return { width, height };
  }
  if (chunk === "VP8 " && buffer.length >= 30) {
    const width = buffer.readUInt16LE(26) & 0x3FFF;
    const height = buffer.readUInt16LE(28) & 0x3FFF;
    return { width, height };
  }
  if (chunk === "VP8L" && buffer.length >= 25) {
    const val = buffer.readUInt32LE(21);
    const width = (val & 0x3FFF) + 1;
    const height = ((val >> 14) & 0x3FFF) + 1;
    return { width, height };
  }
  return null;
}

async function getCoverDimensions(asin: string): Promise<{ width: number; height: number }> {
  try {
    const url = `https://dirkwernerbooks.com/assets/covers/${asin}-400.webp`;
    const resp = await fetch(url, {
      headers: { "User-Agent": "WernerProductionsResearch/1.0" },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const buffer = Buffer.from(await resp.arrayBuffer());
    const dims = parseWebpDimensions(buffer);
    if (dims) return dims;
  } catch (e) {
    console.warn(`  ⚠ Cover dimensions failed for ${asin}: ${(e as Error).message}`);
  }
  return { width: 1, height: 1 }; // placeholder — triggers COVER_MISSING log, passes schema validation
}

// ---------------------------------------------------------------------------
// Process a single book
// ---------------------------------------------------------------------------

async function processBook(
  book: BooksJsonEntry,
  sectionMappings: ReturnType<typeof parseSectionMap>,
  goodreadsItems: Awaited<ReturnType<typeof fetchGoodreadsRss>>,
  apps: AppEntry[],
  cacheTtlBook: number,
  today: string,
  grCrossMatches: Map<string, CrossMatchResult> | null = null
): Promise<boolean> {
  const lang = book.language;
  const title = cleanTitle(lang === "de" ? book.title.de : book.title.en);
  const slug = toSlug(title);
  const asin = book.asin;

  console.log(`\nProcessing: ${title} (${asin}, ${lang})`);

  // 1. Fetch book page
  const pageUrl = `https://dirkwernerbooks.com/buecher/${asin}-${lang}`;
  let pageHtml: string;
  try {
    pageHtml = await fetchWithCache(pageUrl, `book-${asin}-${lang}.html`, cacheTtlBook);
  } catch (e) {
    console.error(`  ✗ Network fail: ${(e as Error).message}`);
    logError({
      timestamp: new Date().toISOString(),
      asin,
      type: "NETWORK_FAIL",
      detail: (e as Error).message,
    });
    return false;
  }

  // 2. Parse page
  const parsed = parseBookPage(pageHtml);
  const { paperbackIsbn, appleAudioId, aboutBullets, formatBadges } = parsed;

  // 3. Find section mapping
  const sectionMapping = sectionMappings.find((m) => m.asin === asin);

  // 4. Match Goodreads RSS
  let grMatch = matchGoodreadsToBook(book, goodreadsItems);

  // 4b. Author-list fallback when RSS match failed or returned no ID
  if ((!grMatch.goodreadsBookId || grMatch.matchType === null) && grCrossMatches) {
    const crossMatch = grCrossMatches.get(asin);
    if (crossMatch) {
      grMatch = {
        goodreadsBookId: crossMatch.goodreadsBookId,
        matchType: "fuzzy" as const,
        bestCandidate: crossMatch.goodreadsTitle,
      };
      console.log(`  ✓ Goodreads fallback (author-list): ${crossMatch.goodreadsBookId} (${crossMatch.matchType})`);
    }
  }

  if (!grMatch.goodreadsBookId) {
    logError({
      timestamp: new Date().toISOString(),
      asin,
      type: "GOODREADS_NO_MATCH",
      detail: grMatch.bestCandidate
        ? `Best candidate: ${grMatch.bestCandidate}`
        : "No candidate found",
    });
    console.warn(`  ⚠ Goodreads: no match${grMatch.bestCandidate ? ` (best: ${grMatch.bestCandidate})` : ""}`);
  } else {
    console.log(`  ✓ Goodreads: ${grMatch.goodreadsBookId} (${grMatch.matchType})`);
  }

  // 5. Generate topics
  const titleTokens = extractTitleTokens(title);
  const topics = generateTopics(asin, sectionMapping, aboutBullets, titleTokens);

  // 6. Calculate app matches
  const appMatches = apps.length > 0 ? calculateAppMatches(topics, apps) : [];

  // 7. Build descriptions
  const descriptions = buildDescriptions(
    book,
    sectionMapping,
    topics,
    paperbackIsbn,
    appleAudioId,
    grMatch.goodreadsBookId,
    appMatches,
    book.relatedBook
  );

  // 7c. Build marketing description from parsed page
  const marketingText = buildMarketing(parsed, book, sectionMapping?.bisac ?? []);
  if (marketingText && marketingText.length >= 50) {
    (descriptions as any).marketing = marketingText;
  }

  // 7b. Enhance long description with Goodreads substrate if available
  const grDetail = grCrossMatches?.get(asin)?.detail;
  if (grDetail?.descriptionForLong && grDetail.descriptionForLong.length > 100) {
    const identLine = `${title} by Dirk Werner (ORCID 0009-0001-7822-0041, GND 1384382429), Werner Productions imprint.`;
    const enhanced = `${identLine} ${grDetail.descriptionForLong}`.slice(0, 800);
    descriptions.long = enhanced;
  }

  // 8. Cover dimensions
  const coverDims = await getCoverDimensions(asin);
  if (coverDims.width === 1) {
    logError({
      timestamp: new Date().toISOString(),
      asin,
      type: "COVER_MISSING",
      detail: `Could not fetch ${asin}-800.webp`,
    });
  }

  // 9. Assemble workExample editions
  const workExample: Record<string, unknown>[] = [];
  const editionUrls = splitEditionUrls(book);

  // eBook (always present)
  workExample.push({
    format: "ebook",
    asin,
    publisher: PUBLISHER,
    urls: editionUrls.ebook,
  });

  // Paperback
  if (book.hasPaperback) {
    const pbEntry: Record<string, unknown> = {
      format: "paperback",
      publisher: PUBLISHER,
      urls: editionUrls.paperback,
    };
    if (paperbackIsbn) pbEntry.isbn = paperbackIsbn;
    if (book.paperbackAsin) {
      if (/^B0[A-Z0-9]{8}$/.test(book.paperbackAsin)) {
        pbEntry.asin = book.paperbackAsin;
      } else if (/^\d{13}$/.test(book.paperbackAsin) && !paperbackIsbn) {
        pbEntry.isbn = book.paperbackAsin;
      }
    }
    workExample.push(pbEntry);
  }

  // Audiobook
  if (book.hasAudiobook) {
    // Merge page-parsed apple ID with books.json audiobook links
    const abUrls: Record<string, string> = { ...editionUrls.audiobook };
    if (appleAudioId) {
      abUrls["apple"] = `https://books.apple.com/audiobook/id${appleAudioId}`;
    }
    workExample.push({
      format: "audiobook",
      publisher: PUBLISHER,
      narrator: NARRATOR_PLACEHOLDER,
      urls: abUrls,
    });
  }

  // 10. Assemble workTranslation / translationOfWork
  // Convention: DE = original, EN = translation
  // relatedBook is the ASIN of the sibling language edition
  const relatedBookSlug = book.relatedBook
    ? toSlug(cleanTitle(lang === "de" ? book.title.en : book.title.de))
    : undefined;

  const workTranslation: string[] = [];
  const translationOfWork: string[] = [];

  if (relatedBookSlug) {
    if (lang === "de") {
      workTranslation.push(relatedBookSlug); // DE has EN as translation
    } else {
      translationOfWork.push(relatedBookSlug); // EN points back to DE original
    }
  }

  // 11. alternateName: only for monolingual books (no relatedBook / no workTranslation)
  // Schema expects string | null, not array
  const otherLangTitleRaw = cleanTitle(lang === "de" ? book.title.en : book.title.de);
  const alternateName: string | null | undefined = !book.relatedBook && otherLangTitleRaw
    ? otherLangTitleRaw
    : undefined; // omit for bilingual pairs (workTranslation non-empty)

  // 12. searchHints: {de, en} object — null for the language the book IS in
  // Only for monolingual books; bilingual pairs omit this entirely
  const otherLangTitle = otherLangTitleRaw;
  const searchHints: { de: string | null; en: string | null } | undefined =
    !book.relatedBook && otherLangTitle
      ? (lang === "de"
          ? { de: null, en: otherLangTitle }
          : { de: otherLangTitle, en: null })
      : undefined;

  // 11b. mentions: app URLs for apps with ≥2 topic overlap
  // Use description-text haystack (long + goodreads forLong) for richer matching.
  const descHaystack = [
    descriptions.long,
    grDetail?.descriptionForLong ?? "",
    grDetail?.description ?? "",
  ].join(" ");
  const mentionMatches = apps.length > 0
    ? calculateAppMatchesFromText(descHaystack, apps, sectionMapping?.bisac ?? [])
    : [];
  const mentions = mentionMatches.map(m => ({ id: m.id }));

  // 13. Assemble full book data
  const bookData: Record<string, unknown> = {
    slug,
    title,
    language: lang,
    authors: [{ ref: AUTHOR_REF }],
    workTranslation,
    translationOfWork,
    descriptions,
    cover: {
      filename: `${asin}-800.webp`,
      dimensions: { width: coverDims.width, height: coverDims.height },
      alt: `${title} — Cover`,
    },
    workExample,
    bisac: sectionMapping?.bisac ?? [],
    keywords: topics,
    relatedBooks: relatedBookSlug ? [relatedBookSlug] : [],
    knowsAbout: topics,
    reviews: filterBlanketReviews(parsed.reviews, slug),
    mentions,
    dateModified: today,
  };

  if (grMatch.goodreadsBookId) {
    bookData.goodreadsBookId = grMatch.goodreadsBookId;
  }

  if (alternateName) {
    bookData.alternateName = alternateName;
  }

  if (searchHints) {
    bookData.searchHints = searchHints;
  }

  // 14. Write YAML
  const success = writeBookYaml(slug, bookData);
  if (success) {
    console.log(`  ✓ Written: output/research/${slug}.yaml`);
  } else {
    console.error(`  ✗ Schema validation failed for ${slug}`);
  }

  return success;
}

// ---------------------------------------------------------------------------
// Link pass (Task 9): cross-reference relatedBooks via knowsAbout overlap
// ---------------------------------------------------------------------------

async function runLinkPass() {
  const { readdirSync, readFileSync: readFs, writeFileSync: writeFs } = await import("fs");
  const { parse: parseY, stringify: stringifyY } = await import("yaml");
  const { resolve: resolvePath } = await import("path");
  const outputDir = resolvePath(process.cwd(), "output/research");

  const files = readdirSync(outputDir).filter(f => f.endsWith(".yaml") && !f.startsWith("_"));
  const allBooks: Array<{ slug: string; knowsAbout: string[]; filePath: string }> = [];

  for (const file of files) {
    const filePath = resolvePath(outputDir, file);
    const content = readFs(filePath, "utf-8");
    const parsed = parseY(content) as any;
    const book = parsed.books?.[0];
    if (book) {
      allBooks.push({ slug: book.slug, knowsAbout: book.knowsAbout || [], filePath });
    }
  }

  console.log(`Link pass: ${allBooks.length} books loaded.`);

  let updated = 0;
  for (const book of allBooks) {
    const related = allBooks
      .filter(other => other.slug !== book.slug)
      .map(other => ({
        slug: other.slug,
        overlap: book.knowsAbout.filter(t =>
          other.knowsAbout.some(ot => t.toLowerCase() === ot.toLowerCase())
        ).length,
      }))
      .filter(r => r.overlap >= 3)
      .sort((a, b) => b.overlap - a.overlap)
      .slice(0, 3)
      .map(r => r.slug);

    if (related.length > 0) {
      const content = readFs(book.filePath, "utf-8");
      const parsed = parseY(content) as any;
      parsed.books[0].relatedBooks = related;
      // Preserve header comments
      const headerLines = content.split("\n").filter(l => l.startsWith("#"));
      const header = headerLines.length > 0 ? headerLines.join("\n") + "\n" : "";
      writeFs(book.filePath, header + stringifyY(parsed));
      console.log(`  → ${book.slug}: ${related.join(", ")}`);
      updated++;
    }
  }

  console.log(`Link pass complete. ${updated} books updated with relatedBooks.`);
}

// ---------------------------------------------------------------------------
// Goodreads-only refresh (--refresh-goodreads-only)
// ---------------------------------------------------------------------------

async function runGoodreadsOnlyRefresh(allBooks: BooksJsonEntry[]) {
  const { readdirSync, readFileSync: readFs, writeFileSync: writeFs } = await import("fs");
  const { parse: parseY, stringify: stringifyY } = await import("yaml");
  const { resolve: resolvePath } = await import("path");
  const outputDir = resolvePath(process.cwd(), "output/research");

  // Fetch Goodreads data
  const { books: grBooks } = await fetchAllAuthorBooks();
  const { matched } = crossMatchBooks(grBooks, allBooks);
  const matchMap = new Map(matched.filter(m => m.matchedAsin).map(m => [m.matchedAsin!, m]));
  console.log(`Goodreads author-list: ${matched.length} cross-matches`);

  // Update existing YAMLs
  const files = readdirSync(outputDir).filter((f: string) => f.endsWith(".yaml") && !f.startsWith("_"));
  let updated = 0;

  for (const file of files) {
    const filePath = resolvePath(outputDir, file);
    const content = readFs(filePath, "utf-8");
    const parsed = parseY(content) as any;
    const book = parsed.books?.[0];
    if (!book) continue;

    // Find the ASIN from workExample
    const asin = book.workExample?.find((e: any) => e.asin)?.asin;
    if (!asin) continue;

    const crossMatch = matchMap.get(asin);
    if (!crossMatch) continue;

    let changed = false;

    // Update goodreadsBookId if missing
    if (!book.goodreadsBookId && crossMatch.goodreadsBookId) {
      book.goodreadsBookId = crossMatch.goodreadsBookId;
      changed = true;
    }

    // Update publicationDate from Goodreads if available and missing
    if (crossMatch.detail.publishedDate) {
      for (const we of book.workExample || []) {
        if (!we.publicationDate) {
          we.publicationDate = crossMatch.detail.publishedDate;
          changed = true;
        }
      }
    }

    if (changed) {
      const headerLines = content.split("\n").filter((l: string) => l.startsWith("#"));
      const header = headerLines.length > 0 ? headerLines.join("\n") + "\n" : "";
      writeFs(filePath, header + stringifyY(parsed));
      console.log(`  → ${file}: updated (goodreadsId: ${crossMatch.goodreadsBookId})`);
      updated++;
    }
  }

  console.log(`\nGoodreads-only refresh: ${updated} files updated.`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const args = parseArgs(process.argv);

  if (args.link) {
    await runLinkPass();
    return;
  }

  // Load books.json early so both refresh paths can reuse it
  const allBooksForRefresh = loadBooksJson();

  if (args.refreshGoodreadsOnly) {
    await runGoodreadsOnlyRefresh(allBooksForRefresh);
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  const cacheTtlBook = args.refresh ? 0 : TTL_7D;

  // Reuse books.json already loaded above
  const allBooks = allBooksForRefresh;
  console.log(`Loaded ${allBooks.length} books from books.json`);
  if (allBooks.length < 10) {
    console.warn(
      `⚠️  books.json hat nur ${allBooks.length} Einträge. Erwartet: 31. ` +
      `BOOKS_JSON_PATH ENV gesetzt? Aktuell: ${process.env.BOOKS_JSON_PATH ?? "<nicht gesetzt>"}`
    );
  }

  // Load identity.yaml (optional)
  const identity = loadIdentityYaml();
  const apps: AppEntry[] = identity.apps ?? [];
  if (apps.length > 0) {
    console.log(`Loaded ${apps.length} apps from identity.yaml`);
  } else {
    console.log("No identity.yaml apps found — skipping app cross-linking");
  }

  // Determine target books
  let targetBooks: BooksJsonEntry[];
  if (args.all) {
    targetBooks = allBooks;
  } else if (args.slug) {
    const found = allBooks.find((b) => toSlug(cleanTitle(b.language === "de" ? b.title.de : b.title.en)) === args.slug);
    if (!found) {
      console.error(`No book found with slug: ${args.slug}`);
      process.exit(1);
    }
    targetBooks = [found];
  } else if (args.asin) {
    const found = allBooks.find((b) => b.asin === args.asin);
    if (!found) {
      console.error(`No book found with ASIN: ${args.asin}`);
      process.exit(1);
    }
    targetBooks = [found];
  } else {
    console.error(
      "Usage: research-book.ts <ASIN> | --slug <slug> | --all [--refresh] [--en|--de] [--link]"
    );
    process.exit(1);
  }

  // Apply language override
  if (args.langOverride) {
    targetBooks = targetBooks.map((b) => ({ ...b, language: args.langOverride! }));
  }

  console.log(`\nTarget: ${targetBooks.length} book(s)`);

  // Fetch shared resources (cached 24h)
  console.log("\nFetching shared resources...");
  const [alleBuecherHtml, goodreadsItems] = await Promise.all([
    fetchWithCache(ALLE_BUECHER_URL, "alle-buecher.html", args.refresh ? 0 : TTL_24H).catch((e) => {
      console.warn(`Warning: Could not fetch alle-buecher page: ${(e as Error).message}`);
      return "";
    }),
    fetchGoodreadsRss().catch((e) => {
      console.warn(`Warning: Goodreads RSS failed: ${(e as Error).message}`);
      return [];
    }),
  ]);

  const sectionMappings = alleBuecherHtml ? parseSectionMap(alleBuecherHtml) : [];
  console.log(`Section mappings: ${sectionMappings.length}, Goodreads items: ${goodreadsItems.length}`);

  // Fetch Goodreads author-list cross-matches (cached 24h, one fetch for all books)
  let grCrossMatches: Map<string, CrossMatchResult> | null = null;
  try {
    const { books: grDetailBooks } = await fetchAllAuthorBooks();
    const { matched } = crossMatchBooks(grDetailBooks, allBooks);
    grCrossMatches = new Map(matched.filter(m => m.matchedAsin).map(m => [m.matchedAsin!, m]));
    console.log(`Goodreads author-list: ${matched.length} cross-matches`);
  } catch (e) {
    console.warn(`⚠ Goodreads author-list fetch failed: ${(e as Error).message}`);
  }

  // Process books
  const manifest: IndexManifest = {
    generatedAt: new Date().toISOString(),
    totalBooks: targetBooks.length,
    successCount: 0,
    errorCount: 0,
    goodreadsStats: { exact: 0, isbn: 0, fuzzy: 0, unmatched: 0, unmatchedAsins: [] },
    appMatchStats: {},
    translationPairs: [],
  };

  // Track Goodreads stats and translation pairs per book
  for (const book of targetBooks) {
    const lang = book.language;
    const title = cleanTitle(lang === "de" ? book.title.de : book.title.en);

    // Pre-check Goodreads match for manifest stats
    const grMatch = matchGoodreadsToBook(book, goodreadsItems);
    if (grMatch.matchType === "exact") manifest.goodreadsStats.exact++;
    else if (grMatch.matchType === "isbn") manifest.goodreadsStats.isbn++;
    else if (grMatch.matchType === "fuzzy") manifest.goodreadsStats.fuzzy++;
    else {
      manifest.goodreadsStats.unmatched++;
      manifest.goodreadsStats.unmatchedAsins.push(book.asin);
    }

    // Track translation pairs (DE original has relatedBook pointing to EN)
    if (book.relatedBook && lang === "de") {
      manifest.translationPairs.push({
        de: toSlug(cleanTitle(book.title.de)),
        en: toSlug(cleanTitle(book.title.en)),
      });
    }

    const ok = await processBook(
      book,
      sectionMappings,
      goodreadsItems,
      apps,
      cacheTtlBook,
      today,
      grCrossMatches
    );
    if (ok) manifest.successCount++;
    else manifest.errorCount++;

    // Track app match stats
    const topics = generateTopics(
      book.asin,
      sectionMappings.find((m) => m.asin === book.asin),
      [],
      extractTitleTokens(title)
    );
    const appMatches = apps.length > 0 ? calculateAppMatches(topics, apps) : [];
    for (const match of appMatches) {
      manifest.appMatchStats[match.id] = (manifest.appMatchStats[match.id] ?? 0) + 1;
    }
  }

  // Write index manifest
  writeIndexManifest(manifest);

  // Summary
  console.log("\n--- Summary ---");
  console.log(`Total:    ${manifest.totalBooks}`);
  console.log(`Success:  ${manifest.successCount}`);
  console.log(`Errors:   ${manifest.errorCount}`);
  console.log(`Goodreads: exact=${manifest.goodreadsStats.exact}, isbn=${manifest.goodreadsStats.isbn}, fuzzy=${manifest.goodreadsStats.fuzzy}, unmatched=${manifest.goodreadsStats.unmatched}`);
  if (manifest.goodreadsStats.unmatchedAsins.length > 0) {
    console.log(`Unmatched ASINs: ${manifest.goodreadsStats.unmatchedAsins.join(", ")}`);
  }
  console.log(`Output:   output/research/`);
  console.log(`Index:    output/research/_index.yaml`);
  if (manifest.errorCount > 0) {
    console.log(`Errors:   output/research/_errors.log`);
  }
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
