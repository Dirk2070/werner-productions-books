import { describe, test, expect } from "bun:test";
import { toSlug, levenshtein } from "../src/lib/research/slug-utils";

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
