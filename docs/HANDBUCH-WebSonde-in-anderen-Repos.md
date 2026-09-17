# WebSonde in einem anderen Repo

**Handbuch-Version 2026-09-17.2** · Quelle: `Dirk2070/websonde`, `docs/HANDBUCH-WebSonde-in-anderen-Repos.md`

> ⛔ **Diese Datei ist eine Kopie, wenn sie nicht im Repo `websonde` liegt.**
> Nicht hier bearbeiten — Änderungen gehen in der nächsten Verteilung verloren.
> Ob deine Kopie aktuell ist, sagt ein Vergleich der Versionszeile oben mit der
> Quelle. Verteilt und geprüft wird mit `verteile-handbuch.ps1` aus `websonde`
> (`.erteile-handbuch.ps1 -Pruefen` vergleicht nur und schreibt nichts).

**Stand 2026-09-17, 14:00 CEST** (Upstream-Stand und DataForSEO nachgeführt; der übrige Text ist vom 2026-09-14 und am 2026-09-17 gegen den Code geprüft). Jede Angabe ist am Werkzeug geprüft:
Exit-Codes aus `cli.py`, Abhängigkeiten aus `pyproject.toml`, Deploy-Wege an
der Cloudflare-API **und** an den Workflow-Dateien, die Kommandos an echten
Läufen.

Gedacht für die Portfolio-Repos. **Ob ein Push in deinem Repo einen Deploy
auslöst, steht nicht hier, sondern in `REPOS.md` in der OneDrive-Wurzel** —
dort mit beiden Quellen, weil eine allein die Frage nicht beantwortet.

*Kein Laufwerkspfad an dieser Stelle, und das ist kein Schönheitsgrund: dieses
Dokument wird in fremde Repos kopiert, wo ein Pfad unter einem
Benutzerverzeichnis ins Leere zeigt — und er trüge den Benutzernamen in eine
Datei, die committet wird. Genau dieser Name wird beim Export aus den
Datensätzen gefiltert (`upstream_befehle` bleiben lokal, weil sie lokale Pfade
tragen können). Ein Wächter hält die Regel: `test_handbuch_stimmt_mit_dem_code`.*

> Diese Fassung ersetzt `ANLEITUNG-Selbstmessung-fuer-andere-Repos.md`
> (jetzt in `attic/`). Die Vorgängerin trug zwei Aussagen, die am Ende
> derselben Nacht falsch waren, und ihre eigene Korrekturchronik im Text. Die
> Chronik steht in den Vorhersage-Dokumenten daneben, wo sie hingehört; hier
> stehen nur Regeln, die gelten.

---

## Drei Stufen, drei verschiedene Aussagen

| Stufe | Kommando | Beantwortet | Braucht |
|---|---|---|---|
| **1 Lesen** | `sonde daten --ordner …` (lokal) oder `--von https://websonde.app` | Was hat der letzte Lauf ergeben? | **`--ordner`: nichts.** `--von`: Access Service Token |
| **2 Messen** | `sonde audit --url … --vorschrift-von …` | Wie steht die Seite **jetzt**? | Token, Python |
| **3 Mit APIs** | drei eigene Wege, unten | Kennt mich ein Modell? Zitiert es mich? Bin ich indexiert? | je eigener Schlüssel, **kostet** |

⚠️ **Stufe 1 ist nicht Stufe 2, und der Unterschied ist leicht zu übersehen.**
Stufe 1 liefert den letzten **veröffentlichten** Lauf — beim Nachtlauf um 03:00
ist das abends ein zwanzig Stunden alter Stand. Wer damit einen Deploy von
22:45 bewertet, liest eine Messung, die vor der Änderung stattfand. **Der
Zeitstempel steht im Datensatz; lies ihn, bevor du den Wert benutzt.**

---

## Vorbereitung, einmal je Repo

### Das Paket installieren

```bash
pip install "git+https://github.com/Dirk2070/websonde"
```

Privates Repo — lokal genügt ein eingerichteter Credential-Helper oder SSH
(`git+ssh://git@github.com/Dirk2070/websonde`), im Workflow ein Token.

**Das Upstream-Werkzeug kommt mit.** `geo-optimizer-skill>=4.17,<5` ist eine
gewöhnliche Abhängigkeit, ebenso `ai-crawler-index`. Danach liegen `sonde`,
`geo`, `geo-web` und `geo-mcp` im gleichen `Scripts/`- bzw. `bin/`-Verzeichnis.
**Ein separater Installationsschritt für `geo` wäre ein Fehler** — zwei Quellen
für dieselbe Version laufen auseinander.

⚠️ **Keine Extras.** `openai` (KI-Sichtbarkeit) ist bewusst normale
Abhängigkeit: ein gewöhnliches `uv sync` installiert Extras nicht und
**entfernt sie aus einer venv, in der sie liegen**.

### Den Zugang setzen

```bash
export CF_ACCESS_CLIENT_ID="…"
export CF_ACCESS_CLIENT_SECRET="…"
```

Service Token `websonde-daten-lesen`, unbefristet, nur für `websonde.app`,
Aktion *Service Auth*. Es liest, es schreibt nicht.

⛔ **Die Werte gehören in die Umgebung, nicht ins Repo** — kein `.env` im
Projekt, kein globales `setx`. Lokal in `%USERPROFILE%\.secrets\cf-access.env`,
außerhalb von OneDrive; `sonde.ps1` lädt sie beim Start.

⚠️ **Ein Token in N Repos ist N Kopien.** Ein unbefristetes Secret in fünf
Repos lässt sich nicht einzeln widerrufen. Besser je Repo ein eigenes Token
oder Organization Secrets.

### Nur für Stufe 3

```bash
export POE_API_KEY="…"           # Sichtbarkeit — kostet Poe-Points
export PERPLEXITY_API_KEY="…"    # Zitation — kostet Guthaben
export GSC_KEY_FILE="…json"      # Index — kostenlos, nur lesend
export DATAFORSEO_KEY_FILE="…json"  # PAA-Ernte — 0,002 USD je Abruf
```

`GSC_KEY_FILE` und `DATAFORSEO_KEY_FILE` sind **Pfade**, nie der Inhalt — die
DataForSEO-Datei trägt `login` und `password` als JSON und liegt wie die übrigen
Geheimnisse unter `%USERPROFILE%\.secrets\`, außerhalb von OneDrive und außerhalb
jedes Repos. Das Dienstkonto
`websonde-gsc` (Scope `webmasters.readonly`) sieht **10 Properties**, keine
beliebige Domain.

---

## Stufe 1: den letzten Lauf lesen

```bash
sonde daten --ordner oberflaeche          # Weg A, lokal, ohne Netz und Token
sonde daten --von https://websonde.app    # Weg B, über Cloudflare Access
sonde daten --von https://websonde.app --roh   # als JSON
```

**Ein Kommando für zwei Quellen, weil der Vertrag das Format ist und nicht der
Ort:** `daten/index.json` nennt jeden Lauf mit `datei`, `url`, `zeitpunkt`,
`gesamt` und `config_hash`; die Datensätze liegen daneben.

⚠️ **Der ausgelieferte Datensatz ist nicht der lokale.** `upstream_befehle` und
`upstream_fehler` werden beim Veröffentlichen entfernt — ihr Inhalt stammt aus
Werkzeug und Umgebung und kann lokale Pfade tragen. Der Index sagt das selbst,
unter `gefiltert`.

⚠️ **Und der Datensatz hat zwei Belegorte.** `faktoren[].belege` trägt die
Kennzahlen, **`massnahmen[].belege` die Adressen** — `tote_links`,
`ai_discovery_fehlend`, `fehlende_bereiche`. Wer nur in den Faktoren sucht,
findet eine Begründung ohne ihren Beleg und hält das für eine Lücke im
Werkzeug.

---

## Stufe 2: live messen, mit der geholten Vorschrift

```bash
sonde audit \
  --url https://werner-productions.com/ \
  --vorschrift-von https://websonde.app \
  --runs kontrolle --berichte kontrolle
```

### `--vorschrift-von` ist nicht optional

Ohne die Option nimmt `audit` die Messvorschrift aus `sites.yml` — und ein
fremdes Repo hat keine. `_seite_fuer()` gibt dann ein blankes
`Seite(url=url)` zurück: **die Messung läuft mit Vorgabewerten und sagt es
nicht.**

`--vorschrift-von` holt die Vorschrift aus dem letzten veröffentlichten Lauf
derselben Domain (`profil.bestandteile`, im Klartext) und **bricht ab, wenn
keiner vorliegt** — Exit 2, kein Rückfall.

### `--url` bestimmt, **was** gemessen wird

Eine Vorschrift gilt für **eine** Seite. Wer eine andere derselben Domain
messen will, gibt sie in `--url` an, und sie gewinnt:

```
  Die Vorschrift gilt fuer https://werner-productions.com/, gemessen wird
  https://werner-productions.com/index-en.
  Marke und Gewichte der Nachbarseite gelten hier als Annahme, nicht als
  Messung -- der config_hash weicht in seite.url ab.
```

**Der Hinweis ist die Aussage, nicht Höflichkeit.** Übernommen werden `marke`,
`gewichte` und gegebenenfalls `themen` der Nachbarseite — plausibel, und
plausibel ist nicht gemessen. Weil `seite.url` im Hash steht, ist der Lauf mit
der Reihe der Hauptfassung **nicht** vergleichbar, und die Abweichungsmeldung
nennt `seite.url`.

### `--runs kontrolle` gehört dazu

**Kontroll- und Vergleichsläufe gehören nach `kontrolle/`, nie nach `runs/`.**
`runs/` ist die Messreihe: ein Lauf mit anderem Anlass und anderem Zeitpunkt
gehört nicht hinein, auch wenn er vergleichbar wäre.

### Was die Ausgabe über die Vergleichbarkeit sagt

Auf demselben Rechner:

```
  Vorschrift von https://websonde.app — Regelstand llms-messumfang, Profil audit v2
  Vorschrift und Umgebung identisch — dieser Lauf ist mit der Messreihe vergleichbar.
```

In einem Workflow eher:

```
  Vorschrift übernommen; die UMGEBUNG weicht ab: parser.lxml, parser.python
  Der config_hash unterscheidet sich deshalb absichtlich.
```

**Das ist kein Fehler.** Der `config_hash` trägt die Messumgebung mit
(`parser`, `upstream`, `datenpakete`), und eine andere Umgebung *soll* die
Vergleichbarkeit brechen. `--vorschrift-von` verspricht deshalb **keine
Hash-Gleichheit** — es überträgt die Vorschrift und **benennt**, was trotzdem
abweicht, getrennt nach Vorschrift und Umgebung. „Anders gemessen" ist nicht
„anderes gemessen".

Meldet die Ausgabe `Die VORSCHRIFT weicht ab: …`, wird tatsächlich etwas
anderes gemessen — das ist ein Befund, kein Umgebungsrauschen.

**Wer Hash-Gleichheit braucht**, nagelt die Umgebung fest: dieselbe
Python-Version wie der Nachtlauf (derzeit **3.13.9**), dieselben `lxml`- und
`beautifulsoup4`-Versionen, dieselbe `geo`-Version.

---

## Sprachfassungen

**Seit 2026-09-14 trägt `sites.yml` Sprachfassungen als eigene Einträge** —
`dirkwernerbooks.com/index-en`, `sundamind.com/en/`,
`werner-productions.com/index-en`. Jede hat eigenen Verlauf und eigenen
`config_hash`; keine geht in den Portfolio-Durchschnitt (**9 von 13**), sonst
wäre jede neue Fassung ein Nennerwechsel.

Die Konfiguration dazu:

```yaml
  - url: https://dirkwernerbooks.com/index-en
    marke: Dirk Werner
    fassung_von: https://dirkwernerbooks.com/
    portfolio_score: false
```

`fassung_von` ist das **vierte** Feld neben `rolle`, `portfolio_score` und
`im_bau` und beantwortet eine eigene Frage: *wovon ist diese Seite eine
Fassung?* Aus `portfolio_score: false` allein ist das nicht ablesbar — das
trifft auch eine Seite im Umbau und die fremde Referenz. Beim Einlesen wird
geprüft, dass der Verweis auf eine vorhandene Seite zeigt und nicht auf sich
selbst.

**Kein Feld für die Sprache.** Sie steht im `lang`-Attribut der Seite und ist
damit gemessen, nicht gepflegt — dieselbe Regel wie bei den `llms`-Geschwistern:
*nicht deklarieren, was ablesbar ist.*

### Wie du prüfst, ob deine Seite eine Fassung hat

```bash
curl -s https://deine-domain.de/ | grep -oE '<link[^>]+hreflang="[^"]+"[^>]*>'
```

**Wo `hreflang` steht, existiert eine zweite URL; wo keines steht, auch keine** —
am 2026-09-14 an allen **neun eigenen Seiten** geprüft, also am Portfolio ohne
die Referenz `developers.cloudflare.com`. Deshalb wird kein Pfad geraten.

⚠️ *Drei Neunen mit drei Bedeutungen, und sie gehören auseinandergehalten:*
**neun eigene Seiten** waren der Prüfumfang · **neun** gehen in den Durchschnitt
(die Referenz nicht) · **dreizehn** Einträge hat `sites.yml` seit den drei
Sprachfassungen, also lautet der Satz „9 von 13". Eine Zahl, die eine Auswahl
meint, nennt ihren Bestand — siehe Regel 6.

⛔ **Und prüfe mit `lang` und Byte-Größe, nicht mit dem Statuscode.**
`books.werner-productions.com` und `clear-arrows.com` antworten auf **jeden**
erfundenen Pfad mit 200, `lang=de` und byte-identischem Inhalt. Fünf
Kandidatenpfade lieferten dort fünfmal dieselbe Startseite.

---

## Stufe 3: die drei API-Wege

Vier Wege, vier Schlüssel, vier verschiedene Fragen. Sie werden verwechselt,
weil alle drei „KI" heißen könnten.

| Weg | Kommando | Schlüssel | Frage | Kosten |
|---|---|---|---|---|
| **Sichtbarkeit** | `sonde visibility --url …` oder `audit --sichtbarkeit` | `POE_API_KEY` | **Kennt** ein Modell die Marke? | Poe-Points je Lauf |
| **Zitation** | `sonde zitate --url …` | `PERPLEXITY_API_KEY` | **Verlinkt** eine Antwortmaschine die Seite? | Guthaben je Anfrage |
| **Index** | `sonde index pruefen` | `GSC_KEY_FILE` | Ist die Seite **indexiert**? | kostenlos |
| **PAA-Ernte** | `sonde paa ernten` | `DATAFORSEO_KEY_FILE` | Welche Fragen stellt Google im **People-also-ask**-Block? | 0,002 USD je Abruf |

**Sichtbarkeit und Zitation sind nicht dasselbe Maß.** `visibility` fragt, ob
ein Modell die Marke nennt — das kann ein reiner Namenseffekt sein. `zitate`
fragt, ob die eigene Seite als **Quelle** verwendet wird. Bei
`dirkwernerbooks.com` hat genau diese Verwechslung den einzigen positiven Wert
der ganzen Messreihe erzeugt: elf echte Kategoriefragen, kein Treffer, und die
100 % kamen vom Namen.

⛔ **`--sichtbarkeit` und `zitate` kosten Geld.** Der Schalter steht auf
`default=False`, und das ist beabsichtigt: 20 Fragen × 5 Wiederholungen × 4
Modelle sind ≈ 8,60 $ je Portfoliolauf. In einem Workflow, der bei jedem Push
feuert, summiert sich das still. **Erst `--dry-run`.**

⚠️ **Nur `audit` kennt `--vorschrift-von`.** `zitate` und `index pruefen` lesen
`sites.yml` (`--url` filtert nur daraus) — **ein fremdes Repo kann sie heute
nicht ohne eigene Konfiguration nutzen.** Die drei Wege sind nicht gleich weit
geöffnet.

⚠️ **Websuche verfügbar heißt nicht Websuche passiert.** Ohne Anweisung hat
Perplexity in keinem Modell gesucht. „Gesucht ja/nein" ist Pflichtfeld je
Antwort.

⚠️ **Der Gegenstand bewegt sich hier unter der Messung.** Modellantworten sind
nicht deterministisch, Anbieter tauschen Modelle ohne Vorankündigung. Ein
gesunkener Wert kann heißen: schlechter auffindbar — oder Modell ersetzt.
Deshalb Modellversion mitschreiben und `n` Wiederholungen („3 von 5" statt
Ja/Nein).

---

## In GitHub Actions

```yaml
name: WebSonde-Kontrollmessung

on:
  workflow_dispatch:
  schedule:
    - cron: "37 5 * * 2"   # krumme Minute, nicht zur vollen Stunde

jobs:
  messen:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/setup-python@v5
        with:
          python-version: "3.13.9"   # wie der Nachtlauf, für den Hash

      - name: WebSonde installieren (bringt geo mit)
        env:
          PAT: ${{ secrets.WEBSONDE_PAT }}
        run: pip install "git+https://${PAT}@github.com/Dirk2070/websonde"

      - name: Messen mit geholter Vorschrift
        env:
          CF_ACCESS_CLIENT_ID: ${{ secrets.CF_ACCESS_CLIENT_ID }}
          CF_ACCESS_CLIENT_SECRET: ${{ secrets.CF_ACCESS_CLIENT_SECRET }}
        run: |
          set -o pipefail
          sonde audit \
            --url https://werner-productions.com/ \
            --vorschrift-von https://websonde.app \
            --runs kontrolle --berichte kontrolle

      - name: Bericht aufbewahren
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: websonde-kontrolle
          path: kontrolle/
```

**`set -o pipefail`, und nicht kürzen.** In `cmd | tail -20` ist der Exit-Code
der von `tail`, nie der von `cmd`. Das ist aber nur die eine Hälfte: **die
Ausgabe eines Befehls, der eine Frage beantwortet, wird nicht gekürzt, solange
nicht feststeht, wie viele Treffer die Antwort hat.** Am 2026-09-14 kostete
`grep … | head` eine Vorhersage — der entscheidende Treffer war der elfte.
Erst zählen (`grep -c`), dann alles lesen.

**`if: always()` beim Artefakt**, sonst verliert man genau die Berichte der
Läufe, die etwas gefunden haben.

### Exit-Codes, die ein Workflow unterscheiden muss

| Code | Bedeutung | Für den Workflow |
|---|---|---|
| `0` | gemessen, Note vorhanden | grün |
| `2` | Konfiguration oder Zugang fehlt, **nichts gemessen** | rot — Token oder Vorschrift prüfen |
| `3` | `geo` nicht auffindbar | rot — Installation kaputt |
| `4` | gemessen, aber **ohne verwertbare Note** | ⚠️ **nicht grün behandeln** |

⛔ **Exit 4 ist die Falle.** Es heißt: gemessen, Note unbrauchbar
(Upstream-Fehler, Laufabbruch). Wer `|| true` schreibt, bemerkt es nicht.

---

## Sieben Regeln, bevor du einem Wert glaubst

**1. „Nichts hat sich geändert" ist selbst eine Messung.** Vor jeder Deutung
einer Wertänderung: `git log --since` des gemessenen Repos im Zeitfenster
zwischen den Läufen — und der Repos, in denen parallel gearbeitet wurde. Zehn
Sekunden. Ohne diesen Griff wird aus einer Seitenverbesserung ein Befund über
das Messgerät. ⚠️ **Welches Repo zu einer Seite gehört, steht in `REPOS.md`,
nicht im Feld `quellpfad` von `sites.yml`:** das tragen nur 7 von 13 Einträgen,
und ein lokaler Klon kann auf einem alten Nebenzweig stehen (`insightvue.app`:
ein Zweig vom Juni). Verlässlich ist die GitHub-API
(`gh api "repos/<owner>/<repo>/commits?since=<zeitpunkt>"`), weil sie auch
Commits aus anderen Sitzungen und Rechnern zeigt.

**2. „Nicht gemessen" ist nicht null.** `offpage` steht auf `None`, wenn die
Sichtbarkeit nicht gemessen wurde, und wird **herausgerechnet**, nicht als 0
gewertet. Wer den Wert weiterverarbeitet, muss `None` behandeln — `0.0` ist
beim GEO-Score ein **plausibler** Wert und deshalb nicht von einer Messung zu
unterscheiden.

**3. Ein Delta nur gegen denselben Hash.** Zwei Noten mit verschiedenem
`config_hash` sind keine Entwicklung, sondern zwei Messungen. Läufe vor
2026-09-11 tragen **kein** Profil und sind mit keinem Lauf vergleichbar, auch
nicht untereinander.

**4. „Deployt ein Push?" hat zwei Quellen, und die zweite drei Ebenen.**
Cloudflares Git Provider **und** GitHub-Workflows. Beim Workflow reicht „feuert
auf `push`" nicht: die Bedingung kann am **Workflow**, am **Job** oder am
**Schritt** sitzen. `SundaMind` hat einen Workflow, der auf `push` läuft,
`success` meldet und dessen Deploy-Job `if: workflow_dispatch` trägt — grün,
nichts ausgeliefert. **Beleg ist das Job- und Schritt-Ergebnis des letzten
Push-Laufs, nicht der Laufstatus**, und danach die Live-URL.
**Die Antwort je Site steht in `REPOS.md`** — dort mit den Befehlen für alle
drei Ebenen. Wer nur eine fragt, bekommt die halbe Antwort: im schlimmen Fall
„folgenlos", wo ein Push live geht, im harmlosen „live", wo nichts geschah.

**5. Ein 200 belegt keine Datei.** `books.werner-productions.com/sitemap.xml`
antwortet mit **200, `text/html`, 68478 B** — exakt der Größe der Startseite.
Es ist der Fallback (die echte Sitemap liegt unter `sitemap-index.xml`). Prüfe
Status **und** Content-Type **und** Größe.

**6. Eine Grenze, die greift, nennt ihren Bestand.** „1 von 25 geprüften" ohne
„(von 82 vorhandenen)" liest sich als *es gab 25*, nicht als *wir haben bei 25
aufgehört*. Wo eine Kennzahl eine Kappung enthält, steht die Gesamtzahl daneben
— `llms_begrenzt_bei`, `llms_link_pruefung_begrenzt_bei`,
`llms_tote_links_gesamt`. Fehlt sie irgendwo, ist das ein Befund. Dasselbe gilt
für jede Zahl, die eine Auswahl meint: sie nennt, woraus ausgewählt wurde.

**7. Die Markenkonsistenz ist eine Formprüfung — und sie zählt dreifach.**
Upstream vergleicht H1, `<title>` und `og:title`, geschnitten an `" — "`,
`" - "`, `" | "`, `" · "`. Der Halbgeviertstrich `" – "` der Portfolio-Titel
fehlt; verglichen werden deshalb **ganze Titel**, nicht Namen. Das Ergebnis geht
**dreimal** ein: Markensignale (2 Punkte), Trust-Identität (+1),
Trust-Konsistenz (+2). Am 2026-09-14 hoben zwei angeglichene `og:title`-Zeilen
`dirkwernerbooks.com/index-en` von 7,1 auf 7,6. **Ein Sprung in Entität oder
Autorität nach einer Titeländerung ist bis zur Korrektur ein Befund über diese
Prüfung, nicht über die Marke** — und eine Seite, deren `og:title` den `<title>`
wörtlich wiederholt, gilt als konsistent, auch wenn der Name nirgends
übereinstimmt. Stand in `OFFEN.md` („Markenkonsistenz").

### Was „Vorbehalt: Markenkonsistenz (Upstream #550)" konkret bedeutet

Seit 2026-09-14 steht der Vermerk neben der Note — in der Arbeitszeile, im Abschnitt
„Im Bau", bei den Referenzen und auf der Seitenkachel — und im Datensatz unter
`vorbehalte` (Kennung `markenkonsistenz-trennzeichen`). Er erscheint, wenn in einem
Namen, den Upstream aus H1, `<title>` oder `og:title` geschnitten hat, noch ein
Halbgeviertstrich `" – "` steckt. Gemeldet ist die Ursache als
[Auriti-Labs/geo-optimizer-skill#550](https://github.com/Auriti-Labs/geo-optimizer-skill/issues/550).

✅ **#550 ist seit 2026-09-17, 06:29 CEST geschlossen** (`completed`), behoben durch
Upstream-PR **#553**; **`v4.18.1`** vom selben Morgen nennt ihn wörtlich in den
Release Notes. ⚠️ **Der Vorbehalt verschwindet damit noch nicht:** Gemessen wird
weiterhin mit **4.17.1**, und alle gespeicherten Läufe tragen ihn. Was unten unter
„Was daraus folgt" als Zukunft steht, ist jetzt fällig — siehe dort.

Er bedeutet: ein bestimmter, bezifferbarer Teil der Note beruht auf einer Prüfung,
die an dieser Seite **Titelstücke statt Namen** vergleicht.

| Stelle | hängt am Ergebnis | wirkt auf |
|---|---|---|
| Markensignale | 2 von 10 Punkten | Faktor Entität |
| Trust-Identität | 1 von 25 Punkten | Faktor Autorität |
| Trust-Konsistenz | 2 von 25 Punkten | Faktor Autorität |

Gemessen am 2026-09-14 an `dirkwernerbooks.com/index-en`: das Kippen dieser einen
Prüfung (zwei angeglichene `og:title`-Zeilen) bewegte Entität von 3,5 auf 5,5,
Autorität von 6,0 auf 6,5 und die Gesamtnote von 7,1 auf 7,6.

Der Wert daneben (`wert` im Datensatz) sagt, in welche Richtung die Prüfung ausfiel:

| `wert` | Lesart | Seiten am 2026-09-14 |
|---|---|---|
| `True`, ein ganzer Titel steht doppelt | Punkte vergeben, weil `og:title` den `<title>` wiederholt — ohne dass Namen verglichen wurden | `dirkwernerbooks.com/`, `/index-en`, `insightvue.app`, `psyprofiler.com`, `sundamind.com/`, `werner-productions.com/` |
| `True`, kein betroffener Titel doppelt | die Konsistenz kommt aus den Schema-Namen, dort ist sie ein echter Namensvergleich | `sundamind.com/en/` |
| `False` | Punkte fehlen, weil verschiedene Taglines verglichen wurden | `clear-arrows.com` |

Was er **nicht** bedeutet:

- nicht „die Note ist falsch" — sie ist Upstreams Rechnung und bleibt unverändert,
  damit Verläufe und `config_hash` vergleichbar bleiben;
- nicht „die Marke ist uneinheitlich" — die Seite selbst ist nicht der Befund;
- nicht „an der Seite etwas ändern". Titel oder `og:title` anzugleichen, um den Wert
  zu heben, bewegt die Note, nicht die Auffindbarkeit der Marke.

Was daraus folgt:

- An der Seite ist wegen des Vorbehalts **nichts** zu tun.
- Eine Bewegung in Entität oder Autorität nach einer Titeländerung ist an einer Seite
  mit Vorbehalt kein Beleg für Markenarbeit.
- ⏰ **Fällig, nicht mehr hypothetisch:** #550 ist behoben (v4.18.1). Sobald WebSonde
  die Upstream-Version hebt, entfällt der Vermerk von selbst — und weil sich Noten
  bewegen können, steht ein **Regelwechsel mit Marker** an. Vorher die Vorhersage
  committen: betroffen sind die Seiten mit `vorbehalte`-Vermerk.
  ⚠️ **Die Spanne lässt die neue Version schon zu.** `geo-optimizer-skill>=4.17,<5`
  schließt 4.18.1 ein: Eine **Neuinstallation** — auch die des Actions-Workflows weiter
  oben — zieht ab dem 2026-09-17 4.18.1, während der Nachtlauf auf 4.17.1 misst. Das
  fällt nicht still aus (`upstream` steht in den `bestandteile` des `config_hash`), es
  meldet sich als abweichende Umgebung. Wer mit der Messreihe vergleichen will, nagelt
  die Version fest.
- Voraussichtliche Wirkung einer Korrektur, nachgerechnet am 2026-09-14 an den live
  gelesenen Titeln (ohne Schema-Namen, die im Datensatz nicht stehen): bei den sechs
  Seiten der ersten Zeile verglichen sich danach die echten Namen vor dem Strich
  („SundaMind", „PsyProfiler", „Dirk Werner" …) — das Ergebnis bliebe grün, die Note
  dort voraussichtlich gleich. `sundamind.com/en/` würde auch über die Titel grün.
  Bei `clear-arrows.com` liefern die Titel nur einen Namen; ob die Prüfung dann kippt,
  entscheiden die Schema-Namen, und die sind nicht gespeichert.
- Ein Lauf **vor** 2026-09-14 trägt den Schlüssel `vorbehalte` nicht — dort ist der
  Vorbehalt nicht „leer", sondern nicht gespeichert.

---

## Was nicht möglich ist

**Eine Messung auf Anforderung.** WebSonde läuft per Aufgabenplaner auf Dirks
Rechner; es gibt keinen Endpunkt, den ein Repo aufrufen könnte. Ein Workflow
kann nur **selbst messen** (Stufe 2/3) oder den letzten veröffentlichten Lauf
**lesen** (Stufe 1).

**Einen Trust-Stack-Sprung über ältere Läufe erklären.** Seit 2026-09-14
(`42db634`) trägt jeder Lauf am Faktor `autoritaet` auch
`belege.trust_schichten`: je Schicht `score`, `max_score`, `gefunden`, `fehlend`,
Signaltexte wörtlich von Upstream. **Läufe davor tragen den Schlüssel nicht** —
ein Vergleich über diese Grenze zeigt bei ihnen „nicht gespeichert", nicht leere
Schichten. `null` heißt: Upstream lieferte keinen geprüften Trust-Stack.

**Schreiben in die Messreihe.** Kein fremdes Repo schreibt nach `runs/`. Die
Reihe entsteht aus dem Nachtlauf, an einem Ort, mit einer Vorschrift.

**`sonde fix` in einem Workflow.** Das einzige schreibende Kommando sichert
sich mit einer Rückfrage ab. In einem Workflow beantwortet sie niemand.

---

## Die Arbeitsteilung mit den repo-eigenen Prüfern

`werner-productions` trägt 4578 Zeilen eigene Prüfer (`audit-hub.mjs`,
`audit-guards.mjs`, `audit-fakten.mjs`, `audit-identitaetsquelle.mjs`). Sie
decken llms.txt, Content-Type, Sitemap, `@graph`, `@id`-Auflösung und die
`Disallow`-Vollsperre ab — und `fetch(`-Aufrufe in `audit-hub.mjs`: **0**. Sie
prüfen Dateien, nicht das Ausgelieferte.

**Das ist die Teilung:** der repo-eigene Prüfer beantwortet „ist meine Quelle in
Ordnung?" und **blockiert den Deploy**. WebSonde beantwortet „wie ist das
Ausgelieferte auffindbar?" und **blockiert nichts**.

⛔ **Hänge WebSonde nicht in den Deploy-Pfad.** Ein Deploy, der an einer fremden
Serverstörung scheitert, ist kein Qualitätsgewinn — dieselbe Begründung, die in
`cover-erreichbarkeit.yml` und `ziel-erreichbarkeit.yml` im Kopfblock steht.

⚠️ **Und umgekehrt: umgehe das Gate nicht.** In `werner-productions` ruft
`npm run deploy` `wrangler pages deploy` direkt auf und überspringt damit die
fünf Gate-Schritte des Workflows. Er ist vorhanden, aber nicht der vorgesehene
Weg.
