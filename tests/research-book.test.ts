import { describe, test, expect } from "bun:test";
import { readFileSync, rmSync } from "fs";
import { resolve } from "path";
import { logError } from "../src/lib/research/yaml-writer";
import { toSlug, levenshtein } from "../src/lib/research/slug-utils";
import { parseBookPage } from "../src/lib/research/parse-book-page";
import { parseSectionMap, SECTION_BISAC } from "../src/lib/research/parse-section-map";
import { matchGoodreadsToBook, type GoodreadsItem } from "../src/lib/research/goodreads-rss";
import { generateTopics, extractTitleTokens } from "../src/lib/research/topic-generator";
import { calculateAppMatches, type AppEntry } from "../src/lib/research/app-cross-linker";
import { buildDescriptions } from "../src/lib/research/description-builder";
import type { BooksJsonEntry } from "../src/lib/research/types";

describe("toSlug", () => {
  test("DE title → kebab-case", () => {
    expect(toSlug("Wie man Sekten erkennt")).toBe("wie-man-sekten-erkennt");
  });
  test("EN title → kebab-case", () => {
    expect(toSlug("How to Recognize Cults")).toBe("how-to-recognize-cults");
  });
  test("drops subtitle after colon", () => {
    expect(toSlug("Die Dreizehn Tore: Ein Fantasy-Psychothriller")).toBe("die-dreizehn-tore");
  });
  test("handles umlauts", () => {
    expect(toSlug("Über das Glück")).toBe("ueber-das-glueck");
  });
  test("respects max length", () => {
    const long = "A".repeat(100);
    expect(toSlug(long, 60).length).toBeLessThanOrEqual(60);
  });
});

describe("levenshtein", () => {
  test("identical strings → 0", () => {
    expect(levenshtein("abc", "abc")).toBe(0);
  });
  test("one char diff → 1", () => {
    expect(levenshtein("abc", "aXc")).toBe(1);
  });
  test("punctuation diff small distance", () => {
    expect(levenshtein("How to Recognize Cults", "How to Recognize Cults: A Guide")).toBeLessThan(10);
  });
});

describe("parseBookPage", () => {
  test("extracts ISBN-13 from /dp/979... link", () => {
    const html = `<html><body><a href="https://amazon.com/dp/9798230572978">Paperback</a></body></html>`;
    const result = parseBookPage(html);
    expect(result.paperbackIsbn).toBe("9798230572978");
  });

  test("extracts Apple Audio ID", () => {
    const html = `<html><body><a href="https://books.apple.com/us/audiobook/some-book/id1811457128">Listen</a></body></html>`;
    const result = parseBookPage(html);
    expect(result.appleAudioId).toBe("1811457128");
  });

  test("returns null when no ISBN found", () => {
    const html = `<html><body><p>No links here</p></body></html>`;
    const result = parseBookPage(html);
    expect(result.paperbackIsbn).toBeNull();
    expect(result.appleAudioId).toBeNull();
  });

  test("extracts about bullets", () => {
    const html = `<html><body><h2>About This Book</h2><ul><li>Learn X</li><li>Discover Y</li></ul><h2>Next</h2></body></html>`;
    const result = parseBookPage(html);
    expect(result.aboutBullets).toEqual(["Learn X", "Discover Y"]);
  });

  test("detects format badges", () => {
    const html = `<html><body><span>EBook</span> <span>Hörbuch</span></body></html>`;
    const result = parseBookPage(html);
    expect(result.formatBadges).toContain("EBook");
    expect(result.formatBadges).toContain("Hörbuch");
  });
});

describe("parseSectionMap", () => {
  test("extracts ASIN from cover URL and maps to section", () => {
    const html = `<html><body>
      <div class="mega-cat"><strong>Psychologie &amp; Selbsthilfe</strong>
        <a href="/buecher/B0DNBSQXXL-de"><img src="/assets/covers/B0DNBSQXXL-400.webp" alt="book"></a>
      </div>
    </body></html>`;
    const result = parseSectionMap(html);
    expect(result).toHaveLength(1);
    expect(result[0].asin).toBe("B0DNBSQXXL");
    expect(result[0].section).toBe("Psychologie & Selbsthilfe");
    expect(result[0].bisac).toEqual(["SEL031000", "PSY045000"]);
  });

  test("BISAC mapping covers all sections", () => {
    expect(Object.keys(SECTION_BISAC)).toHaveLength(5);
  });

  test("multiple books across sections", () => {
    const html = `<html><body>
      <div class="mega-cat"><strong>Dr. Seelmann Krimireihe</strong>
        <a href="/buecher/B0AAAAAAAA-de"><img src="/assets/covers/B0AAAAAAAA-400.webp"></a>
        <a href="/buecher/B0BBBBBBBB-de"><img src="/assets/covers/B0BBBBBBBB-400.webp"></a>
      </div>
      <div class="mega-cat"><strong>Fantasy &amp; Sci-Fi</strong>
        <a href="/buecher/B0CCCCCCCC-de"><img src="/assets/covers/B0CCCCCCCC-400.webp"></a>
      </div>
    </body></html>`;
    const result = parseSectionMap(html);
    expect(result).toHaveLength(3);
    expect(result[0].section).toBe("Dr. Seelmann Krimireihe");
    expect(result[2].section).toBe("Fantasy & Sci-Fi");
  });
});

const mockRssItems: GoodreadsItem[] = [
  { title: "How to Recognize Cults", bookId: "223349855", isbn: "9798230572978" },
  { title: "Die Dreizehn Tore: Ein Fantasy-Psychothriller", bookId: "112233445", isbn: null },
  { title: "The Battle Within", bookId: "998877665", isbn: null },
];

function makeBook(overrides: Partial<BooksJsonEntry> = {}): BooksJsonEntry {
  return {
    asin: "B0DNBSQXXL",
    title: { de: "Wie man Sekten erkennt", en: "How to Recognize Cults" },
    description: { de: "...", en: "..." },
    author: "Dirk Werner",
    image: { link: "" },
    link: "",
    links: {},
    language: "en",
    bookFormat: { de: "eBook", en: "eBook" },
    hasAudiobook: true,
    hasPaperback: true,
    ...overrides,
  };
}

describe("matchGoodreadsToBook", () => {
  test("exact title match (EN)", () => {
    const result = matchGoodreadsToBook(makeBook(), mockRssItems);
    expect(result.goodreadsBookId).toBe("223349855");
    expect(result.matchType).toBe("exact");
  });

  test("exact title match (DE)", () => {
    const book = makeBook({
      title: { de: "Die Dreizehn Tore: Ein Fantasy-Psychothriller", en: "The Thirteen Gates" },
    });
    const result = matchGoodreadsToBook(book, mockRssItems);
    expect(result.goodreadsBookId).toBe("112233445");
    expect(result.matchType).toBe("exact");
  });

  test("fuzzy match with subtitle diff", () => {
    const book = makeBook({
      title: { de: "Irgendwas", en: "The Battle Within: Facing Your Inner Demons" },
    });
    const result = matchGoodreadsToBook(book, mockRssItems);
    expect(result.goodreadsBookId).toBe("998877665");
    expect(result.matchType).toBe("fuzzy");
  });

  test("no match → null", () => {
    const book = makeBook({
      title: { de: "Komplett anders", en: "Totally Different Book Title" },
    });
    const result = matchGoodreadsToBook(book, mockRssItems);
    expect(result.goodreadsBookId).toBeNull();
    expect(result.matchType).toBeNull();
  });
});

describe("generateTopics", () => {
  test("hardcoded ASIN returns predefined topics", () => {
    const result = generateTopics("B0DNBSQXXL", undefined, [], []);
    expect(result).toContain("Cult Psychology");
    expect(result.length).toBeGreaterThan(3);
  });

  test("non-hardcoded ASIN uses section + title + bullets", () => {
    const section = { asin: "B0XYZTEST", section: "Psychologie & Selbsthilfe", bisac: [], genre: ["Self-Help", "Psychology"] };
    const result = generateTopics("B0XYZTEST", section, ["Building emotional resilience"], ["Resilience", "Growth"]);
    expect(result).toContain("Self-Help");
    expect(result.length).toBeLessThanOrEqual(8);
  });
});

describe("extractTitleTokens", () => {
  test("filters stopwords and short words", () => {
    const result = extractTitleTokens("How to Recognize Cults: A Guide");
    expect(result).toContain("Recognize");
    expect(result).toContain("Cults");
    expect(result).toContain("Guide");
    expect(result).not.toContain("How");
  });
});

describe("calculateAppMatches", () => {
  const apps: AppEntry[] = [
    { id: "https://shadow-integrator.com/#app", slug: "shadow-integrator", name: "Shadow Integrator", topics: ["Schattenarbeit", "Jung'sche Psychologie", "Selbstsabotage", "Manipulation Detection", "Innere Konflikte", "Selbstreflexion", "Schatten-Integration"] },
    { id: "https://psyprofiler.com/#app", slug: "psyprofiler", name: "PsyProfiler", topics: ["Psychologische Tests", "Persönlichkeit", "Emotionale Intelligenz", "Selbstdiagnose", "Psychologisches Profiling", "Achtsamkeit"] },
  ];

  test("Cults book matches Shadow Integrator (≥2 overlap)", () => {
    const topics = ["Cult Psychology", "Manipulation Detection", "Shadow Work", "Critical Thinking"];
    const result = calculateAppMatches(topics, apps);
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result[0].slug).toBe("shadow-integrator");
  });

  test("no match when overlap < 2", () => {
    const topics = ["Cooking", "Recipes", "Italian Food"];
    const result = calculateAppMatches(topics, apps);
    expect(result).toHaveLength(0);
  });
});

describe("buildDescriptions", () => {
  test("long description contains ORCID, GND, ISBN, Goodreads ID", () => {
    const book = makeBook();
    const result = buildDescriptions(
      book,
      { asin: "B0DNBSQXXL", section: "Psychologie & Selbsthilfe", bisac: [], genre: ["Self-Help"] },
      ["Cult Psychology", "Manipulation Detection"],
      "9798230572978",
      "1811457128",
      "223349855",
      [{ id: "https://shadow-integrator.com/#app", slug: "shadow-integrator", name: "Shadow Integrator", overlap: 3 }]
    );
    expect(result.long).toContain("ORCID 0009-0001-7822-0041");
    expect(result.long).toContain("GND 1384382429");
    expect(result.long).toContain("ISBN 9798230572978");
    expect(result.long).toContain("Goodreads: ID 223349855");
    expect(result.long).toContain("Shadow Integrator");
    expect(result.long.length).toBeLessThanOrEqual(800);
  });

  test("meta ≤155, short ≤200", () => {
    const book = makeBook();
    const result = buildDescriptions(book, undefined, [], null, null, null, []);
    expect(result.meta.length).toBeLessThanOrEqual(155);
    expect(result.short.length).toBeLessThanOrEqual(200);
  });

  test("omits Goodreads line when no match", () => {
    const book = makeBook();
    const result = buildDescriptions(book, undefined, [], null, null, null, []);
    expect(result.long).not.toContain("Goodreads");
  });
});

describe("logError", () => {
  const errorLogPath = resolve(process.cwd(), "output/research/_errors.log");

  test("writes error in pipe-delimited format", () => {
    try { rmSync(errorLogPath); } catch {}

    logError({
      timestamp: "2026-05-04T13:00:00Z",
      asin: "B0DNBSQXXL",
      type: "GOODREADS_NO_MATCH",
      detail: 'best candidate: "Cults Guide" (dist=12)',
    });

    const content = readFileSync(errorLogPath, "utf-8");
    expect(content).toContain("2026-05-04T13:00:00Z | B0DNBSQXXL | GOODREADS_NO_MATCH |");

    // Clean up
    try { rmSync(errorLogPath); } catch {}
  });
});
