/**
 * Waechter: der Identitaets-Abgleich hat drei getrennte Ausgaenge.
 *
 * Anlass (2026-10-12): in zwei von drei Builds meldete der Abgleich "Quelle
 * nicht erreichbar" (Exit 0), und diese Zeile ging im Build-Log unter. Ein
 * Abgleich, der nicht geprueft hat, darf nie wie "stimmt ueberein" aussehen
 * (Dirk): stimmt ueberein / weicht ab / NICHT GEPRUEFT.
 *
 * Ohne Netz: die Quelle ist ein lokaler Server (IDENTITAET_QUELLE), die
 * Ergebnisdatei liegt in einem Wegwerf-Verzeichnis. Der Test startet den echten
 * Audit als Prozess und liest Zeile, Exit-Code und Ergebnisdatei.
 */
import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { resolve } from "path";
import { mkdtempSync, rmSync, readFileSync, existsSync } from "fs";
import { tmpdir } from "os";
import { PERSON_ID } from "../src/lib/organization";

const rootDir = resolve(import.meta.dir, "..");
const audit = resolve(rootDir, "scripts", "audit-identitaet-abgleich.mjs");
const ZEILE = "IDENTITAETS-ABGLEICH: ";

let dir: string;
let ergebnisDatei: string;
let server: ReturnType<typeof Bun.serve>;
let modus: "ok" | "abweichung" | "503" | "html" = "ok";

const quelleJson = (anker: string) => ({
  stand: "test",
  quell_commit: "0000000000000000",
  anker,
  orcid: "0009-0001-7822-0041",
  gnd: "1384382429",
});

beforeAll(() => {
  dir = mkdtempSync(resolve(tmpdir(), "identitaet-"));
  ergebnisDatei = resolve(dir, "ergebnis.json");
  server = Bun.serve({
    port: 0,
    fetch() {
      if (modus === "503") return new Response("down", { status: 503 });
      if (modus === "html") return new Response("<html>challenge</html>", { headers: { "content-type": "text/html" } });
      return Response.json(quelleJson(modus === "ok" ? PERSON_ID : "https://example.org/#person"));
    },
  });
});

afterAll(() => {
  server.stop(true);
  rmSync(dir, { recursive: true, force: true });
});

async function lauf(quelle: string, ...args: string[]) {
  const p = Bun.spawn(["node", audit, ...args], {
    cwd: rootDir,
    env: { ...process.env, IDENTITAET_QUELLE: quelle, IDENTITAET_ERGEBNIS: ergebnisDatei },
    stdout: "pipe",
    stderr: "pipe",
  });
  const [out, err, code] = await Promise.all([new Response(p.stdout).text(), new Response(p.stderr).text(), p.exited]);
  const status = existsSync(ergebnisDatei) ? JSON.parse(readFileSync(ergebnisDatei, "utf-8")) : null;
  const zeilen = out.split("\n").filter((z) => z.startsWith(ZEILE));
  return { out, err, code, status, zeilen };
}

describe("Identitaets-Abgleich: drei Ausgaenge", () => {
  test("nicht erreichbar endet als NICHT GEPRUEFT, mit Exit 0 und echter Ursache, nie als stimmt ueberein", async () => {
    // Port, auf dem nichts lauscht: Verbindung abgelehnt, ohne Fremdabruf.
    const tot = Bun.serve({ port: 0, fetch: () => new Response("") });
    const url = `http://127.0.0.1:${tot.port}/`;
    tot.stop(true);
    const r = await lauf(url);
    expect(r.code).toBe(0);
    expect(r.zeilen.length).toBe(1);
    expect(r.zeilen[0]).toContain("NICHT GEPRUEFT");
    expect(r.out).not.toContain("STIMMT UEBEREIN");
    expect(r.out).not.toContain("OK — Identitaets-Abgleich");
    expect(r.status.status).toBe("nicht_geprueft");
    // echte Ursache statt "nicht erreichbar" allein, und genau ein Wiederholungsversuch
    expect(r.zeilen[0]).toMatch(/ECONNREFUSED/);
    expect(r.zeilen[0]).toContain("Versuch 1");
    expect(r.zeilen[0]).toContain("Versuch 2");
    expect(r.zeilen[0]).not.toContain("Versuch 3");
  }, 30000);

  test("HTTP-Fehler der Quelle: NICHT GEPRUEFT mit Statuscode, ohne Wiederholung", async () => {
    modus = "503";
    const r = await lauf(`http://127.0.0.1:${server.port}/`);
    expect(r.code).toBe(0);
    expect(r.zeilen[0]).toContain("NICHT GEPRUEFT");
    expect(r.zeilen[0]).toContain("HTTP 503");
    expect(r.zeilen[0]).not.toContain("Versuch 2");
    expect(r.status.status).toBe("nicht_geprueft");
  }, 30000);

  test("Antwort ohne JSON (z. B. Challenge-Seite): NICHT GEPRUEFT", async () => {
    modus = "html";
    const r = await lauf(`http://127.0.0.1:${server.port}/`);
    expect(r.code).toBe(0);
    expect(r.zeilen[0]).toContain("NICHT GEPRUEFT");
    expect(r.zeilen[0]).toContain("kein JSON");
    expect(r.status.status).toBe("nicht_geprueft");
  }, 30000);

  test("stimmt ueberein: eigene Zeile, Exit 0, Status stimmt_ueberein", async () => {
    modus = "ok";
    const r = await lauf(`http://127.0.0.1:${server.port}/`);
    expect(r.code).toBe(0);
    expect(r.zeilen.length).toBe(1);
    expect(r.zeilen[0]).toContain("STIMMT UEBEREIN");
    expect(r.zeilen[0]).not.toContain("NICHT GEPRUEFT");
    expect(r.status.status).toBe("stimmt_ueberein");
  }, 30000);

  test("weicht ab: Exit 1 (Abbruch), Zeile WEICHT AB, Status weicht_ab", async () => {
    modus = "abweichung";
    const r = await lauf(`http://127.0.0.1:${server.port}/`);
    expect(r.code).toBe(1);
    expect(r.zeilen[0]).toContain("WEICHT AB");
    expect(r.status.status).toBe("weicht_ab");
  }, 30000);

  test("--zeige ohne Ergebnis dieses Laufs meldet NICHT GEPRUEFT, nicht still nichts", async () => {
    rmSync(ergebnisDatei, { force: true });
    const r = await lauf("http://127.0.0.1:1/", "--zeige");
    expect(r.code).toBe(0);
    expect(r.zeilen[0]).toContain("NICHT GEPRUEFT");
  }, 30000);
});
