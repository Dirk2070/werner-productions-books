#!/usr/bin/env node
/**
 * audit-identitaet-abgleich.mjs — haelt die eigene Kopie der Identitaetsangaben
 * gegen die oeffentliche Quelle.
 *
 * ⛔ DER ANLASS (2026-09-17). Die geteilte Quelle `werner-identity` ist ein
 * PRIVATES Repo. Vier Portfolio-Repos — dieses, books, shadow-integrator,
 * SundaMind — koennen sie deshalb nicht als Submodul einbinden und fuehren
 * Anker, Diplomjahr und Approbationsjahr in EIGENEN Kopien. Kopien ohne
 * Abgleich driften.
 *
 * Am selben Tag stand in der llms.txt des Hubs "approbierter Psychotherapeut
 * seit 2008". Die Approbation war April 2011; 2008 war die Praxisgruendung.
 * Die englische Fassung zwei Zeilen darunter sagte es richtig. Eine falsche
 * Approbationsangabe ist berufsrechtlich nicht belanglos, und niemand hatte
 * sie gegen die Quelle gehalten.
 *
 * ⭐ DER WEG OHNE GEHEIMNIS: Der Hub veroeffentlicht die Angaben unter
 * /ai/identitaet.json — nur die Felder, die ohnehin auf einer Seite stehen.
 * Dieser Waechter liest sie ueber HTTPS. Kein Token in vier Repos, keine
 * Kopie eines Geheimnisses, die jemand pflegen muesste.
 *
 * ⛔ DREIWERTIG, NIE STILL GRUEN:
 *   stimmt ueberein  Exit 0
 *   weicht ab        Exit 1 — Feld, eigener Wert, Wert der Quelle
 *   nicht erreichbar Exit 0 MIT sichtbarer Warnung. Ein GitHub- oder
 *                    DNS-Ausfall darf nachts keine Deploys blockieren
 *                    (Dirks Abwaegung) — aber "nicht geprueft" darf NIEMALS
 *                    wie "stimmt ueberein" aussehen. Genau diese Verwechslung
 *                    macht einen Waechter blind, wenn man ihn braucht.
 *
 * Aufruf: node scripts/audit-identitaet-abgleich.mjs [--selbsttest]
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join, resolve, extname } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const QUELLE = 'https://werner-productions.com/ai/identitaet.json';

/* ═══════════════════════════════════════════════════════════════════════════
 * TEIL 2: KEIN DOKTORTITEL AN DIRK WERNER
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ⛔⛔ ANLASS (2026-09-17). In `werner-productions/data/identity.yaml` stand
 *    als englische Kurzbio „Dr. Dirk Werner — German psychotherapist, …" —
 *    seit dem ERSTEN Commit der Datei (2026-05-08), vier Monate lang. Dirk ist
 *    Diplom-Psychologe (Wuerzburg 2000) und approbierter Psychologischer
 *    Psychotherapeut (2011); eine Promotion gibt es nicht.
 *    Die DEUTSCHE Kurzbio war die ganze Zeit richtig. Falsch war nur die
 *    englische — Fehlerklasse „Sprachpaare": eine Angabe an einem Sprachpaar
 *    ist verdaechtig, bis BEIDE Seiten geprueft sind.
 *
 * ⭐⭐ WARUM HIER UND NICHT ALS ZWEITER WAECHTER (Dirks Entscheidung,
 *    2026-09-17): „Dann gibt es eine Pruefung pro Repo statt zwei Kopien mit
 *    eigener Gegenprobe, und die Warnung ‚Gegenprobe gehoert mit' kann nicht
 *    verloren gehen." Der Titel IST eine Identitaetsangabe; er gehoert in den
 *    Waechter, der Identitaetsangaben prueft.
 *
 * ⛔⛔ DIE GEGENPROBE IST DAS SCHWIERIGE, NICHT DER FUND. Es gibt einen
 *    NAMENSVETTER, und der IST promoviert: Prof. Dr. Dirk Werner,
 *    Funktionalanalysis, FU Berlin, Wikidata Q1228120. Die Portfolio-Repos
 *    grenzen sich ausdruecklich gegen ihn ab — in llms.txt, in der books-FAQ,
 *    in den Wikidata-Notizen von dirkwernerbooks1. Ein Waechter, der jedes
 *    „Dr. Dirk Werner" rot faerbt, faerbt genau die Abgrenzung rot, die das
 *    Problem behandelt, und wird nach einer Woche abgeschaltet.
 *    REGEL: Ein Treffer ist nur dann ein Befund, wenn in seiner Umgebung der
 *    Namensvetter NICHT benannt ist.
 *
 * ⛔ DAS FENSTER IST DREI ZEILEN, NICHT 80 ZEICHEN. Ein zu kleines Fenster
 *    erzeugt Sicherheit und uebersieht genau die Faelle, in denen die
 *    Abgrenzung eine Zeile weiter steht (Tabellen, Aufzaehlungen). Dieselbe
 *    Falle wie `slice(0, 80)`.
 *
 * ⛔ DIESER TEIL IST NICHT DREIWERTIG. Er liest Dateien, keine Fremddomain —
 *    „nicht erreichbar" gibt es nicht. Er meldet auch dann, wenn der Abgleich
 *    oben mangels Netz ausfaellt; sonst waere ein DNS-Ausfall eine Freikarte
 *    fuer eine falsche Aussage ueber einen Menschen.
 */
const TITEL = /\b(?:Prof\.\s*)?(?:Dr\.|Doktor|Ph\.?D\.?)\s*(?:Dirk\s+Werner|D\.\s*Werner|Werner\b)/g;
const HONORIFIC = /"honorificPrefix"/g;
/** Merkmale, die NUR auf den Namensvetter passen. ⛔ „Werner" waere jeder Treffer. */
const NAMENSVETTER = /Mathematik|mathematician|Funktionalanalysis|functional analysis|Q1228120|FU Berlin|Freien? Universität Berlin|Lineare Algebra|Satiriker|135795826/i;

/**
 * Kommentare heraus — aber NUR aus Quelldateien.
 *
 * ⛔ Der Bestand ERKLAERT den Fehler (so wie dieser Kopf hier). Ein Waechter,
 *    den sein eigener Erklaertext ausloest, meldet die richtige Sorge an der
 *    falschen Stelle.
 * ⛔ UND WARUM NUR DORT: In .html, .txt, .md und .json gibt es keinen „nur
 *    erklaerenden" Titel — ein HTML-Kommentar WIRD ausgeliefert. Dort wird
 *    nichts entfernt, sonst haette der Waechter eine Luecke genau auf der
 *    Flaeche, fuer die es ihn gibt.
 */
function ohneKommentare(text, endung) {
  if (endung === '.yaml' || endung === '.yml') {
    return text.split(/\r?\n/).filter((z) => !/^\s*#/.test(z)).join('\n');
  }
  if (['.mjs', '.cjs', '.js', '.jsx', '.ts', '.tsx'].includes(endung)) {
    return text
      .replace(/\/\*[\s\S]*?\*\//g, ' ')
      // ⛔ `//` nur als Kommentar werten, wenn kein `:` davorsteht — sonst
      //    zerschneidet die Regel jede URL.
      .split(/\r?\n/).map((z) => z.replace(/(^|[^:])\/\/.*$/, '$1')).join('\n');
  }
  if (endung === '.astro') return text.replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ');
  return text;
}

/**
 * Kern des Titel-Teils. `dateien` ist [{pfad, text}] — kein Dateisystem-
 * Zugriff, damit der Selbsttest dieselbe Funktion aufruft wie der Hauptlauf.
 */
export function titelBefunde(dateien) {
  const funde = [];
  let abgegrenzt = 0;
  for (const { pfad, text: roh } of dateien) {
    const text = ohneKommentare(roh, (pfad.match(/\.[a-z]+$/i) ?? [''])[0].toLowerCase());
    const zeilen = text.split(/\r?\n/);
    for (const muster of [TITEL, HONORIFIC]) {
      for (const m of text.matchAll(muster)) {
        const zi = text.slice(0, m.index).split(/\r?\n/).length - 1;
        const fenster = zeilen.slice(Math.max(0, zi - 1), zi + 2).join('\n');
        if (NAMENSVETTER.test(fenster)) { abgegrenzt++; continue; }
        funde.push(`${pfad}:${zi + 1} — „${m[0]}"  ${zeilen[zi].trim().slice(0, 90)}`);
      }
    }
  }
  return { funde, abgegrenzt };
}

/**
 * Die Flaechen dieses Repos.
 *
 * ⭐ KANDIDATENLISTE, KEIN FESTER PFAD: derselbe Waechter soll in fuenf Repos
 *   mit fuenf Verzeichnisbaeumen laufen. Geprueft wird, was es gibt.
 * ⛔ Gebautes MIT (dist, out, build): nur die Quellen zu pruefen hiesse, eine
 *   Ableitung zu uebersehen, die den Titel erst erzeugt.
 */
const TITEL_ZIELE = ['src', 'app', 'lib', 'data', 'content', 'public', 'functions', 'docs', 'dist', 'out', 'build'];
const TITEL_AUS = new Set(['.git', 'node_modules', '.astro', '.next', '.cache', '__pycache__', '.firebase']);
const TITEL_ENDUNGEN = new Set(['', '.md', '.txt', '.json', '.yaml', '.yml', '.html', '.htm',
  '.astro', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.xml', '.svg']);

function sammleDateien() {
  const raus = [];
  const geh = (basis, rel = '') => {
    let eintraege;
    try { eintraege = readdirSync(join(basis, rel), { withFileTypes: true }); } catch { return; }
    for (const x of eintraege) {
      if (TITEL_AUS.has(x.name)) continue;
      const r = join(rel, x.name);
      if (x.isDirectory()) { geh(basis, r); continue; }
      if (!x.isFile() || !TITEL_ENDUNGEN.has(extname(x.name).toLowerCase())) continue;
      const voll = join(basis, r);
      try {
        if (statSync(voll).size > 8 * 1024 * 1024) continue;
        raus.push({ pfad: r.replace(/\\/g, '/'), text: readFileSync(voll, 'utf8') });
      } catch { /* unlesbar — zaehlt nicht als geprueft */ }
    }
  };
  for (const z of TITEL_ZIELE) {
    const b = resolve(WURZEL, z);
    if (existsSync(b)) geh(b, '');
  }
  return raus;
}

/**
 * Welche eigenen Dateien welche Felder tragen. Pro Eintrag: die Datei, das
 * Feld in der Quelle, und ein Muster, das den eigenen Wert herausholt.
 *
 * ⛔ Der Wert wird AUS DER DATEI GELESEN, nicht hier getippt — sonst waere
 * diese Liste die naechste Kopie.
 */
/*
 * ⭐ FUER books.werner-productions.com ANGEPASST (2026-09-17). Nur diese Liste
 *   ist je Repo verschieden.
 *
 * ⛔ HIER STEHEN DIE KENNUNGEN IN PROSA, nicht in Feldern: data/faqs.yaml
 *   fuehrt sie in einem Antworttext ("Dirk Werner (ORCID … · GND … ·
 *   Goodreads …)"). Das Muster holt sie aus genau diesem Satz. Ein Feld gibt
 *   es nicht, und eines zu ERFINDEN waere eine zweite Wahrheit neben der
 *   Prosa, die ausgeliefert wird.
 *
 * ⛔ DIE PRAXIS-URL FEHLT HIER ABSICHTLICH: books nennt sie nur einmal, in
 *   derselben Prosa, und ohne www. Ein Abgleich gegen die Quelle (die MIT www
 *   fuehrt) waere ab der ersten Minute rot -- aber die Frage, welche Form
 *   kanonisch ist, haengt am Cloudflare-Umzug der Praxisseite und ist offen.
 *   Ein Waechter, der eine offene Entscheidung vorwegnimmt, meldet Wetter.
 */
const FELDER = [
  {
    datei: 'data/faqs.yaml',
    feld: 'orcid',
    muster: /ORCID\s+([0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4})/,
    was: 'ORCID',
  },
  {
    datei: 'data/faqs.yaml',
    feld: 'gnd',
    muster: /GND\s+([0-9X]{8,12})/,
    was: 'GND',
  },
];

/**
 * Dienste, bei denen die Gross-/Kleinschreibung im PFAD nachweislich egal ist.
 *
 * ⛔ POSITIVLISTE, nicht pauschal. Bei den meisten Diensten IST der Pfad
 * gross-/kleinempfindlich; wer das wegnormalisiert, laesst echte Abweichungen
 * durch. Hier stehen nur Dienste, bei denen es am 2026-09-17 live geprueft
 * wurde: linktr.ee liefert fuer /Dirk_Werner und /dirk_werner beide HTTP 200
 * OHNE Umleitung — die Schreibweise wird also wirklich ignoriert.
 */
const PFAD_EGAL = ['linktr.ee'];

/**
 * Vergleichbare Form einer URL.
 *
 * ⛔ WAS NICHT NORMALISIERT WIRD: `www.` bleibt stehen. Bei der Praxisseite
 * ist es bedeutsam — die geteilte Quelle vermerkt ausdruecklich "mit www; die
 * Form ohne www antwortet eigenstaendig, nicht per Umleitung". Eine
 * Normalisierung, die www entfernt, wuerde zwei verschiedene Ziele gleichsetzen.
 *
 * ⭐ WAS NORMALISIERT WIRD, und warum jedes einzeln geprueft ist:
 *   · Hostname klein — DNS ist grundsaetzlich gross-/kleinunempfindlich.
 *   · Schraegstrich am Ende — /pfad und /pfad/ sind dasselbe Ziel. Genau hier
 *     wich PsyProfiler von der Quelle ab: dort steht die Praxis-URL ohne,
 *     in autor.ts mit Schraegstrich.
 *   · Pfad klein NUR fuer PFAD_EGAL.
 */
function vergleichbar(url) {
  if (typeof url !== 'string') return url;
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    let pfad = u.pathname.replace(/\/+$/, '');
    if (PFAD_EGAL.includes(host.replace(/^www\./, ''))) pfad = pfad.toLowerCase();
    return `${u.protocol}//${host}${pfad}${u.search}`;
  } catch {
    return url.trim().replace(/\/+$/, '');
  }
}

/**
 * Kern, ohne Netz und ohne Dateisystem. `quelle` ist null, wenn der Abruf
 * scheiterte; `eigene` ist eine Map feld -> gelesener Wert (null = nicht
 * gefunden).
 */
export function bewerte(quelle, eigene) {
  if (quelle === null) {
    return { art: 'unbekannt', befunde: [], text: `Quelle ${QUELLE} nicht erreichbar — Abgleich NICHT durchgefuehrt` };
  }
  const befunde = [];
  // ⛔ `praxis_url` ist kein eigenes Feld der Quelle — es wird aus
  // `gleiche_urls` gezogen. Die Quelle soll nicht fuer jeden Verbraucher ein
  // eigenes Feld bekommen; sie fuehrt die Liste, wir suchen darin.
  const abgeleitet = {
    ...quelle,
    praxis_url: (quelle.gleiche_urls ?? []).find((u) => u.includes('dirk-werner-psychotherapie.de')) ?? null,
  };
  for (const [was, { feld, eigener }] of eigene) {
    const soll = abgeleitet[feld];
    if (soll === undefined || soll === null) {
      befunde.push(`${was}: Feld "${feld}" fehlt in der Quelle — veraltete Vergleichsbasis?`);
      continue;
    }
    if (eigener === null) {
      befunde.push(`${was}: im eigenen Repo nicht gefunden (Muster greift nicht) — Quelle sagt "${soll}"`);
      continue;
    }
    // ⭐ URLs werden in vergleichbarer Form geprueft (Schraegstrich, Hostname,
    // Pfad bei PFAD_EGAL). Der MELDETEXT nennt die Originalwerte — wer den
    // Befund liest, will sehen, was wirklich dasteht, nicht die Normalform.
    const gleich = /^https?:\/\//.test(String(soll))
      ? vergleichbar(String(eigener)) === vergleichbar(String(soll))
      : String(eigener) === String(soll);
    if (!gleich) {
      befunde.push(`${was}: eigener Wert "${eigener}", Quelle sagt "${soll}"`);
    }
  }
  return befunde.length
    ? { art: 'abweichung', befunde, text: `${befunde.length} Abweichung(en) gegen die Quelle` }
    : { art: 'gleich', befunde: [], text: `${eigene.size} Feld(er) stimmen mit der Quelle ueberein` };
}

// ── Selbsttest ────────────────────────────────────────────────────────────
if (process.argv.includes('--selbsttest')) {
  const q = { anker: 'https://werner-productions.com/#person', diplom_jahr: '2000', approbation_jahr: '2011' };
  const m = (werte) => new Map(Object.entries(werte).map(([was, [feld, eigener]]) => [was, { feld, eigener }]));

  const proben = [
    ['Approbationsjahr falsch (2008 statt 2011)',
      bewerte(q, m({ Approbationsjahr: ['approbation_jahr', '2008'] })), 'abweichung'],
    ['Diplomjahr falsch',
      bewerte(q, m({ Diplomjahr: ['diplom_jahr', '1999'] })), 'abweichung'],
    ['Anker falsch',
      bewerte(q, m({ Anker: ['anker', 'https://dirkwernerbooks.com/#person'] })), 'abweichung'],
    ['eigener Wert nicht gefunden',
      bewerte(q, m({ Anker: ['anker', null] })), 'abweichung'],
    ['Feld fehlt in der Quelle (veraltete Basis)',
      bewerte({ anker: q.anker }, m({ Approbationsjahr: ['approbation_jahr', '2011'] })), 'abweichung'],
    ['Quelle nicht erreichbar',
      bewerte(null, m({ Anker: ['anker', 'egal'] })), 'unbekannt'],
    // ⛔ Die Normalisierung darf NICHT zu weit greifen. www ist bei der
    // Praxisseite bedeutsam (die Quelle vermerkt es ausdruecklich), und ein
    // anderer Pfad ist ein anderes Ziel.
    ['www weggelassen — ist eine echte Abweichung',
      bewerte({ gleiche_urls: ['https://www.dirk-werner-psychotherapie.de'] },
        m({ 'Praxis-URL': ['praxis_url', 'https://dirk-werner-psychotherapie.de'] })), 'abweichung'],
    ['anderer Pfad bei einem PFAD_EGAL-Dienst',
      bewerte({ anker: 'https://linktr.ee/Dirk_Werner' },
        m({ Linktree: ['anker', 'https://linktr.ee/jemand_anders'] })), 'abweichung'],
  ];
  const gegen = [
    // ⭐ Gegenproben zur Normalisierung: Diese Paare sind DASSELBE Ziel und
    // duerfen nicht melden. Beide am 2026-09-17 live geprueft.
    ['Schraegstrich am Ende — dasselbe Ziel',
      bewerte({ gleiche_urls: ['https://www.dirk-werner-psychotherapie.de'] },
        m({ 'Praxis-URL': ['praxis_url', 'https://www.dirk-werner-psychotherapie.de/'] })), 'gleich'],
    ['linktr.ee gross/klein — Dienst ignoriert es',
      bewerte({ anker: 'https://linktr.ee/Dirk_Werner' },
        m({ Linktree: ['anker', 'https://linktr.ee/dirk_werner'] })), 'gleich'],
    ['Hostname gross geschrieben — DNS ist unempfindlich',
      bewerte({ anker: 'https://werner-productions.com/#person' },
        m({ Anker: ['anker', 'https://WERNER-PRODUCTIONS.com/#person'] })), 'gleich'],
    ['alle Werte gleich',
      bewerte(q, m({ Anker: ['anker', q.anker], Diplomjahr: ['diplom_jahr', '2000'], Approbationsjahr: ['approbation_jahr', '2011'] })), 'gleich'],
  ];

  let schief = 0;
  for (const [name, ergebnis, soll] of [...proben, ...gegen]) {
    if (ergebnis.art !== soll) {
      console.error(`❌ Selbsttest "${name}": ${ergebnis.art}, erwartet ${soll}`);
      schief++;
    } else {
      console.log(`✅ Selbsttest "${name}": ${ergebnis.art}`);
    }
  }
  // ⛔ Die entscheidende Probe: "nicht erreichbar" darf NICHT "gleich" sein.
  if (bewerte(null, new Map()).art === 'gleich') {
    console.error('❌ Selbsttest: nicht erreichbare Quelle gilt als "gleich"');
    schief++;
  }

  // ── Teil 2: Titel ───────────────────────────────────────────────────────
  const titelProben = [
    ['Titel in einer Bio', { pfad: 'src/lib/autor.ts', text: 'const bio = "Dr. Dirk Werner, Psychotherapeut";\n' }],
    ['Titel im ausgelieferten HTML', { pfad: 'out/index.html', text: '<p>Tests von Dr. Dirk Werner.</p>' }],
    ['Titel in einer llms-Datei', { pfad: 'public/llms.txt', text: '- Autor: Dr. Werner, Psychotherapeut\n' }],
    ['abgekuerzte Form', { pfad: 'docs/a.md', text: 'Herausgegeben von Dr. D. Werner, 2026.\n' }],
    ['Prof. davor', { pfad: 'docs/b.md', text: 'Ein Vortrag von Prof. Dr. Dirk Werner ueber Selbstwert.\n' }],
    ['PhD statt Dr.', { pfad: 'data/c.json', text: '{"autor": "PhD Dirk Werner"}\n' }],
    ['honorificPrefix im JSON-LD', { pfad: 'out/x.html', text: '{"@type":"Person","honorificPrefix":"Dr.","name":"Dirk Werner"}' }],
    // ⛔ Die Mutation, die ein zu kleines Fenster durchgelassen haette.
    ['Abgrenzung vier Zeilen entfernt — zaehlt nicht mehr',
      { pfad: 'docs/d.md', text: 'Ein Buch von Dr. Dirk Werner.\n\n\n\nAnderes Thema: der Mathematiker Q1228120.\n' }],
  ];
  for (const [name, d] of titelProben) {
    const { funde } = titelBefunde([d]);
    if (!funde.length) { console.error(`❌ Selbsttest "${name}": blieb GRUEN`); schief++; }
    else console.log(`✅ Selbsttest "${name}": rot`);
  }
  /*
   * ⭐⭐ DIESE SECHS SIND DER EIGENTLICHE TEST. Der Bestand GRENZT SICH gegen
   *     den Namensvetter ab und muss ihn dafuer benennen duerfen. Wer diesen
   *     Waechter in ein weiteres Repo kopiert, kopiert sie MIT — ohne sie
   *     beanstandet er die Abgrenzung und wird abgeschaltet.
   */
  const titelGegen = [
    ['Abgrenzung in derselben Zeile', { pfad: 'public/llms.txt', text: 'Dies ist NICHT der Mathematikprofessor Prof. Dr. Dirk Werner (FU Berlin, Q1228120).\n' }],
    ['Abgrenzung eine Zeile darueber', { pfad: 'docs/x.md', text: '### Trennung vom Namensvetter (Mathematiker)\n- Prof. Dr. Dirk Werner, Q1228120\n' }],
    ['Abgrenzung eine Zeile darunter', { pfad: 'docs/y.md', text: '| Q1228120 | Prof. Dr. Dirk Werner |\n| Funktionalanalysis, FU Berlin |\n' }],
    ['Esslinger Satiriker', { pfad: 'public/llms.txt', text: 'und auch nicht der Esslinger Satiriker Dr. Dirk Werner (GND 135795826).\n' }],
    ['die berichtigte Bio selbst', { pfad: 'src/lib/autor.ts', text: 'Dirk Werner, psychologist (Dipl.-Psych.) — German psychotherapist\n' }],
    ['Dipl.-Psych. ist kein Doktortitel', { pfad: 'src/lib/autor.ts', text: 'Dipl.-Psych. Dirk Werner — Psychotherapeut in Füssen-Hopfen\n' }],
  ];
  for (const [name, d] of titelGegen) {
    const { funde } = titelBefunde([d]);
    if (funde.length) { console.error(`❌ Gegenprobe "${name}": faelschlich rot — ${funde[0]}`); schief++; }
    else console.log(`✅ Gegenprobe "${name}": bleibt gruen`);
  }

  if (schief) {
    console.error(`\nSelbsttest: ${schief} Probe(n) nicht bestanden.`);
    process.exit(1);
  }
  console.log(`\n✅ Selbsttest: ${proben.length + titelProben.length} Mutationen erkannt, ` +
    `${gegen.length + titelGegen.length} Gegenproben sauber ` +
    `(Abgleich ${proben.length}/${gegen.length}, Titel ${titelProben.length}/${titelGegen.length})`);
  process.exit(0);
}

// ── Lauf ──────────────────────────────────────────────────────────────────
// ⛔ AbortController MIT clearTimeout, NICHT AbortSignal.timeout().
// Mit AbortSignal.timeout() blieb der Timer nach einem fehlgeschlagenen Abruf
// offen, und das anschliessende process.exit(0) liess Node abstuerzen:
//   Assertion failed: !(handle->flags & UV_HANDLE_CLOSING) ... async.c
//   -> Exit 127
// Ergebnis: Der Waechter haette den Build GESTOPPT, obwohl "nicht erreichbar"
// ausdruecklich nur warnen soll. Gefunden beim ersten echten Lauf, weil die
// Quelle noch nicht deployt war — der Zustand, fuer den der dritte Zweig
// ueberhaupt gebaut wurde. Ein Fehlerweg, den man nie ausloest, ist ungeprueft.
let quelle = null;
const abbruch = new AbortController();
const frist = setTimeout(() => abbruch.abort(), 15000);
try {
  const antwort = await fetch(QUELLE, { signal: abbruch.signal });
  if (antwort.ok) quelle = await antwort.json();
} catch {
  quelle = null;
} finally {
  clearTimeout(frist);
}

const eigene = new Map();
for (const f of FELDER) {
  let wert = null;
  try {
    const text = readFileSync(join(WURZEL, f.datei), 'utf8');
    wert = text.match(f.muster)?.[1] ?? null;
  } catch {
    wert = null;
  }
  eigene.set(`${f.was} (${f.datei})`, { feld: f.feld, eigener: wert });
}

const ergebnis = bewerte(quelle, eigene);

/*
 * ── Teil 2 laeuft IMMER ───────────────────────────────────────────────────
 * ⛔ Auch wenn der Abgleich oben mangels Netz ausfaellt. Der Titel-Teil liest
 *    Dateien; „nicht erreichbar" gibt es fuer ihn nicht. Haenge man ihn an den
 *    Erfolg des Abrufs, waere ein DNS-Ausfall eine Freikarte fuer eine falsche
 *    Aussage ueber einen Menschen.
 * ⛔ UNTERGRENZE: waere die Dateiliste leer, liefe der Teil gruen durch — der
 *    haeufigste Weg, auf dem ein Waechter aufhoert zu pruefen, ohne es zu
 *    sagen.
 */
const titelDateien = sammleDateien();
const titel = titelBefunde(titelDateien);
const MIN_DATEIEN = 20;
let titelRot = false;
if (titelDateien.length < MIN_DATEIEN) {
  console.error(`FEHLER Titel-Pruefung: nur ${titelDateien.length} Datei(en) geprueft, Untergrenze ${MIN_DATEIEN} —`);
  console.error('  die Liste ist leer, nicht sauber. Stimmen die Verzeichnisse in TITEL_ZIELE?');
  titelRot = true;
} else if (titel.funde.length) {
  console.error(`FEHLER Titel: ${titel.funde.length} Titelbehauptung(en) ohne Abgrenzung zum Namensvetter`);
  for (const f of titel.funde) console.error(`  ${f}`);
  console.error('\n  Dirk Werner ist Diplom-Psychologe (2000) und approbierter Psychologischer');
  console.error('  Psychotherapeut (2011). Eine Promotion gibt es nicht. Wer den MATHEMATIKER');
  console.error('  meint, benennt ihn im selben Absatz (Mathematik, Q1228120, FU Berlin).');
  titelRot = true;
} else {
  console.log(`OK — Titel: ${titelDateien.length} Datei(en) geprueft, keine Titelbehauptung ` +
    `(${titel.abgegrenzt} Nennung(en) des Namensvetters zugelassen).`);
}

// ⛔ EINE VERZWEIGUNG, KEINE DREI IFS. Der erste Entwurf liess alle Zweige
// durchfallen und haengte die OK-Meldung immer an — eine Abweichung haette
// also FEHLER *und* "OK" gemeldet, und im Fall "nicht erreichbar" waere
// quelle.stand auf null zugegriffen worden.
// ⛔ process.exitCode STATT process.exit(): Ein offener Keep-Alive-Socket aus
// dem fetch liess Node bei process.exit() abstuerzen —
//   Assertion failed: !(handle->flags & UV_HANDLE_CLOSING) -> Exit 127
// statt 0 bzw. 1. Damit haette der Waechter den Build auch dann gestoppt,
// wenn er nur warnen sollte. Mit exitCode endet Node von selbst, sobald die
// Verbindung zu ist.
// ⛔ `titelRot` wird in JEDEM Zweig beruecksichtigt. Der erste Entwurf dieses
//    Waechters liess alle Zweige durchfallen und haengte die OK-Meldung immer
//    an — genau die Bauart, die einen Befund verschluckt.
if (ergebnis.art === 'unbekannt') {
  console.log(`⚠️  Identitaets-Abgleich: ${ergebnis.text}`);
  process.exitCode = titelRot ? 1 : 0;
} else if (ergebnis.art === 'abweichung') {
  console.error(`FEHLER Identitaets-Abgleich: ${ergebnis.text}`);
  for (const b of ergebnis.befunde) console.error(`  ${b}`);
  console.error(`\n  Quelle: ${QUELLE}`);
  if (quelle?.stand) console.error(`  Stand der Quelle: ${quelle.stand} (Commit ${(quelle.quell_commit ?? '—').slice(0, 8)})`);
  console.error('  Weicht die QUELLE ab, wird werner-identity geaendert und der Hub neu deployt —');
  console.error('  nicht diese Kopie. Weicht die KOPIE ab, wird sie hier korrigiert.');
  process.exitCode = 1;
} else {
  console.log(
    `OK — Identitaets-Abgleich: ${ergebnis.text} ` +
      `(Quelle vom ${quelle.stand}, Commit ${(quelle.quell_commit ?? '—').slice(0, 8)}).`,
  );
  process.exitCode = titelRot ? 1 : 0;
}
