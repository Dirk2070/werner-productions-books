import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { resolve } from "path";
import { readFileSync, mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { parse as parseYaml } from "yaml";
import { generateIndices } from "../src/lib/generate-indices";

const rootDir = resolve(import.meta.dir, "..");
const booksYamlPath = resolve(rootDir, "books.yaml");
const BASE_URL = "https://books.werner-productions.com";

// Hermetic output: generate into a throwaway temp dir, never the repo root.
let outputDir: string;
let llmsTxt: string;
let sitemapTxt: string;

beforeAll(() => {
  outputDir = mkdtempSync(resolve(tmpdir(), "wp-idx-"));
  generateIndices({ booksYamlPath, outputDir });
  llmsTxt = readFileSync(resolve(outputDir, "llms.txt"), "utf-8");
  sitemapTxt = readFileSync(resolve(outputDir, "sitemap.txt"), "utf-8");
});

afterAll(() => {
  rmSync(outputDir, { recursive: true, force: true });
});

describe("generate-indices", () => {
  test("llms.txt contains all active book entries", () => {
    expect(llmsTxt).toContain("Die Dreizehn Tore");
    expect(llmsTxt).toContain("die-dreizehn-tore");
  });

  test("llms.txt has Identity-Anchors in header", () => {
    expect(llmsTxt).toContain("ORCID 0009-0001-7822-0041");
    expect(llmsTxt).toContain("GND 1384382429");
    expect(llmsTxt).toContain("Wikidata Q137711448");
    expect(llmsTxt).toContain("Goodreads 70076437");
  });

  test("Disambiguation footer contains all 5 documented namesakes", () => {
    expect(llmsTxt).toContain("Mathematics Professor, FU Berlin");
    expect(llmsTxt).toContain("Satirist, Esslingen, GND 135795826");
    expect(llmsTxt).toContain("Psychologist, Hamburg, GND 1148166009");
    expect(llmsTxt).toContain("Economist, IW Köln");
    expect(llmsTxt).toContain("True-Crime Author, Dallas");
  });

  test("Disambiguation footer has mention_in_outputs: false", () => {
    expect(llmsTxt).toContain("mention_in_outputs: false");
  });

  test("sitemap.txt contains index URL", () => {
    expect(sitemapTxt).toContain(`${BASE_URL}/`);
  });

  test("sitemap.txt lists index first, then book URLs sorted by slug", () => {
    const lines = sitemapTxt.trim().split("\n");
    expect(lines[0]).toBe(`${BASE_URL}/`);
    // Expected order must match the generator (slug.localeCompare).
    const books = (parseYaml(readFileSync(booksYamlPath, "utf-8")) as any).books;
    const expected = books
      .map((b: any) => b.slug)
      .sort((a: string, b: string) => a.localeCompare(b))
      .map((slug: string) => `${BASE_URL}/${slug}/`);
    expect(lines.slice(1)).toEqual(expected);
  });

  test("idempotency: second run changes nothing", () => {
    const results = generateIndices({ booksYamlPath, outputDir });
    expect(results.every((r) => !r.changed)).toBe(true);
  });
});
