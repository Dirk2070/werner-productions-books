#!/usr/bin/env bun
/**
 * research-book.ts — Universal book-research CLI
 *
 * Usage:
 *   bun scripts/research-book.ts <ASIN>           # single book by ASIN
 *   bun scripts/research-book.ts --slug <slug>    # single book by slug
 *   bun scripts/research-book.ts --all            # all books from books.json
 *   bun scripts/research-book.ts --link           # second pass (Task 9, not yet implemented)
 *
 * Flags:
 *   --refresh   ignore cache (TTL=0)
 *   --en        language override → English
 *   --de        language override → German
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { parse as parseYaml } from "yaml";
import type { BooksJsonEntry } from "../src/lib/research/types";
import { fetchWithCache } from "../src/lib/research/fetch-cache";
import { parseBookPage } from "../src/lib/research/parse-book-page";
import { parseSectionMap } from "../src/lib/research/parse-section-map";
import { fetchGoodreadsRss, matchGoodreadsToBook } from "../src/lib/research/goodreads-rss";
import { generateTopics, extractTitleTokens } from "../src/lib/research/topic-generator";
import { calculateAppMatches, type AppEntry } from "../src/lib/research/app-cross-linker";
import { buildDescriptions } from "../src/lib/research/description-builder";
import {
  writeBookYaml,
  logError,
  writeIndexManifest,
  type IndexManifest,
} from "../src/lib/research/yaml-writer";
import { toSlug } from "../src/lib/research/slug-utils";

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
const DURATION_PLACEHOLDER = 180;

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
  };

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--all") result.all = true;
    else if (a === "--refresh") result.refresh = true;
    else if (a === "--en") result.langOverride = "en";
    else if (a === "--de") result.langOverride = "de";
    else if (a === "--link") result.link = true;
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
  apps?: AppEntry[];
}

function loadIdentityYaml(): IdentityYaml {
  const candidates = [
    resolve(process.cwd(), "identity.yaml"),
    resolve(process.cwd(), "config/identity.yaml"),
  ];

  for (const p of candidates) {
    if (existsSync(p)) {
      try {
        return parseYaml(readFileSync(p, "utf-8")) as IdentityYaml;
      } catch (e) {
        console.warn(`Warning: Could not parse identity.yaml at ${p}: ${(e as Error).message}`);
      }
    }
  }

  return {}; // not found → skip app cross-linking
}

// ---------------------------------------------------------------------------
// Cover dimensions
// ---------------------------------------------------------------------------

async function getCoverDimensions(asin: string): Promise<{ width: number; height: number }> {
  try {
    const url = `https://dirkwernerbooks.com/images/${asin}-800.webp`;
    const resp = await fetch(url, {
      headers: { "User-Agent": "WernerProductionsResearch/1.0" },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const buffer = Buffer.from(await resp.arrayBuffer());
    const { default: imageSize } = await import("image-size");
    const dims = imageSize(buffer);
    if (dims.width && dims.height) return { width: dims.width, height: dims.height };
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
  today: string
): Promise<boolean> {
  const lang = book.language;
  const title = lang === "de" ? book.title.de : book.title.en;
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
  const grMatch = matchGoodreadsToBook(book, goodreadsItems);
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

  // eBook (always present)
  const ebookUrls: Record<string, string> = {};
  if (book.link) ebookUrls["amazon"] = book.link;
  if (book.links) Object.assign(ebookUrls, book.links);
  workExample.push({
    format: "ebook",
    asin,
    publisher: PUBLISHER,
    publicationDate: PUBLICATION_DATE_PLACEHOLDER,
    urls: ebookUrls,
  });

  // Paperback
  if (book.hasPaperback) {
    const pbEntry: Record<string, unknown> = {
      format: "paperback",
      publisher: PUBLISHER,
      publicationDate: PUBLICATION_DATE_PLACEHOLDER,
      urls: {},
    };
    if (paperbackIsbn) pbEntry.isbn = paperbackIsbn;
    if (book.paperbackAsin) pbEntry.asin = book.paperbackAsin;
    workExample.push(pbEntry);
  }

  // Audiobook
  if (book.hasAudiobook) {
    const abUrls: Record<string, string> = {};
    if (appleAudioId) {
      abUrls["apple"] = `https://books.apple.com/audiobook/id${appleAudioId}`;
    }
    workExample.push({
      format: "audiobook",
      publisher: PUBLISHER,
      publicationDate: PUBLICATION_DATE_PLACEHOLDER,
      narrator: NARRATOR_PLACEHOLDER,
      durationMinutes: DURATION_PLACEHOLDER,
      urls: abUrls,
    });
  }

  // 10. Assemble workTranslation / translationOfWork
  // Convention: DE = original, EN = translation
  // relatedBook is the ASIN of the sibling language edition
  const relatedBookSlug = book.relatedBook
    ? toSlug(lang === "de" ? book.title.en : book.title.de)
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

  // 11. alternateName: only for monolingual books (no relatedBook)
  const alternateName: string[] | undefined =
    !book.relatedBook
      ? [lang === "de" ? book.title.en : book.title.de].filter(Boolean)
      : undefined;

  // 12. searchHints: other-language title tokens (only when no relatedBook, i.e. not a bilingual pair)
  const otherLangTitle = lang === "de" ? book.title.en : book.title.de;
  const searchHints: string[] | undefined =
    !book.relatedBook && otherLangTitle
      ? extractTitleTokens(otherLangTitle).slice(0, 5)
      : undefined;

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
    dateModified: today,
  };

  if (grMatch.goodreadsBookId) {
    bookData.goodreadsBookId = grMatch.goodreadsBookId;
  }

  if (alternateName && alternateName.length > 0) {
    bookData.alternateName = alternateName;
  }

  if (searchHints && searchHints.length > 0) {
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
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const args = parseArgs(process.argv);

  // --link: Task 9 placeholder
  if (args.link) {
    console.log("Link pass not implemented yet.");
    process.exit(0);
  }

  const today = new Date().toISOString().slice(0, 10);
  const cacheTtlBook = args.refresh ? 0 : TTL_7D;

  // Load books.json
  const allBooks = loadBooksJson();
  console.log(`Loaded ${allBooks.length} books from books.json`);

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
    const found = allBooks.find((b) => toSlug(b.language === "de" ? b.title.de : b.title.en) === args.slug);
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
    const title = lang === "de" ? book.title.de : book.title.en;

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
        de: toSlug(book.title.de),
        en: toSlug(book.title.en),
      });
    }

    const ok = await processBook(
      book,
      sectionMappings,
      goodreadsItems,
      apps,
      cacheTtlBook,
      today
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
