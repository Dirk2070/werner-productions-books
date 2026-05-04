import { describe, test, expect } from "bun:test";
import { resolve } from "path";
import { bookSchema, booksFileSchema, validateBooksYaml } from "../src/lib/books-schema";
import { parse as parseYaml } from "yaml";
import { readFileSync } from "fs";

// Load real entry as base for mutations
const yamlPath = resolve(import.meta.dir, "..", "books.yaml");
const realData = parseYaml(readFileSync(yamlPath, "utf-8")) as any;
const validEntry = structuredClone(realData.books[0]);

function makeFile(books: any[]) {
  return { books };
}

describe("books-schema", () => {
  test("valid Dreizehn Tore entry passes", () => {
    const result = bookSchema.safeParse(validEntry);
    expect(result.success).toBe(true);
  });

  test("full file validation passes", () => {
    const result = validateBooksYaml(yamlPath);
    expect(result.valid).toBe(true);
  });

  test("missing slug fails", () => {
    const bad = structuredClone(validEntry);
    delete bad.slug;
    const result = bookSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  test("invalid slug (uppercase) fails", () => {
    const bad = structuredClone(validEntry);
    bad.slug = "Die Dreizehn Tore";
    const result = bookSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  test("invalid ISBN format fails", () => {
    const bad = structuredClone(validEntry);
    bad.workExample[0].isbn = "979-8233102592"; // mixed format
    const result = bookSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  test("ASIN with wrong prefix fails", () => {
    const bad = structuredClone(validEntry);
    bad.workExample[0].asin = "X0GB13C18Y";
    const result = bookSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  test("description.meta > 155 chars fails", () => {
    const bad = structuredClone(validEntry);
    bad.descriptions.meta = "x".repeat(156);
    const result = bookSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  test("BISAC without 6-digit code fails", () => {
    const bad = structuredClone(validEntry);
    bad.bisac = ["FIC03"];
    const result = bookSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  test("workTranslation referencing non-existent slug fails cross-validation", () => {
    // Write a temp file with a dangling workTranslation reference
    const { writeFileSync, unlinkSync } = require("fs");
    const { stringify } = require("yaml");
    const tmpPath = resolve(import.meta.dir, "..", "books.test-tmp.yaml");
    const entry = structuredClone(validEntry);
    entry.workTranslation = ["non-existent-slug"];
    writeFileSync(tmpPath, stringify({ books: [entry] }));
    try {
      const result = validateBooksYaml(tmpPath);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.errors.some((e: string) => e.includes("non-existent-slug"))).toBe(true);
      }
    } finally {
      unlinkSync(tmpPath);
    }
  });

  test("audiobook without narrator fails", () => {
    const bad = structuredClone(validEntry);
    bad.workExample[2].narrator = undefined;
    bad.workExample[2].durationMinutes = undefined;
    const result = bookSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });
});
