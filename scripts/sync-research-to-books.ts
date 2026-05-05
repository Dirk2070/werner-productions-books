#!/usr/bin/env bun
/**
 * sync-research-to-books.ts
 * Synchronises fields from output/research/<slug>.yaml → books.yaml (SSoT).
 *
 * Usage:
 *   bun scripts/sync-research-to-books.ts <slug>
 *   bun scripts/sync-research-to-books.ts --all
 *   bun scripts/sync-research-to-books.ts --dry-run <slug>
 *   bun scripts/sync-research-to-books.ts --overwrite-fields f1,f2 <slug>
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import { validateBooksYaml } from "../src/lib/books-schema.ts";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const __dir = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dir, "..");
const BOOKS_YAML = join(REPO_ROOT, "books.yaml");
const RESEARCH_DIR = join(REPO_ROOT, "output", "research");

/**
 * Fields that are ALWAYS written from research → books (override).
 * Dot-notation for nested paths.
 */
const DEFAULT_OVERRIDE_FIELDS = [
  "descriptions.marketing",
  "reviews",
  "mentions",
  "searchHints",
  "alternateName",
  "goodreadsBookId",
];

/**
 * Fields that are written from research → books ONLY when the books.yaml
 * value is empty / null / [].
 */
const FILL_FIELDS = ["keywords", "knowsAbout", "bisac", "cover", "dateModified"];

/**
 * Fields that are NEVER overwritten (manually structured in books.yaml).
 */
const _NEVER_OVERRIDE = new Set([
  "slug",
  "title",
  "subtitle",
  "language",
  "authors",
  "workExample",
]);

// ---------------------------------------------------------------------------
// CLI parsing
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
sync-research-to-books — sync output/research/<slug>.yaml → books.yaml (SSoT)

Usage:
  bun run sync:research <slug>              # sync a single book
  bun run sync:research --all               # sync every book in output/research/
  bun run sync:research --dry-run <slug>    # preview, no files written
  bun run sync:research <slug> --overwrite-fields f1,f2,...

Default-overrides: marketing, reviews, mentions, searchHints,
                   alternateName, goodreadsBookId
Other fields are merge-fill (only written if empty in books.yaml)

To override descriptions explicitly:
  bun run sync:research <slug> --overwrite-fields meta,short,long
`.trim());
  process.exit(0);
}

const dryRun = args.includes("--dry-run");
const allBooks = args.includes("--all");

// Short-name aliases so users can pass `--overwrite-fields meta,short,long`
// instead of the full dot-path.
const FIELD_ALIASES: Record<string, string> = {
  meta: "descriptions.meta",
  short: "descriptions.short",
  long: "descriptions.long",
  marketing: "descriptions.marketing",
};

let overrideFields = DEFAULT_OVERRIDE_FIELDS;
const owIdx = args.indexOf("--overwrite-fields");
if (owIdx !== -1 && args[owIdx + 1]) {
  overrideFields = args[owIdx + 1]
    .split(",")
    .map((s) => s.trim())
    .map((s) => FIELD_ALIASES[s] ?? s);
}

// Collect target slugs
const owFieldValue = owIdx !== -1 ? args[owIdx + 1] : null;

let targetSlugs: string[] = [];
if (allBooks) {
  const files = readdirSync(RESEARCH_DIR).filter(
    (f) => f.endsWith(".yaml") && !f.startsWith("_")
  );
  targetSlugs = files.map((f) => f.replace(/\.yaml$/, ""));
} else {
  const slug = args.find((a) => !a.startsWith("--") && a !== owFieldValue);
  if (!slug) {
    console.error("Usage: bun scripts/sync-research-to-books.ts [--dry-run] [--all] [--overwrite-fields f1,f2] <slug>");
    process.exit(1);
  }
  targetSlugs = [slug];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Get a nested value by dot-path from an object. */
function getPath(obj: any, path: string): any {
  return path.split(".").reduce((cur, key) => cur?.[key], obj);
}

/** Set a nested value by dot-path on an object (mutates). */
function setPath(obj: any, path: string, value: any): void {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (cur[parts[i]] == null || typeof cur[parts[i]] !== "object") {
      cur[parts[i]] = {};
    }
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

/** True when a value is considered "empty" (fill-mode check). */
function isEmpty(val: any): boolean {
  if (val == null) return true;
  if (Array.isArray(val) && val.length === 0) return true;
  if (typeof val === "string" && val.trim() === "") return true;
  return false;
}

/** Format a timestamp for backup filenames (colons → dashes). */
function timestamp(): string {
  return new Date().toISOString().replace(/:/g, "-").replace(/\..+$/, "");
}

// ---------------------------------------------------------------------------
// Core sync logic for a single book
// ---------------------------------------------------------------------------

interface SyncStats {
  overridden: number;
  filled: number;
  crossRefsFiltered: number;
  changed: boolean;
  log: string[];
}

function syncBook(
  bookEntry: any,
  researchEntry: any,
  allSlugs: Set<string>,
  fields: string[]
): SyncStats {
  const stats: SyncStats = { overridden: 0, filled: 0, crossRefsFiltered: 0, changed: false, log: [] };

  // --- Override fields ---
  for (const field of fields) {
    const resVal = getPath(researchEntry, field);
    if (resVal === undefined) continue; // research has no value → skip

    const booksVal = getPath(bookEntry, field);
    const valStr = JSON.stringify(resVal);
    const booksStr = JSON.stringify(booksVal);

    if (valStr === booksStr) continue; // identical → skip

    const wasDesc = booksVal == null ? "empty" : JSON.stringify(booksVal).slice(0, 60);
    setPath(bookEntry, field, resVal);
    stats.overridden++;
    stats.changed = true;

    const wordCount = typeof resVal === "string"
      ? `, +${resVal.split(/\s+/).filter(Boolean).length} words`
      : Array.isArray(resVal)
      ? `, +${resVal.length} entries`
      : "";
    stats.log.push(`  override: ${field} (was ${wasDesc}${wordCount})`);
  }

  // --- Fill fields ---
  for (const field of FILL_FIELDS) {
    const booksVal = getPath(bookEntry, field);
    if (!isEmpty(booksVal)) continue; // already has content → skip

    const resVal = getPath(researchEntry, field);
    if (resVal === undefined || resVal === null) continue;

    setPath(bookEntry, field, resVal);
    stats.filled++;
    stats.changed = true;
    stats.log.push(`  fill:     ${field} (was empty, set to ${JSON.stringify(resVal).slice(0, 60)})`);
  }

  // --- Author-blanket review attribution: ensure designated books always carry it ---
  // Prairies Book Review is an author-blanket quote; the parser strips it from all books
  // except `the-battle-within`, but the battle-within detail-page itself doesn't carry the
  // quote anymore — so we explicitly attach it here.
  const REVIEW_FORCE_INCLUDE: Record<string, any[]> = {
    "the-battle-within": [
      {
        quote: "Exquisitely simple, thought-provoking, and thoroughly readable",
        source: "The Prairies Book Review",
        attribution: "Dirk Werner",
      },
    ],
  };
  const forcedReviews = REVIEW_FORCE_INCLUDE[bookEntry.slug];
  if (forcedReviews) {
    const existing: any[] = bookEntry.reviews ?? [];
    const missing = forcedReviews.filter(
      (fr) => !existing.some((er) => er.source === fr.source && er.quote === fr.quote)
    );
    if (missing.length > 0) {
      bookEntry.reviews = [...existing, ...missing];
      stats.changed = true;
      stats.log.push(`  review:   force-include ${missing.length} blanket review(s)`);
    }
  }

  // --- Genre-override: thriller/mystery/crime always get shadow + psy ---
  // Uses books.yaml bisac (manually curated SSoT), not research yaml bisac.
  const THRILLER_PREFIXES = ["FIC022", "FIC031", "FIC050"];
  const bookBisac: string[] = bookEntry.bisac ?? [];
  const isThriller = bookBisac.some((c: string) =>
    THRILLER_PREFIXES.some((p) => c.startsWith(p))
  );
  if (isThriller) {
    const required = [
      "https://shadow-integrator.com/#app",
      "https://psyprofiler.com/#app",
    ];
    const current: string[] = (bookEntry.mentions ?? []).map((m: any) => m.id);
    const toAdd = required.filter((id) => !current.includes(id));
    if (toAdd.length > 0) {
      bookEntry.mentions = [
        ...(bookEntry.mentions ?? []),
        ...toAdd.map((id) => ({ id })),
      ];
      stats.changed = true;
      stats.log.push(
        `  genre:    thriller-bisac → +${toAdd.length} mention(s) [${toAdd.join(", ")}]`
      );
    }
  }

  // --- Cross-ref filter: workTranslation, relatedBooks ---
  for (const refField of ["workTranslation", "relatedBooks"] as const) {
    const refs: string[] = bookEntry[refField] ?? [];
    const filtered = refs.filter((slug) => allSlugs.has(slug));
    const removed = refs.filter((slug) => !allSlugs.has(slug));
    if (removed.length > 0) {
      bookEntry[refField] = filtered;
      stats.crossRefsFiltered += removed.length;
      stats.changed = true;
      stats.log.push(
        `  filter:   ${refField} [${removed.join(", ")}] → [] (slug missing in books.yaml)`
      );
    }
  }

  return stats;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // Load books.yaml
  const booksRaw = readFileSync(BOOKS_YAML, "utf-8");
  const booksData: any = parseYaml(booksRaw);
  const booksList: any[] = booksData.books ?? [];

  // Build slug index
  const allSlugs = new Set<string>(booksList.map((b: any) => b.slug));

  let totalOverridden = 0;
  let totalFilled = 0;
  let totalFiltered = 0;
  const synced: string[] = [];
  let anyChange = false;

  for (const slug of targetSlugs) {
    const researchPath = join(RESEARCH_DIR, `${slug}.yaml`);
    if (!existsSync(researchPath)) {
      console.log(`[skip] ${slug} — no research file at ${researchPath}`);
      continue;
    }

    const researchRaw = readFileSync(researchPath, "utf-8");
    const researchData: any = parseYaml(researchRaw);
    // research YAMLs have a `books: [...]` wrapper
    const researchEntries: any[] = researchData.books ?? [researchData];
    const researchEntry = researchEntries.find((b: any) => b.slug === slug) ?? researchEntries[0];

    if (!researchEntry) {
      console.log(`[skip] ${slug} — no matching entry in research YAML`);
      continue;
    }

    console.log(`[sync] ${slug}`);

    const existingIdx = booksList.findIndex((b: any) => b.slug === slug);

    if (existingIdx === -1) {
      // --- Append path: slug not in books.yaml → append entire research entry ---
      booksList.push(researchEntry);
      allSlugs.add(slug);
      synced.push(slug);
      anyChange = true;
      console.log(`  append:   ${slug} (new entry, not previously in books.yaml)`);
      continue;
    }

    // --- Merge path ---
    const stats = syncBook(booksList[existingIdx], researchEntry, allSlugs, overrideFields);

    if (stats.log.length === 0 && !stats.changed) {
      console.log(`  no changes`);
      continue;
    }

    stats.log.forEach((l) => console.log(l));
    totalOverridden += stats.overridden;
    totalFilled += stats.filled;
    totalFiltered += stats.crossRefsFiltered;
    if (stats.changed) {
      synced.push(slug);
      anyChange = true;
    }
  }

  if (!anyChange) {
    console.log("\n=== Sync Summary ===");
    console.log("No changes — books.yaml already up to date.");
    return;
  }

  // Serialize back to YAML
  const newYaml = stringifyYaml(booksData, {
    lineWidth: 120,
    defaultStringType: "PLAIN",
    defaultKeyType: "PLAIN",
  });

  if (dryRun) {
    console.log("\n--- DRY RUN diff (new YAML preview, first 60 lines) ---");
    newYaml.split("\n").slice(0, 60).forEach((l) => console.log(l));
    console.log("\n=== Sync Summary (DRY RUN — no files written) ===");
  } else {
    // Backup
    const backupPath = `${BOOKS_YAML}.bak.${timestamp()}`;
    copyFileSync(BOOKS_YAML, backupPath);
    console.log(`\n  backup:   ${backupPath}`);

    writeFileSync(BOOKS_YAML, newYaml, "utf-8");

    // Validate
    const validation = validateBooksYaml(BOOKS_YAML);
    const validStatus = validation.valid ? "✓ valid" : `✗ INVALID\n  ${(validation as any).errors?.join("\n  ")}`;

    console.log("\n=== Sync Summary ===");
    console.log(`Books synced:       ${synced.length} (${synced.join(", ")})`);
    console.log(`Fields overridden:  ${totalOverridden}`);
    console.log(`Fields filled:      ${totalFilled}`);
    console.log(`Cross-refs filtered:${totalFiltered}`);
    console.log(`Backup:             ${backupPath}`);
    console.log(`Validation:         ${validStatus}`);

    if (!validation.valid) {
      process.exit(1);
    }
    return;
  }

  console.log(`Books synced:       ${synced.length} (${synced.join(", ")})`);
  console.log(`Fields overridden:  ${totalOverridden}`);
  console.log(`Fields filled:      ${totalFilled}`);
  console.log(`Cross-refs filtered:${totalFiltered}`);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
