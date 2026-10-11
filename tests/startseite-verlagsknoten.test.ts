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

function knotenDerStartseite(): Record<string, unknown>[] {
  const html = readFileSync(index, "utf-8");
  const knoten: Record<string, unknown>[] = [];
  for (const m of html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    const j = JSON.parse(m[1]);
    knoten.push(...(j["@graph"] ?? [j]));
  }
  return knoten;
}

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

/**
 * Entscheidung Dirks 2026-10-11: books folgt werner-identity. Der Verlag zeigt
 * auf das Dach, die Person ist der Anker des Apex, kein eigener `#author`.
 */
test("Organization: parentOrganization und founder zeigen auf die Anker des Apex", () => {
  const org = knotenDerStartseite().find(
    (k) => k["@id"] === "https://books.werner-productions.com/#org-werner-productions",
  );
  expect(org).toBeDefined();
  expect(org!["parentOrganization"]).toEqual({
    "@id": "https://werner-productions.com/#organization",
  });
  expect(org!["founder"]).toEqual({ "@id": "https://werner-productions.com/#person" });
});

test("Startseite: kein @id auf #author, Person nur als schlanker Verweis auf den Apex-Anker", () => {
  const html = readFileSync(index, "utf-8");
  expect(html.includes("#author")).toBe(false);
  const personen = knotenDerStartseite().filter((k) => k["@type"] === "Person");
  expect(personen.length).toBe(1);
  expect(personen[0]).toEqual({
    "@type": "Person",
    "@id": "https://werner-productions.com/#person",
    name: "Dirk Werner",
  });
});
