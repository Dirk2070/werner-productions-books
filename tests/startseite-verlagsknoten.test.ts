/**
 * Waechter: die gebaute Startseite definiert den Verlagsknoten.
 *
 * Anlass (WebSonde-Nachtlauf 2026-10-11): "Organization nur verschachtelt".
 * Die Buchseiten definieren `#org-werner-productions`, die Startseite -- der
 * Einstieg fuer "wer verlegt die Buecher" -- kannte ihn nicht.
 * Liest `dist/`, nicht die Quelle (siehe jsonld-verweise-loesen-auf.test.ts).
 */
import { test, expect } from "bun:test";
import { resolve } from "path";
import { readFileSync, existsSync } from "fs";

const index = resolve(import.meta.dir, "..", "dist", "index.html");

test("dist/index.html definiert die Organization mit @id, nicht nur verschachtelt", () => {
  expect(existsSync(index)).toBe(true);
  const html = readFileSync(index, "utf-8");
  const knoten: Record<string, unknown>[] = [];
  for (const m of html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    const j = JSON.parse(m[1]);
    knoten.push(...(j["@graph"] ?? [j]));
  }
  const org = knoten.find(
    (k) =>
      k["@type"] === "Organization" &&
      k["@id"] === "https://books.werner-productions.com/#org-werner-productions",
  );
  expect(org).toBeDefined();
  expect(org!["name"]).toBe("Werner Productions");
});
