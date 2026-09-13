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
