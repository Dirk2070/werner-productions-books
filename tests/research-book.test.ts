import { describe, test, expect } from "bun:test";
import { toSlug, levenshtein } from "../src/lib/research/slug-utils";
import { parseBookPage } from "../src/lib/research/parse-book-page";
import { parseSectionMap, SECTION_BISAC } from "../src/lib/research/parse-section-map";

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
      <h2>Psychologie &amp; Selbsthilfe</h2>
      <div><img src="/images/B0DNBSQXXL-800.webp" alt="book"></div>
      <h2>Fantasy &amp; Science Fiction</h2>
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
      <h2>Dr. Seelmann Krimireihe</h2>
      <div><img src="/images/B0AAAAAAAA-800.webp"></div>
      <div><img src="/images/B0BBBBBBBB-800.webp"></div>
      <h2>Fantasy &amp; Science Fiction</h2>
      <div><img src="/images/B0CCCCCCCC-800.webp"></div>
    </body></html>`;
    const result = parseSectionMap(html);
    expect(result).toHaveLength(3);
    expect(result[0].section).toBe("Dr. Seelmann Krimireihe");
    expect(result[2].section).toBe("Fantasy & Science Fiction");
  });
});
