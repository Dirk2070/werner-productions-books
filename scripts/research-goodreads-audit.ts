#!/usr/bin/env bun
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve } from "path";
import { stringify as stringifyYaml } from "yaml";
import { fetchAllAuthorBooks, crossMatchBooks } from "../src/lib/research/goodreads-author-list";
import type { BooksJsonEntry } from "../src/lib/research/types";

const rootDir = resolve(import.meta.dir, "..");
const booksJsonPath = process.env.BOOKS_JSON_PATH || resolve(rootDir, "books.json");
const outputDir = resolve(rootDir, "output/research");

async function main() {
  // Load books.json
  const booksJson: BooksJsonEntry[] = JSON.parse(readFileSync(booksJsonPath, "utf-8"));
  console.log(`Loaded ${booksJson.length} books from books.json`);

  // Fetch all author books from Goodreads
  console.log("\nFetching Goodreads author books...");
  const { books, errors } = await fetchAllAuthorBooks();
  console.log(`\nFetched ${books.length} book details, ${errors.length} errors`);

  // Cross-match
  console.log("\nCross-matching against books.json...");
  const { matched, unmappedGoodreads, missingOnGoodreads } = crossMatchBooks(books, booksJson);

  // Build audit manifest
  const manifest = {
    fetched_at: new Date().toISOString(),
    total_listed: books.length + errors.length,
    details_parsed: books.length,
    errors: errors.length,
    match_stats: {
      asin: matched.filter(m => m.matchType === "asin").length,
      isbn: matched.filter(m => m.matchType === "isbn").length,
      title_exact: matched.filter(m => m.matchType === "title-exact").length,
      title_fuzzy: matched.filter(m => m.matchType === "title-fuzzy").length,
      total_matched: matched.length,
    },
    books: matched.map(m => ({
      goodreads_id: m.goodreadsBookId,
      title: m.goodreadsTitle,
      isbn: m.detail.isbn || null,
      pages: m.detail.pages || null,
      published: m.detail.publishedDate || m.detail.publishedYear || null,
      description_chars: m.detail.description?.length || 0,
      asin_match: m.matchedAsin,
      match_type: m.matchType,
      confidence: m.confidence,
      has_description: !!m.detail.description,
    })),
    unmapped_to_books_json: unmappedGoodreads.map(g => ({
      goodreads_id: g.goodreadsBookId,
      title: g.title,
    })),
    missing_on_goodreads: missingOnGoodreads.map(b => ({
      asin: b.asin,
      title_de: b.title.de,
      title_en: b.title.en,
    })),
    fetch_errors: errors,
  };

  // Write output
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(resolve(outputDir, "goodreads-audit.yaml"), stringifyYaml(manifest));

  // Console summary
  console.log("\n--- Audit Summary ---");
  console.log(`Total Goodreads books: ${manifest.total_listed}`);
  console.log(`Details parsed: ${manifest.details_parsed}`);
  console.log(`Matched to books.json: ${manifest.match_stats.total_matched}`);
  console.log(`  ASIN: ${manifest.match_stats.asin}`);
  console.log(`  ISBN: ${manifest.match_stats.isbn}`);
  console.log(`  Title exact: ${manifest.match_stats.title_exact}`);
  console.log(`  Title fuzzy: ${manifest.match_stats.title_fuzzy}`);
  console.log(`Unmapped (Goodreads only): ${unmappedGoodreads.length}`);
  console.log(`Missing on Goodreads: ${missingOnGoodreads.length}`);
  if (errors.length > 0) console.log(`Errors: ${errors.length}`);
  console.log(`\nAudit saved to: output/research/goodreads-audit.yaml`);
}

main().catch(console.error);
