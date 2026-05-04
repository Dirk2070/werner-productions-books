import { describe, test, expect } from "bun:test";
import { resolve } from "path";
import { readFileSync } from "fs";
import { generateIndices } from "../src/lib/generate-indices";

const rootDir = resolve(import.meta.dir, "..");
const booksYamlPath = resolve(rootDir, "books.yaml");

describe("generate-indices", () => {
  // Generate fresh indices first
  generateIndices({ booksYamlPath, outputDir: rootDir });

  const llmsTxt = readFileSync(resolve(rootDir, "llms.txt"), "utf-8");
  const sitemapTxt = readFileSync(resolve(rootDir, "sitemap.txt"), "utf-8");

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
    expect(sitemapTxt).toContain("https://books.werner-productions.com/");
  });

  test("sitemap.txt contains book URLs sorted alphabetically", () => {
    const lines = sitemapTxt.trim().split("\n");
    expect(lines[0]).toBe("https://books.werner-productions.com/");
    expect(lines[1]).toBe("https://books.werner-productions.com/die-dreizehn-tore/");
  });

  test("idempotency: second run changes nothing", () => {
    const results = generateIndices({ booksYamlPath, outputDir: rootDir });
    expect(results.every((r) => !r.changed)).toBe(true);
  });
});
