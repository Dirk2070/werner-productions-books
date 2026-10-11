/**
 * Waechter: der Quellbestand fuehrt den Personenanker des Apex, keinen toten Namen.
 *
 * Anlass (Dirk, 2026-10-11): `books.yaml` fuehrte bei allen Buechern
 * `authors: - ref: .../#author`, den frueheren books-eigenen Personenknoten. Das
 * Feld geht in kein Erzeugnis ein, blieb aber als Altname im Bestand stehen.
 * books.yaml kennt keine Konstanten; die Werte sind deshalb gleich geschrieben
 * und werden hier gegen die eine Konstante `PERSON_ID` gehalten.
 */
import { test, expect } from "bun:test";
import { resolve } from "path";
import { readFileSync } from "fs";
import { parse as parseYaml } from "yaml";
import { PERSON_ID } from "../src/lib/organization";

const rootDir = resolve(import.meta.dir, "..");

test("jedes Buch in books.yaml verweist als Autor auf PERSON_ID", () => {
  const { books } = parseYaml(readFileSync(resolve(rootDir, "books.yaml"), "utf-8"));
  expect(books.length).toBeGreaterThan(30);
  const abweichend = books.filter(
    (b: any) => b.authors.length !== 1 || b.authors[0].ref !== PERSON_ID,
  );
  expect(abweichend.map((b: any) => b.slug)).toEqual([]);
});

test("research-book.ts setzt AUTHOR_REF aus PERSON_ID, kein eigener Wert", () => {
  const quelle = readFileSync(resolve(rootDir, "scripts", "research-book.ts"), "utf-8");
  expect(quelle).toMatch(/const AUTHOR_REF = PERSON_ID;/);
});
