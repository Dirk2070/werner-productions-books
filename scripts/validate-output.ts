import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { parse as parseYaml } from "yaml";
import { validateBooksYaml } from "../src/lib/books-schema";

const BASE_URL = "https://books.werner-productions.com";
const AUTHOR_ID = `${BASE_URL}/#author`;

const args = process.argv.slice(2);
const checkUrls = args.includes("--check-urls");
const checkDimensions = args.includes("--check-dimensions");

const rootDir = resolve(import.meta.dir, "..");
const booksYamlPath = resolve(rootDir, "books.yaml");

interface CheckResult {
  slug: string;
  passed: number;
  failed: number;
  errors: string[];
  warnings: string[];
}

async function validateBook(book: any): Promise<CheckResult> {
  const result: CheckResult = { slug: book.slug, passed: 0, failed: 0, errors: [], warnings: [] };
  const bookDir = resolve(rootDir, book.slug);

  function pass() { result.passed++; }
  function fail(msg: string) { result.failed++; result.errors.push(msg); }
  function warn(msg: string) { result.warnings.push(msg); }

  // --- 1. HTML Validity ---
  const htmlPath = resolve(bookDir, "index.html");
  if (!existsSync(htmlPath)) {
    fail("index.html not found");
    return result;
  }
  const html = readFileSync(htmlPath, "utf-8");

  // Check: exactly one JSON-LD script
  const jsonLdMatches = html.match(/<script type="application\/ld\+json">/g);
  if (jsonLdMatches && jsonLdMatches.length === 1) {
    pass();
  } else {
    fail(`Expected 1 JSON-LD script tag, found ${jsonLdMatches?.length ?? 0}`);
  }

  // Check: html lang matches book.language
  const langMatch = html.match(/<html lang="([^"]+)">/);
  if (langMatch && langMatch[1] === book.language) {
    pass();
  } else {
    fail(`<html lang="${langMatch?.[1]}"> does not match book language "${book.language}"`);
  }

  // --- 2. JSON-LD Validity ---
  const jsonLdPath = resolve(bookDir, "schema-org.jsonld");
  if (!existsSync(jsonLdPath)) {
    fail("schema-org.jsonld not found");
    return result;
  }

  let jsonLd: any;
  try {
    jsonLd = JSON.parse(readFileSync(jsonLdPath, "utf-8"));
    pass(); // JSON.parse successful
  } catch (e) {
    fail(`JSON parse error: ${(e as Error).message}`);
    return result;
  }

  // Check: @context
  if (jsonLd["@context"] === "https://schema.org") {
    pass();
  } else {
    fail(`Missing or wrong @context: ${jsonLd["@context"]}`);
  }

  // Check: @graph has Book + WebPage
  const graph = jsonLd["@graph"] || [];
  const bookNode = graph.find((n: any) => n["@type"] === "Book");
  const webPageNode = graph.find((n: any) => n["@type"] === "WebPage");

  if (bookNode) { pass(); } else { fail("No Book node in @graph"); }
  if (webPageNode) { pass(); } else { fail("No WebPage node in @graph"); }

  if (bookNode) {
    // Check: Book @id matches URL pattern
    const expectedBookId = `${BASE_URL}/${book.slug}/#book`;
    if (bookNode["@id"] === expectedBookId) {
      pass();
    } else {
      fail(`Book @id "${bookNode["@id"]}" does not match expected "${expectedBookId}"`);
    }

    // Check: author @id matches Index author node
    if (bookNode.author?.["@id"] === AUTHOR_ID) {
      pass();
    } else {
      fail(`author @id "${bookNode.author?.["@id"]}" does not match "${AUTHOR_ID}"`);
    }
  }

  // --- 3. Cover Existence ---
  const coverPath = resolve(rootDir, book.cover.filename);
  if (existsSync(coverPath)) {
    pass();
  } else {
    fail(`Cover not found at ${book.cover.filename}`);
  }

  // Check dimensions (optional)
  if (checkDimensions && existsSync(coverPath)) {
    try {
      const sharp = (await import("sharp")).default;
      const meta = await sharp(coverPath).metadata();
      if (meta.width === book.cover.dimensions.width && meta.height === book.cover.dimensions.height) {
        pass();
      } else {
        fail(`Cover dimensions ${meta.width}x${meta.height} do not match YAML ${book.cover.dimensions.width}x${book.cover.dimensions.height}`);
      }
    } catch {
      warn("sharp not installed — skipping dimension check");
    }
  }

  // --- 4. Cross-References ---
  const allSlugs = new Set(
    (parseYaml(readFileSync(booksYamlPath, "utf-8")) as any).books.map((b: any) => b.slug)
  );

  for (const ref of book.workTranslation || []) {
    const refDir = resolve(rootDir, ref, "index.html");
    if (existsSync(refDir)) {
      pass();
    } else {
      warn(`workTranslation "${ref}" subpage not yet generated`);
    }
  }
  for (const ref of book.translationOfWork || []) {
    const refDir = resolve(rootDir, ref, "index.html");
    if (existsSync(refDir)) {
      pass();
    } else {
      warn(`translationOfWork "${ref}" subpage not yet generated`);
    }
  }
  for (const ref of book.relatedBooks || []) {
    if (!allSlugs.has(ref)) {
      fail(`relatedBooks slug "${ref}" not found in books.yaml`);
    } else {
      pass();
    }
  }

  // --- 5. URL Reachability (optional) ---
  if (checkUrls) {
    for (const edition of book.workExample || []) {
      for (const [platform, url] of Object.entries(edition.urls || {})) {
        try {
          const res = await fetch(url as string, { method: "HEAD", redirect: "follow" });
          if (res.ok || (res.status >= 300 && res.status < 400)) {
            pass();
          } else if (res.status === 404) {
            warn(`${platform}: ${url} returned 404`);
          } else {
            warn(`${platform}: ${url} returned ${res.status}`);
          }
        } catch (e) {
          warn(`${platform}: ${url} fetch failed`);
        }
      }
    }
  }

  return result;
}

// --- Main ---
async function main() {
  const validation = validateBooksYaml(booksYamlPath);
  if (!validation.valid) {
    console.error("✗ books.yaml invalid:");
    validation.errors.forEach((e) => console.error(`  ${e}`));
    process.exit(1);
  }

  const { books } = validation.data;
  let totalPassed = 0;
  let totalFailed = 0;
  const failedSlugs: string[] = [];

  for (const book of books) {
    const result = await validateBook(book);
    totalPassed += result.passed;
    totalFailed += result.failed;

    if (result.failed === 0) {
      console.log(`✓ ${result.slug}: ${result.passed} checks passed`);
    } else {
      console.log(`✗ ${result.slug}: ${result.passed} passed, ${result.failed} failed`);
      result.errors.forEach((e) => console.log(`    ✗ ${e}`));
      failedSlugs.push(result.slug);
    }
    if (result.warnings.length > 0) {
      result.warnings.forEach((w) => console.log(`    ⚠ ${w}`));
    }
  }

  console.log(
    `\nSummary: ${books.length - failedSlugs.length}/${books.length} passed, ${failedSlugs.length} failed (${totalPassed} checks passed, ${totalFailed} failed)`
  );

  process.exit(failedSlugs.length > 0 ? 1 : 0);
}

main();
