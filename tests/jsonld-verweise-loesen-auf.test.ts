/**
 * Waechter: jede site-eigene @id, die verwiesen wird, ist auf der Site definiert.
 *
 * Anlass (2026-09-13): `publisher: { "@id": ".../#org-werner-productions" }`
 * steht auf jeder Buchseite, und ein Knoten mit dieser @id existiert auf keiner.
 * 34 Seiten nennen einen Herausgeber, den keine Seite beschreibt.
 *
 * ⚠️ Dieser Waechter liest `dist/`, nicht die Quelle. Die vier Tests, die es
 * vorher gab, pruefen alle Generatoren -- und waren gruen, weil der Generator
 * genau das tut, was er soll: er schreibt den Verweis. Was fehlt, ist der
 * Knoten, auf den er zeigt, und der entsteht an einer anderen Stelle. Ein Test
 * am Erzeuger kann diese Luecke nicht sehen.
 *
 * Maßstab ist **site-weit, nicht seitenweise** (Vorhersage P2): auf einer
 * Buchseite sind auch `#author` und `#website` nur Verweise, definiert sind sie
 * auf der Startseite. Seitenweise zu pruefen wuerde zwei Fragen vermischen, die
 * man nur getrennt versteht.
 */

import { describe, test, expect, beforeAll } from "bun:test";
import { resolve } from "path";
import { readFileSync, existsSync, readdirSync, statSync } from "fs";

const rootDir = resolve(import.meta.dir, "..");
const distDir = resolve(rootDir, "dist");
const BASE_URL = "https://books.werner-productions.com";
const APEX_PERSON = "https://werner-productions.com/#person";
const APEX_ORG = "https://werner-productions.com/#organization";

type Fund = { id: string; datei: string };

/** Alle .html unter dist/, rekursiv. */
function htmlDateien(dir: string): string[] {
  const raus: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = resolve(dir, e.name);
    if (e.isDirectory()) raus.push(...htmlDateien(p));
    else if (e.name.endsWith(".html")) raus.push(p);
  }
  return raus;
}

function ldBloecke(html: string): unknown[] {
  const treffer = html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  );
  const raus: unknown[] = [];
  for (const t of treffer) {
    try {
      raus.push(JSON.parse(t[1]));
    } catch {
      raus.push({ __unparsebar: t[1].slice(0, 120) });
    }
  }
  return raus;
}

/**
 * Trennt Definitionen von Verweisen.
 *
 * Ein Objekt mit `@id` UND weiteren Feldern definiert einen Knoten.
 * Ein Objekt, das **nur** `@id` traegt, ist ein Verweis auf einen anderswo
 * definierten Knoten. Diese eine Unterscheidung erzeugt die Richtung des
 * Befundes (Vorhersage P5) -- und sie stammt aus dem gebauten HTML, nicht aus
 * der Datei, die die Verweise schreibt.
 */
function sammle(wert: unknown, datei: string, def: Set<string>, ref: Fund[]): void {
  if (Array.isArray(wert)) {
    for (const w of wert) sammle(w, datei, def, ref);
    return;
  }
  if (wert === null || typeof wert !== "object") return;

  const o = wert as Record<string, unknown>;
  const id = typeof o["@id"] === "string" ? (o["@id"] as string) : null;

  if (id) {
    const nurVerweis = Object.keys(o).length === 1;
    if (nurVerweis) ref.push({ id, datei });
    else def.add(id);
  }

  for (const [k, v] of Object.entries(o)) {
    if (k === "@id") continue;
    sammle(v, datei, def, ref);
  }
}

let definiert: Set<string>;
let verweise: Fund[];
let geprueft: string[];
let personDefinitionen: { datei: string; knoten: Record<string, unknown> }[];
let orgKnoten: { datei: string; knoten: Record<string, unknown> }[];

/** Alle Objekte mit gegebener @id, an beliebiger Tiefe. */
function mitId(wert: unknown, id: string, raus: Record<string, unknown>[]): void {
  if (Array.isArray(wert)) {
    for (const w of wert) mitId(w, id, raus);
    return;
  }
  if (wert === null || typeof wert !== "object") return;
  const o = wert as Record<string, unknown>;
  if (o["@id"] === id) raus.push(o);
  for (const v of Object.values(o)) mitId(v, id, raus);
}

beforeAll(() => {
  // Ein fehlendes dist/ darf nicht zu "uebersprungen" fuehren: ein Waechter,
  // der bei fehlender Eingabe gruen meldet, ist schlimmer als keiner.
  if (!existsSync(distDir)) {
    throw new Error(
      `dist/ fehlt -- dieser Waechter prueft das Erzeugnis, nicht die Quelle. Erst "npm run build".`,
    );
  }
  geprueft = htmlDateien(distDir);
  if (geprueft.length === 0) {
    throw new Error(`dist/ enthaelt keine .html -- Build unvollstaendig.`);
  }
  // Werkzeug nennt den geprueften Stand: ein alter Build wuerde sonst still
  // einen Zustand belegen, den es nicht mehr gibt.
  const stempel = new Date(statSync(distDir).mtime).toISOString();
  console.log(`  [Waechter] ${geprueft.length} Seiten aus dist/, Stand ${stempel}`);

  definiert = new Set();
  verweise = [];
  personDefinitionen = [];
  orgKnoten = [];
  for (const pfad of geprueft) {
    const kurz = pfad.slice(distDir.length + 1).replace(/\\/g, "/");
    for (const block of ldBloecke(readFileSync(pfad, "utf-8"))) {
      sammle(block, kurz, definiert, verweise);
      const p: Record<string, unknown>[] = [];
      mitId(block, APEX_PERSON, p);
      // Verweise (nur @id) und schlanke Knoten: jeder Knoten MIT @type zaehlt als Definition.
      for (const k of p) if ("@type" in k) personDefinitionen.push({ datei: kurz, knoten: k });
      const o: Record<string, unknown>[] = [];
      mitId(block, `${BASE_URL}/#org-werner-productions`, o);
      for (const k of o) if ("@type" in k) orgKnoten.push({ datei: kurz, knoten: k });
    }
  }
});

describe("JSON-LD: site-eigene @id-Verweise loesen auf", () => {
  test("kein Verweis zeigt auf einen Knoten, den es auf der Site nicht gibt", () => {
    const eigene = verweise.filter((v) => v.id.startsWith(BASE_URL));
    const baumelnd = eigene.filter((v) => !definiert.has(v.id));

    const nachId = new Map<string, string[]>();
    for (const b of baumelnd) {
      nachId.set(b.id, [...(nachId.get(b.id) ?? []), b.datei]);
    }
    const bericht = [...nachId.entries()]
      .map(([id, dateien]) => `  ${id}\n    auf ${dateien.length} Seite(n), z. B. ${dateien[0]}`)
      .join("\n");

    expect(
      baumelnd.length,
      baumelnd.length === 0
        ? ""
        : `\n${nachId.size} @id wird verwiesen, aber nirgends definiert:\n${bericht}\n` +
            `Definiert sind: ${[...definiert].filter((d) => d.includes("#")).sort().join(", ")}\n`,
    ).toBe(0);
  });

  test("kein @id auf #author, weder definiert noch verwiesen (Entscheidung Dirks 2026-10-11)", () => {
    const alt = [...definiert].filter((d) => d.endsWith("#author"));
    const altVerweise = verweise.filter((v) => v.id.endsWith("#author"));
    expect(alt, `noch definiert: ${alt.join(", ")}`).toEqual([]);
    expect(
      altVerweise.length,
      `noch verwiesen auf ${altVerweise.length} Stelle(n), z. B. ${altVerweise[0]?.datei}`,
    ).toBe(0);
  });

  test("Verweise auf externe Anker sind nur die zwei des Apex und die App-Anker der Schwesterseiten", () => {
    // Bewusst kein "extern gilt als aufgeloest": erlaubt ist eine feste Liste.
    // Jede weitere fremde @id waere ein Verweis, den der Waechter oben nie
    // sehen koennte -- er prueft nur die Site-eigenen. Die App-Anker
    // (`mentions` der Buchseiten) gab es vor der Angleichung schon; sie sind
    // hier benannt, nicht stillschweigend durchgelassen.
    const erlaubt = new Set([APEX_PERSON, APEX_ORG]);
    const appAnker = /^https:\/\/(psyprofiler\.com|shadow-integrator\.com|insightvue\.app)\/#app$/;
    const fremd = verweise.filter((v) => !v.id.startsWith(BASE_URL));
    const unerlaubt = fremd.filter((v) => !erlaubt.has(v.id) && !appAnker.test(v.id));
    expect(
      unerlaubt.map((v) => `${v.id} (${v.datei})`),
      "fremde @id ausserhalb der Apex-Anker und der App-Anker",
    ).toEqual([]);
    // Der Wachter hat die Verweise wirklich gesehen.
    expect(fremd.some((v) => v.id === APEX_ORG)).toBe(true);
  });

  test("books fuehrt keinen eigenen Personenknoten: der Apex-Anker erscheint nur schlank", () => {
    expect(personDefinitionen.length).toBeGreaterThan(30);
    const zuViel = personDefinitionen.filter(
      (d) => Object.keys(d.knoten).sort().join() !== ["@id", "@type", "name"].sort().join(),
    );
    expect(zuViel.map((d) => d.datei)).toEqual([]);
  });

  test("jede Organization mit @id des Verlags traegt parentOrganization auf den Apex", () => {
    expect(orgKnoten.length).toBeGreaterThan(30);
    const ohne = orgKnoten.filter(
      (o) => JSON.stringify(o.knoten["parentOrganization"]) !== JSON.stringify({ "@id": APEX_ORG }),
    );
    expect(ohne.map((o) => o.datei)).toEqual([]);
  });

  test("der Verlag ist ein eigener Knoten mit @id, nicht nur ein Verweis", () => {
    const orgId = `${BASE_URL}/#org-werner-productions`;
    expect(
      definiert.has(orgId),
      `${orgId} ist nirgends als Knoten definiert. ` +
        `Verwiesen wird er von ${verweise.filter((v) => v.id === orgId).length} Stelle(n).`,
    ).toBe(true);
  });

  test("der Waechter hat wirklich Seiten gelesen", () => {
    // Ohne diese Zeile koennte der Test oben gruen sein, weil nichts geprueft
    // wurde -- die Bauart, bei der Ausfall wie Erfolg aussieht.
    expect(geprueft.length).toBeGreaterThan(30);
    expect(definiert.size).toBeGreaterThan(0);
  });
});
