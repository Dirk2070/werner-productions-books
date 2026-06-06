import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { resolve } from "path";
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "fs";
import { tmpdir } from "os";
import { parse as parseYaml, stringify } from "yaml";
import { generateBookPages } from "../src/lib/generate-pages";

const rootDir = resolve(import.meta.dir, "..");
const booksYamlPath = resolve(rootDir, "books.yaml");

// Hermetic output: generate into a throwaway temp dir, never the repo root.
let outputDir: string;

beforeAll(() => {
  outputDir = mkdtempSync(resolve(tmpdir(), "wp-pages-"));
  // Generate the reference book once so the read-tests below have input.
  generateBookPages({ booksYamlPath, outputDir, slugFilter: "die-dreizehn-tore" });
});

afterAll(() => {
  rmSync(outputDir, { recursive: true, force: true });
});

const jsonLdOf = (slug: string) =>
  JSON.parse(readFileSync(resolve(outputDir, slug, "schema-org.jsonld"), "utf-8"));

describe("generate-pages", () => {
  test("Dreizehn Tore output has author-@id reference on Index node", () => {
    const jsonLd = jsonLdOf("die-dreizehn-tore");
    const book = jsonLd["@graph"].find((n: any) => n["@type"] === "Book");
    expect(book.author["@id"]).toBe("https://books.werner-productions.com/#author");
  });

  test("output has WebPage node with mainEntity cross-ref", () => {
    const jsonLd = jsonLdOf("die-dreizehn-tore");
    const page = jsonLd["@graph"].find((n: any) => n["@type"] === "WebPage");
    expect(page).toBeDefined();
    expect(page.mainEntity["@id"]).toBe(
      "https://books.werner-productions.com/die-dreizehn-tore/#book"
    );
  });

  test("workExample contains EBook, Paperback, AudiobookFormat", () => {
    const jsonLd = jsonLdOf("die-dreizehn-tore");
    const book = jsonLd["@graph"].find((n: any) => n["@type"] === "Book");
    const formats = book.workExample.map((e: any) => e.bookFormat);
    expect(formats).toContain("https://schema.org/EBook");
    expect(formats).toContain("https://schema.org/Paperback");
    expect(formats).toContain("https://schema.org/AudiobookFormat");
  });

  test("BuyAction per platform URL", () => {
    const jsonLd = jsonLdOf("die-dreizehn-tore");
    const book = jsonLd["@graph"].find((n: any) => n["@type"] === "Book");
    const ebook = book.workExample.find(
      (e: any) => e.bookFormat === "https://schema.org/EBook"
    );
    expect(ebook.potentialAction.length).toBeGreaterThan(0);
    expect(ebook.potentialAction[0]["@type"]).toBe("BuyAction");
    expect(ebook.potentialAction[0].target).toContain("amazon");
  });

  test("Audiobook has readBy and duration", () => {
    const jsonLd = jsonLdOf("die-dreizehn-tore");
    const book = jsonLd["@graph"].find((n: any) => n["@type"] === "Book");
    const audiobook = book.workExample.find(
      (e: any) => e["@type"] === "Audiobook"
    );
    expect(audiobook.readBy.name).toBe("AI Voice (Werner Productions)");
    expect(audiobook.duration).toBe("PT357M");
  });

  test("idempotency: second run writes nothing", () => {
    // beforeAll already generated this slug into outputDir, so a re-run is a no-op.
    const results = generateBookPages({
      booksYamlPath,
      outputDir,
      slugFilter: "die-dreizehn-tore",
    });
    expect(results[0].changed).toBe(false);
  });

  test("HTML has correct lang attribute", () => {
    const html = readFileSync(
      resolve(outputDir, "die-dreizehn-tore", "index.html"),
      "utf-8"
    );
    expect(html).toContain('<html lang="de">');
  });

  test("HTML has OpenGraph tags", () => {
    const html = readFileSync(
      resolve(outputDir, "die-dreizehn-tore", "index.html"),
      "utf-8"
    );
    expect(html).toContain('og:type" content="book"');
    expect(html).toContain('og:locale" content="de_DE"');
  });

  // Build a single-entry fixture yaml from a real book. Translation cross-refs
  // must be stripped, otherwise validation rejects the lone entry (the referenced
  // partner slug is absent from the one-book fixture).
  function writeFixture(slug: string, mutate: (entry: any) => void): {
    tmpYaml: string;
    tmpOut: string;
  } {
    const base = parseYaml(readFileSync(booksYamlPath, "utf-8")) as any;
    const entry = structuredClone(base.books[0]);
    entry.slug = slug;
    entry.workTranslation = [];
    entry.translationOfWork = [];
    mutate(entry);
    const tmpDir = mkdtempSync(resolve(tmpdir(), "wp-fixture-"));
    const tmpYaml = resolve(tmpDir, "books.yaml");
    const tmpOut = resolve(tmpDir, "out");
    writeFileSync(tmpYaml, stringify({ books: [entry] }));
    mkdirSync(tmpOut, { recursive: true });
    return { tmpYaml, tmpOut };
  }

  test("JSON-LD includes Goodreads sameAs when goodreadsBookId present", () => {
    const { tmpYaml, tmpOut } = writeFixture("test-goodreads-sameas", (e) => {
      e.goodreadsBookId = "223349855";
    });
    try {
      generateBookPages({ booksYamlPath: tmpYaml, outputDir: tmpOut });
      const jsonLd = JSON.parse(
        readFileSync(resolve(tmpOut, "test-goodreads-sameas", "schema-org.jsonld"), "utf-8")
      );
      const book = jsonLd["@graph"].find((n: any) => n["@type"] === "Book");
      expect(book.sameAs).toBe("https://www.goodreads.com/book/show/223349855");
    } finally {
      rmSync(resolve(tmpYaml, ".."), { recursive: true, force: true });
    }
  });

  test("JSON-LD omits sameAs when goodreadsBookId absent", () => {
    const { tmpYaml, tmpOut } = writeFixture("test-no-sameas", (e) => {
      delete e.goodreadsBookId;
    });
    try {
      generateBookPages({ booksYamlPath: tmpYaml, outputDir: tmpOut });
      const jsonLd = JSON.parse(
        readFileSync(resolve(tmpOut, "test-no-sameas", "schema-org.jsonld"), "utf-8")
      );
      const book = jsonLd["@graph"].find((n: any) => n["@type"] === "Book");
      expect(book.sameAs).toBeUndefined();
    } finally {
      rmSync(resolve(tmpYaml, ".."), { recursive: true, force: true });
    }
  });
});
