import { describe, test, expect } from "bun:test";
import { resolve } from "path";
import { readFileSync, existsSync, unlinkSync, rmSync } from "fs";
import { generateBookPages } from "../src/lib/generate-pages";

const rootDir = resolve(import.meta.dir, "..");
const booksYamlPath = resolve(rootDir, "books.yaml");
const outputDir = rootDir;

describe("generate-pages", () => {
  test("Dreizehn Tore output has author-@id reference on Index node", () => {
    const jsonLd = JSON.parse(
      readFileSync(resolve(rootDir, "die-dreizehn-tore", "schema-org.jsonld"), "utf-8")
    );
    const book = jsonLd["@graph"].find((n: any) => n["@type"] === "Book");
    expect(book.author["@id"]).toBe("https://books.werner-productions.com/#author");
  });

  test("output has WebPage node with mainEntity cross-ref", () => {
    const jsonLd = JSON.parse(
      readFileSync(resolve(rootDir, "die-dreizehn-tore", "schema-org.jsonld"), "utf-8")
    );
    const page = jsonLd["@graph"].find((n: any) => n["@type"] === "WebPage");
    expect(page).toBeDefined();
    expect(page.mainEntity["@id"]).toBe(
      "https://books.werner-productions.com/die-dreizehn-tore/#book"
    );
  });

  test("workExample contains EBook, Paperback, AudiobookFormat", () => {
    const jsonLd = JSON.parse(
      readFileSync(resolve(rootDir, "die-dreizehn-tore", "schema-org.jsonld"), "utf-8")
    );
    const book = jsonLd["@graph"].find((n: any) => n["@type"] === "Book");
    const formats = book.workExample.map((e: any) => e.bookFormat);
    expect(formats).toContain("https://schema.org/EBook");
    expect(formats).toContain("https://schema.org/Paperback");
    expect(formats).toContain("https://schema.org/AudiobookFormat");
  });

  test("BuyAction per platform URL", () => {
    const jsonLd = JSON.parse(
      readFileSync(resolve(rootDir, "die-dreizehn-tore", "schema-org.jsonld"), "utf-8")
    );
    const book = jsonLd["@graph"].find((n: any) => n["@type"] === "Book");
    const ebook = book.workExample.find(
      (e: any) => e.bookFormat === "https://schema.org/EBook"
    );
    expect(ebook.potentialAction.length).toBeGreaterThan(0);
    expect(ebook.potentialAction[0]["@type"]).toBe("BuyAction");
    expect(ebook.potentialAction[0].target).toContain("amazon");
  });

  test("Audiobook has readBy and duration", () => {
    const jsonLd = JSON.parse(
      readFileSync(resolve(rootDir, "die-dreizehn-tore", "schema-org.jsonld"), "utf-8")
    );
    const book = jsonLd["@graph"].find((n: any) => n["@type"] === "Book");
    const audiobook = book.workExample.find(
      (e: any) => e["@type"] === "Audiobook"
    );
    expect(audiobook.readBy.name).toBe("AI Voice (Werner Productions)");
    expect(audiobook.duration).toBe("PT357M");
  });

  test("idempotency: second run writes nothing", () => {
    const results = generateBookPages({
      booksYamlPath,
      outputDir,
      slugFilter: "die-dreizehn-tore",
    });
    expect(results[0].changed).toBe(false);
  });

  test("HTML has correct lang attribute", () => {
    const html = readFileSync(
      resolve(rootDir, "die-dreizehn-tore", "index.html"),
      "utf-8"
    );
    expect(html).toContain('<html lang="de">');
  });

  test("HTML has OpenGraph tags", () => {
    const html = readFileSync(
      resolve(rootDir, "die-dreizehn-tore", "index.html"),
      "utf-8"
    );
    expect(html).toContain('og:type" content="book"');
    expect(html).toContain('og:locale" content="de_DE"');
  });
});
