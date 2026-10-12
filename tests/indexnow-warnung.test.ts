import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { warnzeilen } from "../scripts/lib/indexnow-warnung";

const skript = readFileSync(resolve(import.meta.dir, "..", "scripts/notify-indexnow.ts"), "utf8");

describe("IndexNow – Warnung je gescheiterter Stelle", () => {
  test("Yandex scheitert, Rest 202: genau eine Warnung, sie nennt die Stelle", () => {
    expect(warnzeilen([{ stelle: "yandex.com", grund: "fetch failed" }], {})).toEqual([
      "WARNUNG: yandex.com nicht erreicht (fetch failed)",
    ]);
  });

  test("alle scheitern: je Stelle eine Warnung", () => {
    const zeilen = warnzeilen(
      [
        { stelle: "api.indexnow.org", grund: "403" },
        { stelle: "www.bing.com", grund: "403" },
        { stelle: "yandex.com", grund: "fetch failed" },
      ],
      {},
    );
    expect(zeilen.length).toBe(3);
    expect(zeilen.every((zeile) => zeile.startsWith("WARNUNG: ") && zeile.includes(" nicht erreicht"))).toBe(true);
  });

  test("keine gescheiterte Stelle: keine Zeile", () => {
    expect(warnzeilen([], { GITHUB_ACTIONS: "true" })).toEqual([]);
  });

  test("in GitHub Actions zusätzlich eine Annotation je Stelle", () => {
    expect(warnzeilen([{ stelle: "yandex.com", grund: "fetch failed" }], { GITHUB_ACTIONS: "true" })).toEqual([
      "WARNUNG: yandex.com nicht erreicht (fetch failed)",
      "::warning title=IndexNow::yandex.com nicht erreicht (fetch failed)",
    ]);
  });

  // Die Naht: Das Meldeskript muss die Warnungen auch ausgeben, sonst prüft dieser Test nur die Hilfsdatei.
  test("das Meldeskript sammelt gescheiterte Stellen und gibt die Warnzeilen aus", () => {
    expect(skript).toMatch(/from ["']\.\/lib\/indexnow-warnung(\.js)?["']/);
    expect(skript).toMatch(/gescheitert\.push\(/);
    expect(skript).toContain("for (const zeile of warnzeilen(gescheitert)) console.log(zeile);");
  });
});
