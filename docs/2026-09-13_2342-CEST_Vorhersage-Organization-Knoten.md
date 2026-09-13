# Vorhersage: der Verlagsknoten fehlt, und der Verweis auf ihn steht überall

**2026-09-13, 23:42 CEST** — geschrieben **vor** dem Bau, damit das Ergebnis sie
widerlegen kann. Wer sie nach dem Bau liest und alles bestätigt findet, prüft
das Datum dieses Commits.

## Was gemessen wurde und was tatsächlich der Fall ist

WebSonde meldete für `books.werner-productions.com`:

> Organization nur verschachtelt, kein eigener Knoten, keine `@id`

**Das ist nicht der Befund.** Am ausgelieferten Artefakt geprüft (nicht am
Quelltext):

- `publisher: { "@id": ".../#org-werner-productions" }` steht auf **jeder**
  Buchseite — erzeugt aus `ORG_ID` in `src/lib/generate-book-jsonld.ts:5` und
  `src/lib/generate-pages.ts:10`.
- **Ein Knoten mit dieser `@id` existiert auf keiner Seite der Site.** Die
  Startseite definiert `#author`, `#practice`, `#profilepage`, `#website` — und
  keinen Verlag. `grep` auf `org-werner-productions` in der ausgelieferten
  Startseite: **0 Treffer**.
- Die `Organization`-Knoten, die als „verschachtelt" gesehen wurden, sind
  **fremde**: `FOCUS-Gesundheit` (in `hasCredential.recognizedBy`) und
  `Prairies Book Review` (in einem `Review`). Beide sind ohne `@id` **richtig** —
  es sind nicht unsere Entitäten.

Der Unterschied ist nicht akademisch. Eine verschachtelte Organisation ist eine
schwache Aussage. Ein `@id`-Verweis auf einen Knoten, den es nicht gibt, ist
eine **Behauptung ohne Gegenstand**: 34 Seiten nennen einen Herausgeber, den
keine Seite beschreibt.

## Vorhersagezeilen

**P1** Ein Wächter „jede site-eigene `@id`, die verwiesen wird, ist auf der Site
auch definiert" ist **rot**, und zwar mit **genau einer** unaufgelösten `@id`:
`#org-werner-productions`, auftretend auf **33** Buchseiten (34 Seiten minus
Startseite).
→ Bricht, wenn es weitere baumelnde Verweise gibt. Dann ist die Zahl größer,
und der Befund war zu eng gefasst.

**P2** Der Maßstab ist **site-weit, nicht seitenweise.** Auf einer Buchseite
sind auch `#author` und `#website` nur Verweise; definiert sind sie auf der
Startseite. Ein seitenweiser Test wäre ebenfalls rot — aber an einer anderen
Frage, und würde zwei Fälle vermischen, die man nur getrennt versteht.
→ Bricht, wenn sich zeigt, dass seitenübergreifende `@id`-Verweise von
Antwortmaschinen gar nicht aufgelöst werden. Dann ist der Maßstab falsch
gewählt und P1 unterschätzt das Problem.

**P3** Nach dem Anlegen des Verlagsknotens wird der Wächter grün, **ohne dass
eine Zeile an den Buchseiten geändert wird** — die Verweise stimmen ja schon.
→ Bricht, wenn der Knoten an einem Ort landet, den die Buchseiten nicht
mit-ausliefern.

**P4 (Gegenprobe, Trennschärfe)** Setzt man `ORG_ID` auf eine `@id`, die es
nicht gibt, muss der Wächter **wieder rot** werden. Sonst prüft er nicht den
Verweis, sondern nur die Anwesenheit einer Zeichenkette.

**P5** Der Wächter muss **`dist/` lesen, nicht die Quelle.** Alle vier
vorhandenen Testdateien prüfen Generatoren; **keine prüft das Erzeugnis.** Genau
deshalb konnte ein Verweis ins Leere 34 Seiten lang unentdeckt bleiben: jeder
Test war grün, weil der Erzeuger tut, was er soll — er schreibt den Verweis.
→ Die Zeile, die die Richtung erzeugt: **woraus die Menge der definierten `@id`
gebildet wird.** Stammt sie aus derselben Datei, aus der auch die Verweise
kommen, prüft der Wächter nichts. Sie muss aus dem gebauten HTML kommen.

## Was ausdrücklich nicht vorhergesagt wird

Ob eine Antwortmaschine den Verlag danach nennt. Das ist die Wirkung, nicht der
Befund — und sie wird gemessen, nicht behauptet.

---

# Auswertung, 2026-09-13 · 23:45 CEST

**Der Text oberhalb dieser Linie bleibt unverändert.** Eine gebrochene
Vorhersagezeile wird nicht nachträchlich geglättet — sonst ist die Vorhersage
nur eine Erzählung über das Ergebnis.

| Zeile | Ergebnis |
|---|---|
| **P1** | ⛔ **gebrochen** — genau eine unaufgelöste `@id`: ✅. Aber **31 Seiten, nicht 33.** |
| **P2** | ✅ gehalten — site-weiter Maßstab; `#author`/`#website` werden nicht mit-rot |
| **P3** | ✅ gehalten — grün, ohne eine Zeile an den Buchseiten zu ändern |
| **P4** | ✅ gehalten — Verweis auf `#gibt-es-nicht` verbogen → **rot, 31 Treffer** |
| **P5** | ✅ gehalten — der Wächter liest `dist/`; die Definitionsmenge stammt aus dem gebauten HTML |

## P1: woher die falsche Zahl kam

**33 war keine Messung, sondern eine Rechnung: 34 Seiten minus Startseite.**
Tatsächlich sind es 31 Buchseiten — die drei Seiten ohne `publisher`-Verweis
sind `index`, **`impressum` und `datenschutz`**. Ich habe zwei Rechtsseiten als
Buchseiten mitgezählt.

Die Zahl hätte aus der Tabelle kommen müssen, nicht aus einer Subtraktion. Es
ist der vierte Zählfehler dieser Sitzung und derselbe Bauart wie die
vorhergehenden: **eine plausible Ableitung gibt sich als Erhebung aus.** Der
Befund selbst war richtig, seine Ausdehnung falsch — und ohne den Wächter, der
die Seiten *nennt*, wäre es unentdeckt geblieben.

Nebenbefund dazu: **31 Buchseiten passen zu „Autor von 31 Büchern"** in der
kanonischen Bio. Die Zahlen stimmen zusammen, das war vorher nicht geprüft.

## Was gebaut wurde

`src/lib/organization.ts` — **eine** Definition von `ORG_ID` und des Knotens,
importiert von `generate-book-jsonld.ts` (der aktive Astro-Weg) **und**
`generate-pages.ts` (`npm run generate`). Beide hatten die Konstante zuvor
eigen; nur eine zu ändern hätte den Fehler beim nächsten Lauf des anderen Wegs
neu erzeugt.

Der Knoten steht **im Graphen jeder Seite, die ihn verweist** — 31 definiert, 31
verwiesen, deckungsgleich im gebauten HTML. Nicht zentral auf der Startseite:
eine Antwortmaschine, die eine einzelne Buchseite liest, löst keine `@id` auf,
die nur anderswo definiert ist.

Felder ausschließlich belegt: `name` und `description` aus dem
llms.txt-Wortlaut, `url` der Hub, `founder` → `#author`, `publishingPrinciples`
→ Impressum. **Keine Rechtsform, keine Adresse, kein Gründungsdatum** — das
Impressum nennt Füssen für die *Praxis*, nicht für den Verlag.

## Zwei Befunde, die dabei aufgefallen sind und offen bleiben

**1. `index.astro:18` trägt `DO NOT MODIFY`** (commit `65ee79e`). Deshalb wurde
dem Startseiten-Graphen nichts hinzugefügt. Folge: **die Startseite kennt den
Verlag nicht.** Sie verweist ihn auch nicht, es baumelt also nichts — aber für
eine Frage wie „wer verlegt die Bücher von Dirk Werner" ist die Startseite der
naheliegende Einstieg. Das ist eine Entscheidung, nicht ein Versehen.

**2. Der `#practice`-Knoten trägt die falsche URL.** Die Psychotherapie-Praxis
(`MedicalBusiness`, Füssen-Hopfen) hat dort `"url": "https://werner-productions.com/"`
— die Adresse des Medienunternehmens. Zwei verschiedene Entitäten mit einer
URL; für eine Antwortmaschine ist die Praxis-Website damit
`werner-productions.com`. **Nicht geändert** — der Knoten liegt im gesperrten
Bereich, und Praxisdaten ändert man nicht nebenbei.
