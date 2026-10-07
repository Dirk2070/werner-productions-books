# WebSonde in einem anderen Repo

**Handbuch-Version 2026-10-07.2** — sie steht auch im Dateinamen, damit ohne Öffnen
sichtbar ist, wie aktuell eine Kopie ist. Quelle: `Dirk2070/websonde`,
`docs/HANDBUCH-WebSonde-in-anderen-Repos_<Version>.md`

> ⛔ **Diese Datei ist eine Kopie, wenn sie nicht im Repo `websonde` liegt.**
> Nicht hier bearbeiten — Änderungen gehen in der nächsten Verteilung verloren.
> Ob deine Kopie aktuell ist, sagt ein Vergleich der Versionszeile oben mit der
> Quelle. Verteilt und geprüft wird mit `verteile-handbuch.ps1` aus `websonde`
> (`.\verteile-handbuch.ps1 -Pruefen` vergleicht nur und schreibt nichts).

**Stand 2026-10-07 CEST.** Neu in dieser Fassung (`2026-10-07.2`):

- **Eine fünfte Zusatzmessung außerhalb der Note: `sonde absorption`** (Abschnitt
  „Absorptionsmessung, keine Note"). Sie fragt Perplexity mehrfach nach dem
  Angebot, dem Podcast und dem Blog einer Seite und zählt, was aus den
  llms-Dateien in der Antwort ankommt. Ein Anfangswert, kein Urteil; jeder
  Datensatz trägt eine **Profilkennung**, Profile werden nie verrechnet.
- **Der Abschnitt „Feed-Links und Verzeichnisse"**: Der Podcast-Feed trägt den Rückweg
  aus den Verzeichnissen auf die eigene Seite (Kanal-`<link>` und `<link>` je Folge).
  Gemessen am 2026-10-07 für alle 17 Plattformen, mit drei Ausgängen je Plattform:
  verlinkt, nicht verlinkt, nicht prüfbar.
- **Der Abschnitt „Evidenzschicht und Anbieterquellen"**: Stufen A bis D und der
  Deckel, die Interessenlage je Quelle (neutral, anbieter, hersteller, eigen), die
  Vorsicht gegenüber Anbieterstudien und die `llms.txt`-Lage mit beiden
  Einträgen (Aggregat und Einzelfall).
- **Die Merkmalsprüfung kennt bekannte Ausnahmen, ohne Ablaufdatum.** Eine
  Ausnahme endet über eine Bedingung: Hat die Seite das Merkmal, meldet der Lauf
  sie als überflüssig.

Neu in `2026-10-07.1` war: **eine vierte
Zusatzmessung außerhalb der Note**, `sonde merkmale` (Abschnitt „Merkmalsprüfung,
keine Note" vor „Was nicht möglich ist"). Sie prüft, ob die KI-Merkmale einer
Seite live enthalten sind, und läuft täglich als eigene Aufgabe, nicht im
Nachtlauf. Außerdem: die sameAs-Prüfung deckt jetzt bis zu **40** Ziele ab
(vorher 12), ohne dass sich eine Note oder ein `config_hash` änderte, und die
Vorabprüfung von `geo --version` wartet **90** Sekunden statt 30.

Neu in `2026-09-25.1` war: **drei
Zusatzmessungen außerhalb der Note**, `sonde gsc leistung`, `sonde laufzeit`,
`sonde namensraum` (Abschnitt „Drei Zusatzmessungen, keine Note" vor „Was nicht
möglich ist"). Keine davon ändert eine Note oder einen `config_hash`, keine läuft
im Nachtlauf. Außerdem: **„Letzte 3 Monate" der Search Console sind 92 Tage,
nicht 90** — ein Export ist erst ein Sollwert, wenn sein Zeitraum nachgestellt ist.

Neu in `2026-09-19.1` war, alles vom 2026-09-19:

- ⭐ **Die zweite Frageschablone ist gebaut** — der Bauauftrag aus `.1` ist
  erledigt, der Schlüssel heißt **`werkfrage`** (unter Stufe 3).
- ⛔ **`profil_version` 3 → 4: alle 13 `config_hash` sind gebrochen** — Noten
  über diesen Schnitt hinweg sind nicht vergleichbar (**Regel 3**).
- **Der Markenabgleich hat zwei Stufen** (`marke_varianten`, `personenname`)
  und sucht **wörtlich** (**Regel 7**).
- **Ein Maßnahmentext trägt zwei Felder** — nur `befund` darf in einen Auftrag
  an ein Sprachmodell (**Regel 10**, neu).
- **Wer eine Prüfung lockert, fährt die Verfälschungsprobe noch einmal**
  (**Regel 9**, neu).

Neu in `.2` war: **Was zu tun ist, wenn die
Installation abbricht** — ein `force-include` in `pyproject.toml` machte jede
Neuinstallation unmöglich, während bestehende venvs weiterliefen (behoben,
Wächter steht). Neu in `.1` war: **`branche` ist ein
Messparameter, keine Beschreibung** — mit der Nachbarschaftsprobe als
Abbruchbedingung, dem Fall „Feld bewusst leer" und dem Befund, dass die
Anbieter-Schablone für Personenmarken nicht passt (**Regel 8** und der neue
Abschnitt unter Stufe 3). Dazu der Warnhinweis, dass bei den **Sprachfassungen
eine einzige Frage den ganzen Faktor 5 trägt**. Der 2026-09-17 brachte Faktor 5
ohne Markenfragen, den Ausgangsstand und die Referenz; um 14:00 Upstream-Stand
und DataForSEO; der übrige Text ist vom 2026-09-14 und seither gegen den Code
geprüft. Jede Angabe ist am Werkzeug geprüft:
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

⛔ **Wenn die Installation abbricht: `pip` ist hier der Zeuge, nicht der
Schuldige.** Am 2026-09-18 scheiterte ein `pip install` in einem fremden Repo
mit

```
ValueError: A second file is being added to the wheel archive
at the same path: `websonde/daten/werner-productions.png`
```

Ursache war ein `force-include` in `pyproject.toml`, das eine Datei ein zweites
Mal an denselben Pfad legte, die `packages` schon mitlieferte. Ältere
`hatchling`-Versionen führten das zusammen, neuere brechen ab — und das
Build-Backend war **ungepinnt**, zog also immer die neueste. Behoben am selben
Tag, seither hält ein Wächter die Stelle
(`tests/test_paket_laesst_sich_neu_installieren.py`).

**Die Bauart ist der Grund, warum das hier steht.** Eine bestehende venv lief
weiter, weil dort schon installiert war: Der Nachtlauf merkte nichts, die
Testsuite auch nicht — sie prüft den Quellbaum, nicht das Artefakt. Es
scheiterte **nur, wer neu installiert**: also genau du, wenn du dieses Handbuch
zum ersten Mal befolgst, und der Workflow-Block weiter unten. Zwei Tage lang sah
der Ausfall aus wie Erfolg, weil niemand zweimal anfängt.

**Für dich heißt das:** Bricht `pip install` ab, ist das ein Befund über
`websonde`, den du melden solltest — nicht über deinen Rechner. Prüfe vorher
nur, ob du wirklich in einer **frischen** Umgebung bist; eine alte venv
verschweigt solche Fehler.

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
  Vorschrift von https://websonde.app — Regelstand llms-messumfang, Profil audit v3
  Vorschrift und Umgebung identisch — dieser Lauf ist mit der Messreihe vergleichbar.
```

In einem Workflow eher:

```
  Vorschrift übernommen; die UMGEBUNG weicht ab: parser.lxml, parser.python
  Der config_hash unterscheidet sich deshalb absichtlich.
```

**Das ist kein Fehler.** Der `config_hash` trägt die Messumgebung mit
(`parser`, `upstream`, `datenpakete`, seit 2026-09-17 auch `messort`), und eine
andere Umgebung *soll* die Vergleichbarkeit brechen.

⚠️ **Neu seit 2026-09-17: der Messort steht im Hash.** WebSonde ruft zu Laufbeginn
einmal `https://cloudflare.com/cdn-cgi/trace` ab und legt das **Land** (`loc`) in
die `bestandteile`; das Rechenzentrum (`colo`) steht nur im Laufkopf, weil es im
Normalbetrieb wechselt, ohne dass sich an der Auslieferung etwas ändert. **Misst
dein Repo aus einem anderen Land als der Nachtlauf, bricht der Vergleich** — auch
wenn Vorschrift und Parser stimmen. Das ist gewollt: Wo eine Seite eine
Sprachweiche oder Geo-Regel hat, misst du sonst einen anderen Besucher. Ist der
Ort nicht bestimmbar, gibt es keinen Hash und damit „kein Vergleich"; geraten wird
nichts. Die Erwartung steht als `messort_soll` in `sites.yml`, eine Abweichung
meldet der Laufbericht als Befund über das **Messgerät**, nicht über die Seite. `--vorschrift-von` verspricht deshalb **keine
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

⚠️ **Faktor 5 rechnet seit 2026-09-17, 20:45 nur namensfreie Fragen.** Vorher
folgte die Erwähnungsrate bei **10 von 13 Seiten exakt dem Anteil der
Markenfragen**: sechs Fragen mit einer Markenfrage ergaben 17 %, drei Fragen mit
zwei Markenfragen 67 %. Eine Seite ohne `themen` bekommt überwiegend Fragen, die
ihren Namen enthalten — und die werden fast immer beantwortet, ganz gleich, wie
sichtbar die Seite ist. Deshalb gilt jetzt:

- **In die Note geht nur, was den Namen nicht nennt.** `ist_markenfrage` trennt
  die beiden Sorten; das erste Wort der `marke` genügt als Treffer.
- **Der Markenwert bleibt sichtbar, aber außerhalb der Note** — als `markenrate`,
  daneben `themenfragen` und `markenfragen` als Bestand.
- **Ohne namensfreie Frage gibt es keinen Score**, nicht eine Null. Der Grund
  steht im Feld; nicht gemessen ist nicht null.

⛔ **Alte Werte sind damit nicht fortschreibbar.** Jede Erwähnungsrate von vor
dem 2026-09-17, 20:45 enthält Markenfragen. Der Vergleich beginnt neu.

⛔ **Eine `marke`, die spezifischer ist als der übliche Name, misst zu niedrig.**
Am selben Abend gemessen, gleiche Fragen, gleiche Antworten: `developers.cloudflare.com`
kam mit `marke: Cloudflare Developers` auf **0 %** und mit `marke: Cloudflare`
auf **67 %**. Die Modelle schreiben „Cloudflare", nie den Produktnamen. **Trag
ein, wonach ein Mensch die Marke nennt**, nicht die genaue Produktbezeichnung —
sonst misst du deine Schreibweise und nennst es Sichtbarkeit.

⚠️ **`themen` ist kein Beiwerk, sondern die Messgrundlage.** Steht dort nichts,
erzeugt WebSonde überwiegend Markenfragen — und nach der Umstellung bleibt die
Note dann leer.

### `branche` ist ein Messparameter, keine Beschreibung

**Das Feld beschreibt nicht, was deine Seite tut. Es benennt die Kategorie, in
der jemand nach Anbietern sucht.** Das sind zwei verschiedene Dinge, und alle
vier Fehlgriffe des Portfolios kamen daher, dass die Angabe das Erste tat.
`branche` speist genau eine Frageschablone:

```
Wer sind die wichtigsten Anbieter im Bereich <branche>?
```

⛔ **Die Nachbarschaftsprobe ist die Abbruchbedingung, nicht der Nachweis
hinterher** (Regel Dirks, 2026-09-18). Stell die Frage einmal direkt gegen die
Engines, **bevor** etwas in `sites.yml` steht. Ein Eintrag, der erst gesetzt und
dann geprüft wird, hebt die Noten und bricht die Hashes, bevor feststeht, ob die
Formulierung sitzt. Zwölf Aufrufe kosten Cent, ein falscher Eintrag kostet eine
Laufreihe.

**Nennt das Modell deine Wettbewerber, sitzt die Angabe richtig; nennt es
Marktforscher, Analysten oder Dienstleister, sitzt sie falsch — auch wenn sie
sachlich stimmt.** Am 2026-09-18 belegt (12 Aufrufe, drei Engines):

| Angabe | Nachbarschaft |
|---|---|
| ~~Dokumentenkonvertierung~~ | nur gartner.com — Marktanalyse |
| **Markdown-Editor** ✅ | Obsidian, Typora, StackEdit, Zettlr, Joplin |
| ~~Psychologische Bildanalyse~~ | Marktforschungsberichte |
| **Aufmerksamkeitsvorhersage für Bildmaterial** ✅ | Neurons, EyeQuant, Attention Insight, Expoze |

⛔ **Und dann gibt es Seiten, für die es die Kategorie nicht gibt.** Eine
Dachseite, die Bücher, Apps, Psychotherapie und Coaching zugleich trägt, hat
keine Anbieterklasse — jede Angabe ruft die Nachbarn *eines* Teilgeschäfts auf
und lässt den Rest fallen. „Verlag und Software-Studio" scheiterte genau daran:
Das Modell spaltete von sich aus auf und stellte Penguin Random House neben
Microsoft.

**Breiter fassen macht es schlimmer, nicht besser.** Eine Oberkategorie, die
alles umfasst, hat keine Anbieterliste, weil niemand danach sucht; das Modell
müsste sie erst zerlegen, und gemessen würde seine Reaktion auf eine erfundene
Taxonomie. **Dann lass das Feld leer.** Ein Lauf ohne `branche` ergibt vier
Themenfragen und **null** Branchenfragen — kein Fehler, keine Warnung, kein
Abzug. Wächter: `tests/test_leere_branche_ist_kein_mangel.py`.

> **Eine fehlende Branchenzuordnung ist nicht dasselbe wie eine fehlende
> semantische Einordnung.** Die Vollständigkeit gehört ins Markup
> (`Organization` mit `knowsAbout`, die Person mit ihren Rollen, die Angebote als
> `Service`, `Book`, `SoftwareApplication`), wo sie Ziel ist. Bei `branche` ist
> sie Ausschlusskriterium.

⭐ **Wo die Schablone selbst nicht passt, ist das ein Befund über das Werkzeug.**
Für Personenmarken und Autorenseiten existiert kein Anbietermarkt. Die Probe hat
beide Hälften gemessen: „Anbieter im Bereich Bücher und Hörbücher" liefert nur
Plattformen (Amazon, Audible, Thalia, Spotify), aber *„Welche deutschsprachigen
Autoren schreiben Psychologie-Sachbücher und Belletristik?"* liefert **Namen** —
Watzlawick, Schmidbauer, Fitzek, Spitzer, Bas Kast, Dobelli, Jakob Hein. Der
Befund ist damit **„falsche Schablone", nicht „keine Kategorie"**.

### ✅ Die zweite Schablone: `werkfrage` (seit 2026-09-19)

Der Bauauftrag aus `.1` ist erledigt. Der Schlüssel heißt **`werkfrage`** und
trägt den **Fragekern zwischen „Welche " und „?"** — wörtlich die Probefrage,
keine Umformulierung:

```yaml
werkfrage: "deutschsprachigen Autoren schreiben Psychologie-Sachbücher und Belletristik"
```

⭐ **Der Feldname ist Teil der Abwehr.** Ein Feld, dessen Wert sichtbar ein
**Satzfragment** ist, kann man nicht für eine Beschreibung halten — genau das war
`branche` viermal passiert. Der unschöne Konfigurationswert ist der Punkt, nicht
der Makel. **Eigener Schlüssel, keine Umdeutung von `branche`** (Dirk,
2026-09-18): Sonst wird ein Feld je Seitentyp verschieden gelesen.

⛔ **Dieselbe Nachbarschaftsprobe gilt, bevor du sie einträgst.** Sie ist auch
hier Abbruchbedingung, nicht Nachweis hinterher. **Bestand: 1 von 13 Seiten**
(`dirkwernerbooks.com`) — Dachseite und Werkregister haben eine andere Kategorie
und brauchen ihre eigene Probe; Sprachfassungen bekommen nichts, solange die
Frage deutsch ist.

⚠️ **Die Frage steht hinter allen Themenfragen** (Position 5 von 7). Die
Poe-Schiene (Faktor 5, Vorgabe 6) schneidet mit `[:n]` und stellt sie;
`waehle_fragen` (Zitat-Schiene) greift abwechselnd und erreicht sie erst ab 8.

⭐ **Der Verdacht, die Themenschablone sei derselbe Fehler, ist widerlegt**
(2026-09-19, 15 Abrufe, Kriterium **vor** der Messung committet). Gefordert war,
dass die Anbieterfragen *überwiegend* Vertriebswege nennen: gemessen **0 von 3
Engines**. Kein Umbau. Der Effekt ist messbar, aber klein — dieselbe Kategorie
liefert in der Anbieterform 17 von 83 Nennungen mit „Verlag", in der Werkform
0 von 42. **Die Formulierung verschiebt, sie kippt nicht.**

⚠️ **Regelwechsel:** Der Einbau hat `profil_version` von 3 auf 4 gehoben und
**13 von 13 Hashes gebrochen** — absichtlich, siehe Regel 3.

⚠️ **Sprachfassungen sind eine eigene Kategorie, kein Vergleichspaar.** Eine
`fassung_von`-Seite trägt `portfolio_score: false` und geht nicht in den
Durchschnitt. Der Versuch, aus deutschem und englischem Lauf einen
*Sprachbefund* abzulesen, ist am 2026-09-17 widerlegt worden: Die beiden Läufe
unterscheiden **zwei Dinge zugleich** (Sprache und Fragensatz) und sind deshalb
nicht deutbar. Der Sprachvergleich ist bewusst aufgegeben.

⛔ **Bei den Sprachfassungen misst EINE Frage den ganzen Faktor 5 — und es steht
nirgends dran.** Alle drei tragen `themen: []`. Damit ist ihre **Branchenfrage
die einzige namensfreie Frage** im ganzen Katalog, und der gesamte Faktor hängt
an ihr. Am 2026-09-18 beim Leeren von `werner-productions.com/index-en` sichtbar
geworden: Die Fassung liefert seither `score: None` mit dem Grund *„Keine
namensfreie Frage gestellt"* — ausdrücklich **nicht gemessen** statt einer Null,
also regelkonform, aber eben auch ungemessen.

| Fassung | namensfreie Fragen | Faktor 5 |
|---|---|---|
| `werner-productions.com/index-en` | **0** | `None` — nicht gemessen |
| `dirkwernerbooks.com/index-en` | 1 (die Branchenfrage) | hängt ganz an ihr |
| `sundamind.com/en/` | 1 (die Branchenfrage) | hängt ganz an ihr |

**Der Punkt ist die Bauart, nicht der Einzelfall.** Eine Messung, die auf einer
einzigen Frage ruht, ist schwächer als eine über vier — und wenn diese Frage an
einem Feld hängt, das man aus guten Gründen leeren könnte, ist sie zusätzlich
fragil. Der Weg dorthin sind **eigene fremdsprachige `themen`**, nicht eine
`branche`. Bis dahin: Lies bei einer Sprachfassung `themenfragen` mit, bevor du
ihrem Faktor 5 etwas entnimmst.

**Sichtbarkeit und Zitation sind nicht dasselbe Maß.** `visibility` fragt, ob
ein Modell die Marke nennt — das kann ein reiner Namenseffekt sein. `zitate`
fragt, ob die eigene Seite als **Quelle** verwendet wird. Bei
`dirkwernerbooks.com` hat genau diese Verwechslung den einzigen positiven Wert
der ganzen Messreihe erzeugt: elf echte Kategoriefragen, kein Treffer, und die
100 % kamen vom Namen.

**Der Ausgangsstand, gegen den du misst** (2026-09-17, 198 Poe-Aufrufe über
GPT-5.4, Claude-Sonnet-4.6 und Gemini-3.1-Pro, abgelegt in `kontrolle/`, nicht
in `runs/`): Bei namensfreien Kategoriefragen nennt **keines der Modelle eine
der eigenen Seiten — 0,0 % über alle dreizehn**. Faktor 5 steht portfolioweit
auf **1,0**. Die Referenz `developers.cloudflare.com` erreicht mit passenden
`themen` **67 %** und Faktor **4,5**: Die Obergrenze ist damit belegt, die Null
ist ein Befund über die Sichtbarkeit und nicht über das Messgerät. In denselben
Antworten stehen die Wettbewerber — Hogrefe, Schuhfried, Pearson; Headspace,
Calm, 7mind; CloudConvert, Pandoc, Adobe. **Eine Null, die nur steigen kann, ist
die brauchbarste Grundlinie, die es gibt.**

⚠️ **Die Zitierrate hängt am Modell, die Erwähnungsrate nicht.** Gemini nannte in
**0 von 72** Antworten eine Quelle, Claude in 15 %, GPT in 88 %. Wer den
Modellsatz ändert, ändert die Zitierrate, ohne dass sich an der Seite etwas
getan hat — der Modellsatz gehört deshalb neben jede Zitierzahl.

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

## Zehn Regeln, bevor du einem Wert glaubst

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
⛔ **Am 2026-09-19 sind alle 13 Hashes gebrochen worden**, `profil_version`
3 → 4, weil `werkfrage` in die `bestandteile` kam. Das war beabsichtigt und ist
kein Fehler — aber jeder Vergleich über diesen Schnitt hinweg ist einer zwischen
zwei verschiedenen Messungen. ⚠️ **Der Hash bricht nicht von selbst:**
`bestandteile` ist eine **benannte Liste**; ein neues Feld muss absichtlich
hinein. Wer eines hinzufügt, ohne es einzutragen, ändert die Messung, ohne dass
die Kurve es zeigt — das ist der schlimmere Fall von beiden.

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

⭐ **Und Faktor 5 sucht die Marke WÖRTLICH** (sie macht 60 % der Note aus). Seit
2026-09-19 in zwei Stufen, weil ein Personenname anders zählt als ein
Produktname:

| Schlüssel | zählt |
|---|---|
| `marke_varianten` | **direkt** — jede Schreibweise, die die Marke meint |
| `personenname` | **nur mit einem Kontextmerkmal** im selben Block |

Der Grund für die zweite Stufe: Ein bloßer Name trifft zu oft jemand anderen.
Gezählt wird erst, wenn im selben **Block** ein Merkmal steht, das die Person
festlegt — nicht im selben Absatz, der ist zu weit. **Wer eine Marke einträgt,
trägt ihre Schreibweisen mit ein**; was nicht in der Liste steht, findet die
Messung nicht, auch wenn ein Mensch es sofort erkennt.

**8. Eine Null in Faktor 5 sagt nichts, solange die Frage ungeprüft ist.** Der
Wert ist der Anteil namensfreier Antworten, die deine Marke nennen — er misst
also immer *zwei* Dinge zugleich: wie sichtbar die Seite ist **und** ob die
Frage die richtige Nachbarschaft aufruft. Eine schiefe `branche` erzeugt
verlässlich 0 % und sieht aus wie ein Sichtbarkeitsbefund. **Bevor du eine Null
deutest, lies die Antwort und sieh nach, wer darin steht.** Stehen dort deine
Wettbewerber, ist die Null echt; stehen dort Analysten oder Plattformen, misst
du die Frage. Dasselbe gilt für den Nenner: `themenfragen` sagt dir, über wie
viele Fragen der Wert gebildet wurde — bei den Sprachfassungen ist es **eine**.

⚠️ Und ein Kontrollwert, der Ungleiches vergleicht, ist keiner: Die `markenrate`
beruht heute je nach Katalogänge auf **einer oder zwei** Markenfragen, weil
`messe_sichtbarkeit` bei `--max-fragen 6` glatt abschneidet statt `waehle_fragen`
zu benutzen. Bei 10 von 13 Seiten fällt dabei *„Ist &lt;Marke&gt; empfehlenswert?"*
weg. Die Note rührt das nicht an — der Kontrollwert schon. Steht in `OFFEN.md`.

**9. Wer eine Prüfung lockert, fährt die Verfälschungsprobe noch einmal.** Eine
Lockerung ist eine Änderung am Wächter und braucht dieselbe Probe wie sein Bau —
sonst verschiebt die Reparatur den Fehler nur von Rot nach Grün, wo er nicht mehr
auffällt. Am 2026-09-19 belegt: Ein Titelvergleich wurde in beide Richtungen
geöffnet, damit ein **Untertitel** durchgeht; damit ging ein **anderer Band
derselben Reihe** erst recht durch („The Five Love Languages" gegen „The 5 Love
Languages *of Teenagers*"). ⛔ **Die Probe deckte die Fälle ab, *für* die
gelockert wurde, und keinen einzigen Fall, den die Lockerung *neu* durchlässt.**
Zwischen Lockerung und Fehlschlag lag eine Stunde; gefunden hat es ein Blick in
den Browser, keine der beiden Maschinen. Die richtige Frage nach einer Lockerung
lautet deshalb nicht „gehen die gewünschten Fälle jetzt durch?", sondern **„was
geht jetzt zusätzlich durch, das nicht soll?"**

**10. Ein Maßnahmentext trägt zwei Felder — nur `befund` darf in einen Auftrag.**
Seit 2026-09-19 trennt `actions.Massnahme` **in der Datenstruktur**: `befund`
trägt ausschließlich eigene Formulierungen, `wortlaut` den von der gemessenen
Seite stammenden Teil. **Berichte zeigen beides; in einen Auftrag an ein
Sprachmodell geht nur `befund`.** Der Grund ist keine Theorie: Eine gemessene
Seite kann Text enthalten, der wie eine Anweisung aussieht, und Escaping hilft
dagegen nicht — die Trennung muss an der **Quelle** sitzen, nicht an der Senke.
⚠️ Wenn du Maßnahmen automatisiert weiterverarbeitest, ist das die Stelle, an der
du aufpassen musst: `wortlaut` ist Fremdtext und bleibt Fremdtext.

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

## Drei Zusatzmessungen, keine Note (seit 2026-09-25)

Alle drei beantworten eine Frage, die die Note nicht stellt, und **alle drei
bleiben draußen**: keine Note, kein `config_hash`, kein Export, kein Nachtlauf.
Ein AST-Wächter hält jede von ihnen aus Note, Profil und Export fern. Rufe sie
über `sonde.ps1` auf — der Starter setzt die Zugänge für diesen Lauf.

| Kommando | Frage | Kosten | braucht |
|---|---|---|---|
| `sonde gsc leistung` | Wie spielt Google die Seite aus? | kostenlos | `GSC_KEY_FILE` |
| `sonde laufzeit` | Bricht das Ausgelieferte beim Rendern? | kostenlos | Extra `render` |
| `sonde namensraum` | Rankt die eigene Domain für den eigenen Namen, wer teilt ihn? | 0,002 USD je Marke | `DATAFORSEO_KEY_FILE` |

Rückgabe: **Exit 2** bei allen drei, sobald etwas **nicht geprüft** oder
**nicht abgerufen** wurde — nie 0 für „nicht gemessen". **Exit 1** gibt nur
`sonde laufzeit`, wenn eine Seite einen Fehler hat — und `gsc leistung` dann,
wenn der vorgeschaltete Stufenwächter dem Dienstkonto **mehr Rechte** als
„Eingeschränkt" nachweist oder eine erwartete Property fehlt. Ihre fünf
Befunde selbst sind Beobachtungen, keine Abnahmekriterien: `gsc leistung` und
`namensraum` enden auch mit Befunden auf 0.

### `sonde gsc leistung` — fünf Befunde aus der Search Console

Je Property fünf Abrufe über **28 und 90 Tage** (API, Datenverzug 3 Tage;
„Daten bis" wird **gemessen**, nicht angenommen). `--site sc-domain:…` für eine.

1. **Striking Distance** — Anfrage-Seiten-Paare auf Position 8–20, mit
   mindestens 10 (28 T.) bzw. 30 (90 T.) Impressionen, also rund einer
   Einblendung je drei Tage.
2. **Snippet** — Position ≤ 10, ≥ 50 Impressionen, CTR unter einer bewusst
   niedrigen Untergrenze. ⚠️ Die Untergrenze ist eine **Schätzung**, keine
   Kalibrierung; der Befund sagt „prüfen", nicht „schlecht".
3. **Kannibalisierung** — dieselbe Anfrage mit ≥ 2 eigenen Seiten (je ≥ 5 Impr.).
4. **Trend** — volle Wochen; Einbruch unter 50 % des Medians (ab Median 20),
   **vier volle Wochen ohne Klick** mit Datum des letzten Klicks.
5. **Divergenz** — hohe WebSonde-Note (≥ 7,0) bei **0 Klicks** in 28 Tagen.
   ⛔ **Nur für URLs mit eigener Note** — die Note einer Startseite gilt nicht
   für ihre Unterseiten.

⛔ **Suchanfragen sind Fremdtext**: Sie stehen nur im Feld `wortlaut`, nie im
`befund`, und nur unter `gsc/` (gitignored). Jede Befundgruppe nennt ihren
Bestand („14 von 316 Anfrage-Seiten-Paaren"), dazu der **anonymisierte
Anteil**: Seiten-Impressionen ohne zugeordnete Anfrage, beide Zahlen genannt.

⚠️ **Ein Export aus der Weboberfläche ist kein Sollwert, bis sein Zeitraum
nachgestellt ist.** „Letzte 3 Monate" sind **92 Tage** (`Filter.csv`). Am
2026-09-25 machten zwei Randtage aus „hexaco modell" Pos. 25,3 (API, 90 T.)
im Export Pos. 14,9 — und damit eine Striking-Distance-Anfrage, die es im
Messfenster nicht ist.

### `sonde laufzeit` — Laufzeitfehler im Headless-Chromium

Lädt jede eigene Seite aus `sites.yml` (oder **statt** dessen `--url …`) in
einem frischen Chromium unter der WebSonde-Kennung — **kein Stealth**. Drei
Ausgänge: **fehlerfrei**, **Fehler** (mit Liste), **nicht geprüft** (Browser
fehlt, Timeout, Netz kam nicht zur Ruhe).

- **Fehler:** unbehandelte Skriptfehler, **durchgesetzte** CSP-Verstöße,
  gescheiterte Anfragen und Antworten ≥ 400 **auf der eigenen Origin**, die
  Next.js-Fehlerseite im Text.
- **Nur Hinweis:** CSP-Verstöße im Report-Only-Modus; ein **401 an einer URL,
  die in `sites.yml` unter `laufzeit_401_erwartet` steht** — je Eintrag `url`
  und `grund`, die URL auf dem Host der Seite. Ein Anmeldestatus-Endpunkt, der
  anonyme Besucher abweist, gehört dorthin. ⛔ **Jede andere URL mit 401 bleibt
  Fehler**, auch ein zweiter Endpunkt derselben Domain: Eine globale Ausnahme
  ließe einen kaputten Auth-Endpunkt auf jeder Seite still durch (Regel 9).
- **Nur gezählt:** Fehlschläge fremder Origins; `net::ERR_ABORTED` (Browser
  brechen Vorab-Abrufe routinemäßig ab).

**Einrichten, einmal:** `uv sync --frozen --extra render`, dann
`uv run python -m playwright install chromium`. Ohne das endet jede Seite mit
„nicht geprüft" und Grund — nie mit „fehlerfrei". Ein späteres `uv run` lässt
das Extra stehen (geprüft am 2026-09-25).

⭐ **Ein grünes Ergebnis ist eine Aussage, weil die Probe an einer kaputten
Seite rot wird** — die Suite fährt dafür eine Positivkontrolle im echten
Browser. Am 2026-09-25 war psyprofiler.com fehlerfrei, obwohl ein
Antwortsystem einen „client-side application error" gemeldet hatte: ein Befund
über dessen Abruf, nicht über die Seite. Gefunden hat die Probe stattdessen
zwei CSPs, die die **eigene Reichweitenmessung** still blockieren.

### `sonde namensraum` — Marken-SERP und Produkt-Namensraum

Je Marke eine Google-SERP über DataForSEO (Top 10, DE/de, desktop). Meldet die
eigene Position und **fremde Domains mit gleichem oder buchstabennahem Namen**
(Levenshtein-Abstand ≤ 2 zum Markennamen, TLD zählt nicht mit).

- **Immer zuerst `--dry-run`**: zeigt Marken, Anzahl Abrufe und Kosten und
  ruft **nichts** ab. Der Plan steht auch vor jedem echten Lauf.
- **Nur `marke`, nie `marke_varianten`.** Varianten sind **eigene**
  Schreibweisen. Einen fremden Namen dort einzutragen, damit er „gefunden"
  wird, hieße, die Kollision als eigene Marke zu zählen.
- **Personennamen fallen heraus**, mit Grund in der Ausgabe: Eine `marke`, die
  im Portfolio als `personenname` steht, gehört zum Personen-Namensraum — der
  braucht Grundwahrheit über Menschen, die es nicht gibt.
- **Drei Klassen:** die Domain dieser Marke (zählt für die Position), eine
  **andere Portfolio-Domain** (nicht fremd), fremd.
- ⚠️ Eine SERP ist **ein** Abruf von **einem** Ort zu **einem** Zeitpunkt —
  ein Datenpunkt, keine Reihe. Vor einer Deutung gegen die Search Console
  halten: Kommt die Markenanfrage dort überhaupt vor?

## Merkmalsprüfung, keine Note (seit 2026-10-07)

`sonde merkmale` beantwortet eine Frage, die die Note nicht stellt: **Sind die
KI-Merkmale, die ein Repo umgesetzt hat, auf der Live-Seite wirklich
enthalten?** Es ist ein Katalog mit drei Ausgängen je Merkmal, keine
Bewertung: `vorhanden`, `fehlt`, `nicht geprüft`. Ein Abruf, der scheitert
(Netz, 403, 429, 5xx, Timeout), ist **nie** `fehlt`.

Wie die drei anderen Zusatzmessungen bleibt es draußen: keine Note, kein
`config_hash`, kein Export, nicht im Nachtlauf. Ein AST-Wächter hält das Modul
aus Note, Profil und Export fern, ein zweiter Test aus `nachtlauf.ps1`.

- **Katalog je Host im Code**, nicht in `sites.yml`. Heute gibt es ihn für
  `dirkwernerbooks.com` und `werner-productions.com`. Ein Host ohne Katalog wird
  mit Fehlermeldung abgelehnt, nie still übersprungen.
- **Was geprüft wird:** die `/ai/*.json`, `ai.txt`, die llms-Dateien mit ihren
  Abschnitten, die IndexNow-Schlüsseldatei, die Sitemap, die Sicherheits-Header,
  ORCID, GND und LinkedIn am Person-Knoten und je Blogseite Titel, Autor,
  Autorenzeile, Hören mit Audio, dazu die Transkriptseiten.
- **Die Blogseiten kommen aus der Seite selbst:** aus `/ai/inhalte.json`. Ein
  neuer Text wird geprüft, ohne dass jemand den Katalog pflegt. Hören und Audio
  werden dort erwartet, wo `inhalte.json` für den Text eine Folge führt.
- **Keine festen Zähler.** Erwartet werden Struktur und Mindestwerte
  (`schema_version` ab 4, Listen nicht leer), nie „fünf Texte".
- **Bekannte Ausnahmen, ohne Ablaufdatum** (Dirk, 2026-10-07): Ein fehlendes Merkmal
  kann ausdrücklich als bekannt geführt werden, mit Host, Pfad, Merkmal, Grund und
  Anlegedatum. Keine Regel nach Muster, nur Einträge je Seite. Der Lauf meldet es als
  „bekannt ausgenommen" und endet mit Exit 0. Die Ausnahme endet über eine
  Bedingung, nicht über den Kalender: Hat die Seite das Merkmal doch, meldet der Lauf
  die Ausnahme als **überflüssig** (Exit 1), und sie gehört entfernt. Ein gescheiterter
  Abruf bleibt „nicht geprüft", er gilt nie als bekannt. Stand: vier Einträge für
  Blogseiten im Altmodell (Hören); die Einträge stehen im Code (`merkmale.py`).
- **Rückgabe:** Exit 0 alle vorhanden (bekannt ausgenommene zählen dazu), **Exit 1**
  mindestens ein Merkmal fehlt oder eine Ausnahme ist überflüssig, **Exit 2** ein
  Abruf scheiterte, Exit 9 nur im Lauf-Skript (nie zugewiesen).
- **Täglich:** `merkmalelauf.ps1` als Task „WebSonde Merkmale (taeglich)", 04:00,
  eigene Meldedatei `protokolle\letzter-merkmalelauf.txt`. Ein Fehlschlag dort
  berührt den Nachtlauf nicht.
- ⚠️ **Ein `fehlt` ist ein Befund über die Seite, kein Beweis für einen Mangel.**
  Zwei Merkmale des Katalogs waren bei der ersten Fassung falsch gewählt (eine
  falsche Zeile der Seite, ein englischer Titel „Transcript"); die Meldung „19
  fehlen" war Katalogfehler. Vor einer Deutung das tatsächliche HTML ansehen.
  Ob ein Fehlen gewollt ist (anderes Seitenmodell), entscheidet der Eigentümer
  der Seite.

- **Belege:** `sonde merkmale` in `src/websonde/merkmale.py` und `cli.py`, Commit `67c3e13`;
  Vorhersage und Auswertung in `docs/2026-10-07_Vorhersage-sonde-merkmale.md`; die Ausnahmen
  ohne Ablaufdatum in Commit `f9c438f` (Test `tests/test_merkmale_ausnahmen.py`); Messung
  am 2026-10-07: 84 Merkmale, davon 4 bekannt ausgenommen.

---

## Feed-Links und Verzeichnisse (seit 2026-10-07)

Ein Podcast-Verzeichnis hostet nichts selbst: Es liest den Feed der Show und übernimmt
daraus Angaben, darunter den Kanal-Link als Website der Show. Der Feed trägt damit den
**Rückweg** aus den Verzeichnissen auf die eigene Seite. Dieser Abschnitt hält fest, was
am **2026-10-07** am Beispiel `dirkwernerbooks.com` gemessen wurde.

**Der Feed (gemessen 2026-10-07, `podcast.xml`, HTTP 200, 12 Folgen):**

- Der Kanal trägt `<link>https://dirkwernerbooks.com/podcasts</link>`.
- Jede der 12 Folgen trägt einen `<link>` auf den eigenen Folgenanker, `…/podcasts#<id>` für
  deutsche und `…/podcasts-en#<id>` für englische Folgen, alle als vollständige https-Adresse
  der eigenen Domain.
- **Beleg:** Der Feed wird im Repo `dirkwernerbooks1` erzeugt (`scripts/build-podcasts.cjs`,
  Zeile 1485 für die Folgen, Zeile 1519 für den Kanal) und dort geprüft
  (`scripts/audit-podcasts.mjs`, Zeilen 624 bis 635: Anzahl und Wortlaut der Folgen-Links
  gegen die Quelle). Eingeführt mit Commit `744965e5` (#155, 2026-09-12). WebSonde prüft den
  Feed-Link selbst bisher nicht (offener Ausbau).

**Die 17 Plattformen** (aus `https://dirkwernerbooks.com/ai/inhalte.json`, `plattformen`).
Gemessen am 2026-10-07 mit einem gewöhnlichen Browser-User-Agent; gesucht wurde auf der
Show-Seite je Markt nach einem Link (`<a href>`) auf `dirkwernerbooks.com` oder
`werner-productions.com`. **Drei Ausgänge:** *verlinkt*; *nicht verlinkt* (Seite lesbar, die
Show im sichtbaren Text, kein Link); *nicht prüfbar* (Fehlercode, Bot-Schutz oder Seite, die ihren
Inhalt erst per Skript nachlädt). Ein Fehlercode ist ein „nicht prüfbar", kein Befund.

| Plattform | Ausgang | Adresse und Linktext | `rel` |
|---|---|---|---|
| Apple Podcasts (DE, US, GB, CA) | **verlinkt**, in allen vier Märkten | `dirkwernerbooks.com/podcasts`, Text „Dirk Werner 2070" (im HTML als „Sendungswebsite" geführt) | noopener noreferrer |
| Spotify | nicht prüfbar | Seite ist eine App-Hülle, Links werden per Skript nachgeladen | - |
| TrueFans | nicht prüfbar | kein `<a>` im ausgelieferten HTML; die eingebetteten Seitendaten nennen `/podcasts` und den Feed | - |
| Amazon Music (DE, US, GB, CA) | nicht prüfbar | per Skript nachgeladen, in allen vier Märkten | - |
| Deezer | nicht verlinkt | kein Website-Feld; der Quelltext nennt nur Audio-Adressen von `dirkwernerbooks.com` | - |
| Pocket Casts | **verlinkt** | `dirkwernerbooks.com/podcasts`, Text „dirkwernerbooks.com/podcasts" | noopener noreferrer |
| Podcast Addict | **verlinkt, nur auf den Feed** | `dirkwernerbooks.com/podcast.xml`, Text „RSS feed", nicht auf die Website | keines |
| YouTube Music | nicht prüfbar | App-Hülle, Inhalt per Skript nachgeladen | - |
| Podchaser | nicht verlinkt | der Quelltext nennt nur das Titelbild und den Feed, keinen Website-Link | - |
| Podverse | **verlinkt** | `…/podcast.xml` und `…/podcasts`, ohne Linktext (Symbol) | noreferrer |
| Fountain | **verlinkt** | `dirkwernerbooks.com/podcasts`, Text „dirkwernerbooks.com/podcasts" | noopener noreferrer |
| Goodpods | nicht prüfbar | HTTP 403 | - |
| Player FM | nicht prüfbar | HTTP 403 | - |
| Listen Notes | nicht prüfbar | HTTP 403, Seite „Are you a robot?" (Bot-Schutz) | - |
| TuneIn | nicht prüfbar | die Seitendaten tragen ein Feld „Website:" mit `…/podcasts`, aber kein `<a>` im HTML | - |
| Overcast | nicht prüfbar | per Skript nachgeladen | - |
| Audible (DE, US, GB, CA) | DE **nicht verlinkt**; US, GB, CA nicht prüfbar | DE: Seite lesbar, kein Link auf eine eigene Domain | - |

- **Auswertung der Tabelle:** Auf die Website verlinken 4 Plattformen (Apple, Pocket Casts,
  Podverse, Fountain), nur auf den Feed 1 (Podcast Addict), ohne Link sind 3 (Deezer,
  Podchaser, Audible DE), nicht prüfbar sind 9 (Spotify, TrueFans, Amazon Music, YouTube Music,
  Goodpods, Player FM, Listen Notes, TuneIn, Overcast). **Kein gemessener Link trägt
  `nofollow` oder `ugc`.** Jede gemessene Website-Adresse ist genau der Kanal-`<link>`
  (`https://dirkwernerbooks.com/podcasts`); bei TrueFans und TuneIn steht sie in den
  Seitendaten, ohne dass sich der Link im HTML messen ließe.
- **Zählung:** `/ai/inhalte.json` führt **17** Plattformen. Die deutsche Seite `/podcasts` zeigt
  **16**, weil Goodpods nur eine englische Seitenadresse trägt (`seite.en`, keine `seite.de`) und
  nur auf `/podcasts-en` steht. YouTube Music liest den Feed laut Dirk (Angabe vom 2026-10-07)
  nicht, die Adresse ist eine Playlist („Lux Mesopotamiae"); gemessen werden konnte das nicht (App-Hülle), die
  Adresse in den Daten ist ein `playlist`-Link. Damit sind **16 von 17** Plattformen Feed-gespeist
  (Angabe Dirk zu YouTube Music; gemessen ist nur der Link-Befund der Tabelle).
- **Regel für jedes Repo mit Podcast- oder sonstigem Feed:** Der Kanal-`<link>` zeigt auf die
  eigene Übersichtsseite der Show, jede Folge auf ihre eigene Folgenadresse, beides als
  vollständige https-Adresse der eigenen Domain. Nach jeder Änderung am Feed ist dieser Link der
  Rückweg aus den Verzeichnissen und gehört zu dem, was das Repo selbst prüft (hier
  `audit-podcasts.mjs`). Belegt ist die Wirkung für Apple (Sendungswebsite) und für die
  vier Plattformen mit gemessenem Link; für die übrigen ist sie nicht gemessen.
- **Zwei Plattformen, die am selben Tag als „weg" gemeldet wurden** (Podcast Addict mit 404,
  Listen Notes mit 410): Nachgeprüft am 2026-10-07 mit gewöhnlichem Browser-User-Agent und mit
  der WebSonde-Kennung: **Podcast Addict antwortet mit HTTP 200** und zeigt die Show
  „Dirk Werner 2070", **Listen Notes mit HTTP 403** und der Seite „Are you a robot?". Beides ist
  keine Entfernung: Der Fehlercode von Podcast Addict war nicht wiederholbar, Listen Notes ist
  Bot-Schutz und damit nicht prüfbar.
- **Beleg der Messung:** Messskript und Rohdaten vom 2026-10-07 (Abruf von `podcast.xml`,
  `ai/inhalte.json` und der 26 Show-Adressen der 17 Plattformen); die Abrufe laufen aus der
  Entwicklungsumgebung, nicht aus dem Nachtlauf, und sind eine Messung von **einem** Tag und
  **einem** Standort.

---

## Absorptionsmessung, keine Note (seit 2026-10-07)

`sonde absorption` beantwortet eine Frage, die weder die Note noch die Merkmalsprüfung
stellt: **Steht in einer Antwort von Perplexity, was die llms-Dateien einer Seite
liefern?** Es ist ein **Anfangswert, kein Urteil**: Es gibt keinen Schwellwert für
„gegriffen", und ohne einen früheren Lauf im selben Messgerät gibt es keinen Vergleich.

Wie die anderen Zusatzmessungen bleibt es draußen: keine Note, kein `config_hash`, kein
Export, nicht im Nachtlauf. Ein AST-Wächter hält das Modul aus Note, Profil und Export
fern, ein zweiter Test aus `nachtlauf.ps1`. Es braucht `PERPLEXITY_API_KEY`.

- **Aufruf:** immer zuerst `sonde.ps1 absorption --dry-run` (zeigt Profil, Fragen, Marker,
  Anzahl der Anfragen und die geschätzten Kosten, ruft nichts ab). Dann ohne `--dry-run`.
  `--wiederholungen N` (1 bis 10, Standard 5), `--ablage` (Standard `absorption`, in
  `.gitignore`: die Antworttexte sind Fremdtext und groß). `--auswerten` liest die
  Datensätze der Ablage und zeigt sie **je Profil getrennt**, ohne etwas abzurufen.
- **Drei feste Fragen** (Wortlaut im Code, Teil der Profilkennung): F1 Angebot, F2
  Podcast, F3 Blog, je mit der Anzahl der Wiederholungen gestellt.
- **Zwei Arten von Markern, getrennt ausgewiesen.** *Titelmarker* kommen bei jedem Lauf
  frisch aus `/ai/inhalte.json` der Seite: Essaytitel in beiden Sprachen, Folgentitel,
  Showname. Ein neuer Text wird ohne Pflege mitgemessen. Ein Titel, der Essay und Folge
  zugleich heißt, zählt in **beiden** Arten. *Angebotsmarker* stehen fest im Code (heute
  „La Gomera") und zählen nie als Titelmarker. Ein Marker gilt, wenn er normalisiert (ohne
  Satzzeichen, Groß und Klein egal) als ganze Wörter im Antworttext steht, bei Titeln auch
  der Kurztitel vor einem Doppelpunkt.
- **Gefundene Seiten** (`search_results`, Stufe 1) werden je Lauf eingeordnet: Hub-llms.txt,
  Hub sonst, llms-Dateien, Blog, Podcasts und Transkripte der anderen Seite, andere eigene
  Portfolio-Hosts, **Verzeichnisse der eigenen Show** (Adresse steht in `/ai/inhalte.json`,
  bei Apple auch Folgenseiten mit derselben Kennung) und „andere".
- **Profile.** Jeder Datensatz trägt `profil` mit Version, Kennung (Hash aus Anweisung,
  Modell, Ausgabeplatz, Fragewortlaut und Angebotsmarker) und den Bestandteilen. **Profil 1**
  (Lauf vom 2026-10-07): Anweisung „Antworte knapp", 1024 Ausgabetokens, kein Angebotsmarker;
  Datensätze ohne Profilfeld gelten als Profil 1. **Profil 2**: keine Anweisung, 2048
  Ausgabetokens, Angebotsmarker. Eine geänderte Kennung heißt: anderes Profil. **Zahlen
  werden nie über zwei Profile gerechnet.**
- **Rückgabe:** Exit 0 alles gemessen, **Exit 2** nicht vollständig gemessen (Schlüssel
  fehlt, Anfragen gescheitert, Marker nicht ladbar). Es gibt keinen Exit 1: Es gibt keinen
  Befund über die Seite. Ein gescheiterter Lauf ist **nicht gemessen**, nie „kein Marker".
- **Kosten:** im Profil 1 gemessen 0,0044 USD je Anfrage; ein Lauf im Profil 2 (15 Anfragen)
  kostete 0,0684 USD. Die Obergrenze im Plan (0,0065 je Anfrage) ist eine Annahme.
- **Wiederholen:** Nach einer Änderung an den llms-Dateien denselben Lauf mit **derselben
  Kennung** wiederholen und gegen den früheren Lauf desselben Profils halten.
- ⚠️ **Was die Messung nicht sagt.** Ein Treffer zeigt, dass der Inhalt in der Antwort steht,
  nicht woher er kam: Titel stehen auch auf den Seiten selbst, und im ersten Lauf standen
  Marker in Antworten auch dort, wo die Hub-llms.txt nicht unter den gefundenen Seiten war.
  Ein „zitiert" gibt es nicht, weil die Agent API keine `url_citation`-Annotationen liefert
  (0 von 30). Die Quellenliste einer Antwort enthält Seiten **über** die Show und
  Namensvettern; das sind keine Backlinks im Linksinn. Der Antworttext steht nur im Feld
  `wortlaut` des Datensatzes.
- **Anfangswerte vom 2026-10-07** (je ein Lauf, fünf Wiederholungen): Die Hub-llms.txt stand
  bei F1 und F2 in 5 von 5, bei F3 in 3 von 5 Läufen unter den gefundenen Seiten, in beiden
  Profilen gleich. Ohne die Anweisung „knapp" waren die Antworten nur etwas länger (Mediane
  821, 1295 und 2111 Zeichen statt 691, 933 und 1557). Der Angebotsmarker „La Gomera" stand
  bei F1 in 0 von 5 Antworten; das ist das Vorher für den Fall, dass er in die llms.txt
  aufgenommen wird.
- **Beobachtung vom 2026-10-07, keine Regel:** In einer manuell gestellten Antwort auf die
  Podcast-Frage (Perplexity-Oberfläche, nicht der Befehl) standen unter den Quellen neben den
  eigenen Seiten Verzeichnisse der Show (Pocket Casts, Spotify, TrueFans) und Seiten, die nicht zur
  Show gehören (ein Feed „Locker und Leidenschaft", eine Autorenseite eines Namensvetters beim
  Freitag, Übersichtsseiten von FAZ und WDR). Diese Seiten stehen nicht im Antworttext. Der Befehl selbst fand bei F2 in 5 von 5 Läufen Verzeichnisse der Show unter
  den gefundenen Seiten.
- **Offener Ausbau:** Die Einordnung kennt die Klassen eigene Seiten, andere eigene
  Portfolio-Hosts, Verzeichnisse der eigenen Show und „andere". **Namensvettern und fremde
  Feeds sind noch keine eigene Klasse**, sie stehen unter „andere"; die Praxisseite der
  eigenen Domain `dirk-werner-psychotherapie.de` steht nicht in der Konfiguration und zählt
  deshalb ebenfalls dort.
- **Belege:** `src/websonde/absorption.py` und `cli.py`; Commits `7ec14f3` (erster Bau und
  Auswertung), `6d54e02` (Quelleneinordnung), `87ca84e` (Profil 2, Angebotsmarker,
  `--auswerten`); Vorhersage und Auswertung in `docs/2026-10-07_Vorhersage-sonde-absorption.md`
  und `docs/2026-10-07_Vorhersage-sonde-absorption-profil2.md`; Datensätze vom 2026-10-07 im
  lokalen Ordner `absorption/` (nicht im Repo).

---

## Evidenzschicht und Anbieterquellen (seit 2026-09-30)

Die Datei `evidenz.yml` in `websonde` verbindet **Prüfpunkte** mit **belegten Aussagen über
einen Wirkweg** („erhöht eine llms.txt die Zitierung?"). Sie ist keine Messung der Seite,
sondern der Stand der Beleglage. Du siehst sie in den Maßnahmentexten eines Berichts: Je
Prüfpunkt nennt der Text **jeden Effekt einzeln** (Stufe, Richtung, Geltungsbereich), kein
Maximum über alle.

- **Stufen A bis D hängen am Effekt, nicht an der Aussage.** A, B, C, D sinken mit der
  Beweiskraft. Die Empfehlungsstärke (`none`, `weak`, `moderate`, `strong`) darf den Deckel
  nicht überschreiten: A erlaubt `strong`, B `moderate`, C `weak`, D nur `none`. Den Deckel
  setzt der stärkste **breit geltende, richtungstragende** Effekt, positiv oder negativ; ein
  Effekt, der nur für eine einzige Engine gilt, hebt ihn nicht.
- **Leer heißt ungeprüft, nicht Stufe D.** Ein Prüfpunkt ohne Eintrag wird nicht still
  herabgestuft. Eine Maßnahme mit Empfehlung `none` steht im HTML-Bericht im Abschnitt „Gemeldet,
  keine Empfehlung" und nicht in den Top 10 oder den Quick Wins.
- **Interessenlage je Quelle** (Dirk, 2026-10-01): `neutral`, `anbieter`, `hersteller`, `eigen`.
  Dazu je Quelle `befund_zum_interesse`: `dafuer`, `dagegen` oder `unklar`, bezogen auf **diesen
  Befund** und das Produktangebot des Anbieters, nicht auf den Anbieter im Ganzen.
- **Anbieterstudien sind kein absoluter Beleg.** Ahrefs, OppAlerts, SE Ranking, Semrush und AirOps sind
  bezahlte GEO-Anbieter mit Eigeninteresse und haben ein Interesse am Ergebnis der eigenen Studie; sie
  sind fast immer korrelativ und ohne Kontrollgruppe. Ein „kein Effekt"-Befund kann ebenso im
  Anbieterinteresse liegen („messt lieber eure Zitierungen"). Regel: Stützt sich ein Effekt
  **ausschließlich** auf Anbieterquellen mit `dafuer` oder `unklar`, gilt höchstens **Stufe C**;
  `dagegen` bleibt ohne Abschlag; eine neutrale oder Herstellerquelle im Beleg hebt den
  Abschlag auf. `hersteller` gilt nur für die Plattform selbst (Google, OpenAI, Anthropic,
  Perplexity), nie für ein Dritt-Tool. `eigen` ist die Beobachtung des Betreibers selbst: Sie
  hebt keinen Deckel und steht im Eintrag, damit die Herkunft sichtbar bleibt.
- **Verfall der Belege.** Je Effekt gilt ein Höchstalter (Standard 6 Monate, bei
  Herstellerangaben 3). Ist ein Effekt zum Stichtag älter, gilt der Eintrag als veraltet, der
  Maßnahmentext sagt es, und die Empfehlung ist auf `weak` gedeckelt. Der Nachtlauf nennt
  bald ablaufende Evidenz („Evidenz laeuft bald ab"). `evidenz_version` geht in den Lauf, nicht
  in den `config_hash`. Ob dieser Verfall mit der Regel „keine Ablaufdaten" vereinbar ist,
  ist offen (Stand 2026-10-07).

### Die `llms.txt`-Lage: zwei Einträge, die sich nicht widersprechen

| Eintrag | sagt | Stufe |
|---|---|---|
| `llms-txt-sichtbarkeit` (Aggregat) | „Eine llms.txt erhöht die Sichtbarkeit oder Zitierung in generativen Antworten nicht." Zitierung: Belege ausschließlich Anbieter (SE Ranking, Trakkr, allmo), „von B gedeckelt". Crawling: „137.210 Domains, 28% valide, 97% null Zugriffe; KI-Bots suchen keine fehlende llms.txt" (Ahrefs). Retrieval: „Google: 'Google Search ignores them'; weder Schaden noch Nutzen". | Zitierung C, Crawling C, Retrieval bei Google A |
| `llms-txt-abruf-perplexity` (Einzelfall) | „Perplexity hat im Einzelfall die llms.txt einer Domain als Quelle zitiert und Formulierungen daraus übernommen; Inhalte, die dort fehlten, fehlten auch in der Antwort." Bedingungen: „n=1: eine Frage, ein Anbieter (Perplexity), eine Domain (werner-productions.com)", „eigene Beobachtung von Dirk Werner am 2026-10-01 (observed_search), keine Studie". | D, Empfehlung `none` |

- **Beides kann gleichzeitig stimmen.** Das Aggregat ist domainweit, korrelativ und stammt von
  Anbietern; der Einzelfall zeigt nur, dass eine Antwortmaschine die Datei in einem Fall abgerufen
  hat. Der Einzelfall sagt **nichts** über die Wirkung auf die Sichtbarkeit und ändert das
  Aggregat nicht.
- **WebSonde empfiehlt die llms.txt nicht als Maßnahme** (`none`) und hält sie auch nicht für
  schädlich. Ob Änderungen an ihr in Antworten ankommen, beantwortet keine dieser Aussagen,
  sondern die Absorptionsmessung (`sonde absorption`), als Anfangswert und dann im Vergleich
  gleicher Profile.
- **Frühere Hinweise stehen im Einzelfall-Eintrag, aber nicht mitgezählt:** eine Perplexity-Antwort
  vom 2026-09-12, die die Hub-llms.txt unter ihren Quellen führte und den Showtitel trotzdem
  falsch nannte, und eine ältere Notiz zu einer zitierten Apps-Seite.
- **Die Crawler-Bedingung ist offen:** Die robots.txt beider Domains sperrte am Beobachtungstag
  keinen Bot; die Cloudflare-Zonenebene (Bot Fight Mode, KI-Crawler-Block) ist für diesen Tag
  nicht geprüft.

- **Belege:** `evidenz.yml` und `src/websonde/evidenz.py`; Commits `bae7622` (Evidenz je Effekt statt
  Maximum, 2026-09-30), `e190e1f` (Verfall je Effekt, 2026-10-01), `2599d64` (Interessenlage je
  Quelle, `llms.txt` umklassifiziert, 2026-10-01), `32b4049` und `6ed1321` (Einzelfall
  Perplexity, 2026-10-07); Regel zu Anbieterstudien: Dirk, 2026-10-01; der Stand der Einträge
  ist die Datei im Repo (7 Einträge am 2026-10-07).

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

## Regel: Wer deployt, misst (Dirk, 2026-09-17)

> **Jedes Repo, das wichtige Zusätze deployt, führt auch die Testungen aus diesem
> Handbuch durch.**

Gemeint ist **Stufe 2**: nach dem Deploy live messen, mit der geholten Vorschrift,
nach `kontrolle/`. Der Grund steht schon oben: Der Nachtlauf misst um 03:00 — wer
abends deployt, erfährt bis zu **zwanzig Stunden** nichts. Die Regel schließt diese
Lücke, sie ersetzt den Nachtlauf nicht.

⛔ **Nicht als Deploy-Gate.** Die Messung läuft **nach** dem Deploy in einem eigenen
Job und blockiert nichts — aus demselben Grund, aus dem WebSonde nicht in den
Deploy-Pfad gehört (siehe nächster Abschnitt). Ein Deploy, der an einer fremden
Serverstörung scheitert, ist kein Qualitätsgewinn.

### Stand 2026-09-17: nirgends umgesetzt, und woran es hängt

Geprüft an allen neun ausliefernden Repos: **keines** ruft WebSonde auf. Der einzige
Treffer für „WebSonde" in `dirkwernerbooks1/.github/workflows/check.yml` ist ein
**Kommentar**, kein Aufruf — eine Textsuche beantwortet nicht, ob etwas ausgeführt wird.

⚠️ **Der Blocker sind die Secrets, nicht der Workflow.** Stufe 2 braucht
`CF_ACCESS_CLIENT_ID`, `CF_ACCESS_CLIENT_SECRET` und einen PAT für die Installation
aus dem privaten Repo. Bestand am 2026-09-17 (`gh secret list`, nur Namen):

| Repo | vorhandene Secrets | WebSonde-tauglich |
|---|---|---|
| werner-productions, dirkwernerbooks1 | `CF_ACCOUNT_ID`, `CF_API_TOKEN`, `IDENTITY_PAT` | nein |
| markdownly-anything, SundaMind | `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN` | nein |
| Shadow-Integrator, studio | `FIREBASE_SERVICE_ACCOUNT` | nein |
| books, clear-arrows, InsightVUE-Webapp | keine | nein |

**Kein einziges Repo trägt die drei nötigen Werte.** Und der Ausweg, den dieses
Handbuch weiter oben empfiehlt — Organization Secrets statt N Kopien —, **gibt es
hier nicht**: `Dirk2070` ist ein persönliches Konto, kein Org (die API antwortet mit
HTTP 404).

### ✅ Entschieden (Dirk, 2026-09-17): die Messung läuft zentral, nicht je Repo

> *„Dann lokal im WebSonde Repo einbauen."*

**Kein Repo bekommt die Access-Secrets.** Die Regel wird in `websonde` umgesetzt, dort,
wo die Zugangsdaten ohnehin liegen — in `%USERPROFILE%\.secrets\`, außerhalb jedes
Repos, geladen von `sonde.ps1`.

Das ist nicht der Notausgang, sondern die bessere Bauart:

- **Ein Token statt neun.** Ein unbefristetes Access-Token in neun Repos ließe sich
  nicht einzeln widerrufen — genau die Warnung aus „Den Zugang setzen" weiter oben.
  Hier bleibt es an einem Ort.
- **Kein Secret in fremder CI.** Ein Wert, der in neun Actions-Umgebungen liegt, ist
  in neun Logs, Caches und Fork-PRs exponiert.
- **Eine Vorschrift, eine Umgebung.** Ein CI-Runner hat andere `parser`-Versionen als
  der Nachtlauf, bricht also den `config_hash` — die Messung wäre mit der Messreihe
  nicht vergleichbar. Zentral gemessen ist sie es.

**Was dein Repo dafür tut: nichts.** Kein Workflow, kein Secret, keine Abhängigkeit.
Die Regel „wer deployt, misst" bleibt gültig — sie wird nur nicht von dir ausgeführt.
Was du beitragen kannst, ist ein **Build-Stempel** im ausgelieferten HTML
(`<meta name="build-stamp">` mit dem Commit), damit die zentrale Messung erkennt,
*welcher* Stand gemessen wurde und ob der Deploy überhaupt durch ist.

Stand des Baus: `sonde audit --url … --runs kontrolle` kann die Messung heute schon.
Was fehlt, ist die **Auslösung** — siehe `OFFEN.md`, „Nach dem Deploy messen".

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
