# WebSonde in einem anderen Repo

**Handbuch-Version 2026-10-12.2** — sie steht auch im Dateinamen, damit ohne Öffnen
sichtbar ist, wie aktuell eine Kopie ist. Quelle: `Dirk2070/websonde`,
`docs/HANDBUCH-WebSonde-in-anderen-Repos_<Version>.md`

> ⛔ **Diese Datei ist eine Kopie, wenn sie nicht im Repo `websonde` liegt.**
> Nicht hier bearbeiten — Änderungen gehen in der nächsten Verteilung verloren.
> Ob deine Kopie aktuell ist, sagt ein Vergleich der Versionszeile oben mit der
> Quelle. Verteilt und geprüft wird mit `verteile-handbuch.ps1` aus `websonde`
> (`.\verteile-handbuch.ps1 -Pruefen` vergleicht nur und schreibt nichts).

**Stand 2026-10-12 CEST, abends.** Neu in dieser Fassung (`2026-10-12.2`):

- ⛔ **In der Markenklasse entfällt die Stufe `genannt` – ohne Ausnahme.** Die Frage nennt den Namen;
  dass die Antwort ihn, die Domain oder eine weitere Schreibweise trägt, ist dort kein Fund. Der
  Laufbericht zeigt an dieser Stelle **„entfällt (Name stand in der Frage)"**. Bis zur Fassung `.1`
  machte die Domain als ganzer Host eine Markenantwort zu `genannt ja`.
- **Was eine Markenantwort belegt, steht in drei Zuordnungen**, getrennt gezählt und nie mit `genannt`
  verrechnet: `urheber_zugeordnet`, **`werk_zugeordnet`** (neu) und **`domain_zugeordnet`** (neu).
- **Werktitel haben zwei eigene Felder**, `werktitel` und `werktitel_mit_kontext` (**Regel 7**). Sie
  stehen **nicht** in `marke_varianten` und zählen nur in namensfreien Fragen für `genannt`.
- ⛔ **Zwei weitere Brüche der Ergebnisreihe am Abend des 2026-10-12**, für alle zehn Seiten. Regelstand
  jetzt `stufen-dreiwertig-urheber-hostgrenze-werktitel-markenklasse`. Die Note ist nicht berührt.
- ⛔ **Dieser Regelstand ist eingefroren, bis der Sichtbarkeits-Vollauf am 01.11.2026 gelaufen ist**
  (Dirk, 2026-10-12): keine Änderungen an Zählregeln, Varianten, Klassen oder Hash-Bestandteilen.
  Neue Regelideen gehören nur in `OFFEN.md` im Repo `websonde`, unter „nach dem Vollauf 01.11.".

Neu in `2026-10-12.1` war:

- ⛔ **Die Ergebnisreihe der Sichtbarkeit ist am 2026-10-12 dreimal gebrochen** (Regelstand danach
  `stufen-dreiwertig-urheber-hostgrenze`, inzwischen überholt, siehe oben). Die Note und ihr
  `config_hash` sind nicht berührt. Der
  Laufbericht weist den Bruch selbst aus (Zeile „BRUCH DER ERGEBNISREIHE", Feld `vorlauf`).
- **Kontextmerkmale zählen nur als ganzes Wort oder ganze Phrase** (**Regel 7**). „Autorennfahrer"
  bestätigt kein Merkmal „Autor"; gebeugte Formen werden eigens eingetragen.
- ⛔ **Bei der Markenfrage ist der Personenname kein `genannt`.** Dafür gibt es die eigene Angabe
  **`urheber_zugeordnet`** (ja, nein, falsch, nicht geprüft), getrennt gezählt, nie verrechnet.
- **Die eigene Domain zählt nur als ganzer Host.** Eine Unterdomain ist eine andere Seite; das gilt für
  `genannt`, `zitiert` und `gefunden` (und seit `.2` für `domain_zugeordnet`).
- **Feld je Frageklasse:** `branche_anbieter`, `branche_empfehlung`, `branche_orientierung`
  übersteuern `branche` für genau ihre Klasse.
- **Der Laufbericht stellt jeden Lauf neben den letzten unter gleichem Hash**; ein monatlicher
  Schätzlauf meldet die Kosten eines Vollaufs und startet nie einen bezahlten Lauf.
- **Ein Vollauf ist jetzt mit 9,80 $ geschätzt** (420 Anfragen), nicht mehr mit 10,10 $.
- **Neuer Abschnitt „Nach dem Deploy: IndexNow"** (Regel Dirks vom 2026-10-12, einheitliche Wertung,
  Standardweg für `insightvue.app`).

Neu in `2026-10-11.2` war, alles aus der Probe des Handbuchs
über `werner-productions` und aus dem ersten Vollauf der Sichtbarkeit:

- **Stufe 1 zeigt je Seite den jüngsten Lauf**, und `sonde daten --url <Seite>` schränkt auf eine Seite
  ein. Vorher standen dort zehn Läufe einer einzigen Seite.
- **Stufe 2 holt die Vorschrift der eigenen Seite**, erst ohne einen eigenen Lauf die der Nachbarseite.
  Vorher gewann für `werner-productions.com/` Nacht für Nacht die englische Fassung.
- **Poe ist in der Sichtbarkeitsreihe verkleinert** (Dirk, 2026-10-11): GPT im vollen Umfang, Claude nur
  in der Stichprobe, Gemini bei Poe entfällt. Ein Vollauf ist mit **10,10 $** geschätzt statt mit 23,62 $.
- **Der erste Vollauf ist gefahren** (440 von 440 Anfragen, 9,90 $); der Ausgangsstand steht im
  Abschnitt „Faktor 5: eigene Ergebnisreihe".
- ⛔ **Zwei Berichtigungen an der Ergebnisreihe, am Vollauf gefunden:** Bei der Markenfrage war
  `genannt` ohne Beleg außerhalb des Echos kein `nein` mehr (seit `2026-10-12.2` entfällt die Stufe
  dort ganz), und ein fehlender
  Sucheintrag ist bei Poe mit GPT `gesucht nein` statt `unbestimmt`. Neu: `sonde sichtbarkeit
  --neu-auswerten` (dieselben Antworten, kein Abruf).
- **Zwei Meldungen berichtigt:** Ein entfernter Vorschriftsteil steht in Stufe 2 unter „Die
  VORSCHRIFT weicht ab", nicht unter Umgebung; `sonde sichtbarkeit` sagt in einem fremden Ordner,
  dass es im Arbeitsordner von websonde läuft.

Neu in `2026-10-11.1` war:

- ⛔ **Faktor 5 ist nicht mehr Teil der Note.** „Werden Sie in KI-Antworten tatsächlich genannt?" ist eine
  **eigene Ergebnisreihe** mit eigenem Hash: `sonde sichtbarkeit` (neuer Abschnitt „Faktor 5: eigene
  Ergebnisreihe"). Drei Wege, je Weg und Modell eine Verteilung, nie eine Zahl; nicht im Nachtlauf.
- ⛔ **`profil_version` 5 → 6: alle 13 `config_hash` sind gebrochen.** Keine Note hat sich dadurch geändert,
  aber kein Lauf ab dem 2026-10-12 trägt ein Delta gegen die Läufe davor (**Regel 3**). Der Laufbericht von
  `audit` und `portfolio` weist den Bruch jetzt selbst aus.
- **Die Schalter `--sichtbarkeit`, `--engines`, `--max-fragen` an `audit` und `portfolio` und das Kommando
  `sonde visibility` gibt es nicht mehr.** Ein Aufruf damit endet mit Exit 2 und schreibt nichts.
- ⛔ **Ein Sichtbarkeitslauf kostet Geld und läuft nur nach gezeigter Schätzung und Dirks Ok**
  (**Regel 11**, neu).

Neu in `2026-10-10.2` war: Der Regelwechsel `kopfsignale` ist gegen
den ersten Nachtlauf gehalten (Abschnitt „Kopfsignale"): Durchschnitt der neun Hauptseiten **+0,11**, in der
vorhergesagten Spanne; sieben Seiten steigen, zwei sinken, drei bleiben. Die Evidenzbasis zählt **9** Einträge.

Neu in `2026-10-10.1` war: **Die Differenzprobe
`sonde differenzprobe`** (Abschnitt „Differenzprobe: deklariert gegen beobachtet"). Sie beantwortet
in drei getrennten Angaben je Crawler, was robots.txt erklärt, was der Server einem Abruf mit dem
Crawler-Token ausliefert und, mit `--identitaet` für eigene Zonen, ob der echte Crawler kam und
bedient wurde. Keine Note, kein Hash, nicht im Nachtlauf. Dazu zwei Berichtigungen am Starter:
`sonde.ps1` liest jetzt auch `CLOUDFLARE_ANALYTICS_TOKEN` aus `cf-access.env`, und `sonde crawler`
findet `gcloud` unter Windows. Die Evidenzbasis trägt zwei neue Einträge ohne Bindung an eine Maßnahme.

Neu in `2026-10-07.4` war: **Die Kopfsignale hreflang,
Twitter Card und og:locale** (Abschnitt „Kopfsignale: hreflang, Twitter Card, og:locale").
Ein neuer Befehl `sonde kopfsignale` misst sie je eigenem Host über alle HTML-Seiten der Sitemap
(Zusatzmessung ohne Note), und **derselbe Leser geht gleichgewichtig als dritter Bestandteil in den
Faktor `struktur` der Note ein**. Das ist ein **Regelwechsel** (Regelstand `kopfsignale`): Läufe davor
sind nicht vergleichbar.

Neu in `2026-10-07.3` war: Im Abschnitt „Absorptionsmessung, keine Note" der **Kontrolllauf bei
unveränderter Seite** und damit die Streuung der Messung; der Eintrag „La Gomera" in der Hub-llms.txt ist
nicht erfolgt (0 Treffer am 2026-10-07).

Neu in `2026-10-07.2` war:

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
export PERPLEXITY_API_KEY="…"    # Zitation und Sichtbarkeit — kostet Guthaben
export GSC_KEY_FILE="…json"      # Index — kostenlos, nur lesend
export DATAFORSEO_KEY_FILE="…json"  # PAA-Ernte (0,002 USD je Abruf), Sichtbarkeit (Stichprobe)
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
sonde daten --von https://websonde.app --url https://werner-productions.com/   # eine Seite
sonde daten --von https://websonde.app --roh   # als JSON
```

**Ohne `--url` steht je Seite der jüngste Lauf da**, nach Adresse geordnet:

```
623 Laeufe ueber 13 Seiten, erzeugt 2026-10-11T01:07:10.407289+00:00
Je Seite der juengste Lauf (--url <Seite> zeigt ihren Verlauf, --roh alles):
  2026-10-11T01:06:56.044158+00:00   7.1  https://books.werner-productions.com/
  2026-10-11T01:03:01.990188+00:00   8.0  https://clear-arrows.com/
  …
```

**Mit `--url` steht der Verlauf dieser einen Seite da** (die letzten zehn Läufe, ihr Bestand in der
Zeile darüber); mit `--roh` dazu nur ihre Einträge als JSON. Eine Seite, die der Index nicht kennt,
ist Exit 2 mit der Liste der bekannten Seiten, kein leeres Ergebnis. Ist der jüngste Lauf einer Seite
ein Ausfall, steht darunter der letzte Lauf mit Note.

⚠️ **Bis zur Fassung vom 2026-10-11 zeigte das Kommando die letzten zehn Einträge des Index**, und der
ist nach Adresse geordnet: zehn Läufe von `werner-productions.com/index-en`, für jede andere Seite
nichts. Wer eine ältere Installation hat, bekommt seine Seite nur über `--roh`.

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

`--vorschrift-von` holt die Vorschrift aus dem jüngsten veröffentlichten Lauf
**genau dieser Seite** (`profil.bestandteile`, im Klartext). Nur wenn die Reihe
die Seite nicht kennt, nimmt es den jüngsten Lauf derselben Domain und sagt das
(nächster Abschnitt). Liegt auch davon keiner vor, **bricht es ab** — Exit 2,
kein Rückfall.

⚠️ **Bis 2026-10-11 gewann der jüngste Lauf der Domain.** Der Nachtlauf misst
eine Sprachfassung direkt nach ihrer Hauptseite; für `werner-productions.com/`
kam deshalb die Vorschrift von `…/index-en`, obwohl die eigene veröffentlicht
war. Gefunden an genau dem Beispielaufruf oben.

### `--url` bestimmt, **was** gemessen wird

Eine Vorschrift gilt für **eine** Seite. Wer eine Seite misst, die die Reihe
nicht kennt, bekommt die Vorschrift der Nachbarseite, und `--url` gewinnt:

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
| **Sichtbarkeit** | `sonde sichtbarkeit --url …` | `POE_API_KEY`, `PERPLEXITY_API_KEY`, `DATAFORSEO_KEY_FILE` | Wird die Seite **gefunden, zitiert, genannt**? | Guthaben bei drei Anbietern; Schätzung vor dem Lauf |
| **Zitation** | `sonde zitate --url …` | `PERPLEXITY_API_KEY` | **Verlinkt** eine Antwortmaschine die Seite? | Guthaben je Anfrage |
| **Index** | `sonde index pruefen` | `GSC_KEY_FILE` | Ist die Seite **indexiert**? | kostenlos |
| **PAA-Ernte** | `sonde paa ernten` | `DATAFORSEO_KEY_FILE` | Welche Fragen stellt Google im **People-also-ask**-Block? | 0,002 USD je Abruf |

⛔ **Faktor 5 ist seit 2026-10-11 nicht mehr Teil der Note.** Die Sichtbarkeit ist
eine eigene Ergebnisreihe mit eigenem Hash; was sie misst, wie man sie liest und
was sie kostet, steht im Abschnitt „Faktor 5: eigene Ergebnisreihe". Die Note
führt den Faktor weiter als Zeile ohne Wert („nicht Teil der Note") und rechnet
ihn heraus, wie in jedem Nachtlauf zuvor.

⛔ **Werte der alten Messung sind nicht fortschreibbar.** Bis 2026-10-11 gab es
eine Erwähnungsrate über Poe (`sonde visibility`, Schalter `--sichtbarkeit`),
seit 2026-09-17 nur über namensfreie Fragen. Die Ergebnisreihe stellt andere
Fragen, zählt in drei Stufen und nur Antworten mit belegter Suche. Der Vergleich
beginnt neu.

⛔ **Eine `marke`, die spezifischer ist als der übliche Name, misst zu niedrig.**
Am 2026-09-17 gemessen, gleiche Fragen, gleiche Antworten: `developers.cloudflare.com`
kam mit `marke: Cloudflare Developers` auf **0 %** und mit `marke: Cloudflare`
auf **67 %**. Die Modelle schreiben „Cloudflare", nie den Produktnamen. **Trag
ein, wonach ein Mensch die Marke nennt**, nicht die genaue Produktbezeichnung —
sonst misst du deine Schreibweise und nennst es Sichtbarkeit. Das gilt für die
Ergebnisreihe unverändert: Die Stufe `genannt` sucht in **namensfreien** Fragen die
Schreibweisen aus `marke_varianten`, sonst `marke` (in der Markenklasse entfällt sie,
**Regel 7**).

⚠️ **`themen`, `werkfrage` und `wettbewerber` liest nur noch `zitate`.** Die
Ergebnisreihe bildet ihre Fragen aus `marke`, `branche` und `einsatzzweck`.

### `branche` ist ein Messparameter, keine Beschreibung

**Das Feld beschreibt nicht, was deine Seite tut. Es benennt die Kategorie, in
der jemand nach Anbietern sucht.** Das sind zwei verschiedene Dinge, und alle
vier Fehlgriffe des Portfolios kamen daher, dass die Angabe das Erste tat.
`branche` speist die Anbieterfrage der Zitat-Schiene und, in `sonde sichtbarkeit`,
alle drei namensfreien Klassen (Anbieter, Empfehlung, Orientierung). Der Kern ist
dieselbe Schablone:

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
Taxonomie. **Dann lass das Feld leer.** Der Fragenkatalog der Zitat-Schiene hat ohne
`branche` vier Themenfragen und **null** Branchenfragen — kein Fehler, keine
Warnung, kein Abzug. Wächter: `tests/test_leere_branche_ist_kein_mangel.py`.
In `sonde sichtbarkeit` läuft eine solche Seite nur die Markenfrage und steht im
Ergebnis als **„nur Marke, Kategorie nicht geprüft"**. Die Lücke wird in
`sites.yml` mit `sichtbarkeit_luecke: "<Grund>"` als bewusst markiert; der
Schätzmodus nennt sie in jedem Fall, mit oder ohne Grund.

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

⚠️ **Seit 2026-10-11 liest nur noch `zitate` dieses Feld.** `sonde sichtbarkeit`
kennt vier feste Klassen und keine Werkfrage; `dirkwernerbooks.com` läuft dort
nur die Markenfrage.

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

⚠️ **Die Frage steht hinter allen Themenfragen** (Position 5 von 7).
`waehle_fragen` (Zitat-Schiene) greift abwechselnd und erreicht sie erst ab
`--max-fragen 8`. Die Poe-Schiene, die sie mit der Vorgabe 6 stellte, gibt es
seit 2026-10-11 nicht mehr.

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

⚠️ **In der Ergebnisreihe laufen die Sprachfassungen nicht.** Ein Eintrag mit
`fassung_von` bekäme dieselben deutschen Fragen wie seine Hauptseite und kostete
dieselbe Messung ein zweites Mal. Bis 2026-10-11 trug bei den drei Fassungen eine
einzige Frage den ganzen Faktor 5; diese Bauart gibt es nicht mehr.

**Genannt und zitiert sind nicht dasselbe Maß.** Dass ein Modell die Marke
nennt, kann ein reiner Namenseffekt sein; zitiert ist die Seite erst, wenn sie
als **Quelle** in einem strukturierten Feld der Antwort steht. `sonde sichtbarkeit`
führt beides als getrennte Stufen, `zitate` misst die Quelle über einen einzelnen
Weg. Bei `dirkwernerbooks.com` hat genau diese Verwechslung den einzigen
positiven Wert der alten Messreihe erzeugt: elf echte Kategoriefragen, kein
Treffer, und die 100 % kamen vom Namen.

**Der Ausgangsstand der alten Messung** (2026-09-17, 198 Poe-Aufrufe über
GPT-5.4, Claude-Sonnet-4.6 und Gemini-3.1-Pro, abgelegt in `kontrolle/`, nicht
in `runs/`): Bei namensfreien Kategoriefragen nennt **keines der Modelle eine
der eigenen Seiten — 0,0 % über alle dreizehn**. Faktor 5 stand portfolioweit
auf **1,0**. Die Referenz `developers.cloudflare.com` erreicht mit passenden
`themen` **67 %** und Faktor **4,5**: Die Obergrenze ist damit belegt, die Null
ist ein Befund über die Sichtbarkeit und nicht über das Messgerät. In denselben
Antworten stehen die Wettbewerber — Hogrefe, Schuhfried, Pearson; Headspace,
Calm, 7mind; CloudConvert, Pandoc, Adobe. **Eine Null, die nur steigen kann, ist
die brauchbarste Grundlinie, die es gibt.**
⚠️ Dieser Stand stammt aus der Messung vor 2026-10-11 (andere Fragen,
Erwähnungsrate statt Stufen) und ist mit der Ergebnisreihe **nicht vergleichbar**;
ihr eigener Ausgangsstand ist der erste Vollauf vom 2026-10-11 (Abschnitt „Faktor 5: eigene
Ergebnisreihe").

⚠️ **Die Zitierrate hängt am Modell, die Erwähnungsrate nicht** (alte Messung,
2026-09-17). Gemini nannte in
**0 von 72** Antworten eine Quelle, Claude in 15 %, GPT in 88 %. Wer den
Modellsatz ändert, ändert die Zitierrate, ohne dass sich an der Seite etwas
getan hat — der Modellsatz gehört deshalb neben jede Zitierzahl. In der
Ergebnisreihe ist je Weg und Modell festgehalten, ob die Antwort überhaupt
strukturierte Quellen trägt (`quellen_strukturiert` in `sichtbarkeit.yml`); wo
nicht, ist `zitiert` dort `nicht_geprueft`, nie null.

⛔ **`sonde sichtbarkeit` und `zitate` kosten Geld.** Ein Vollauf der
Ergebnisreihe ist mit **10,10 $** geschätzt (440 Anfragen, Preise vom
2026-10-11), ein Einzelseitenlauf mit einer Frage über alle drei Wege mit
1,29 $. Keines der beiden Kommandos gehört in einen Workflow, der bei jedem Push
feuert. **Erst der Schätzmodus** (`sonde sichtbarkeit --nur-kosten`, bei `zitate`
`--dry-run`) — und für die Sichtbarkeit gilt **Regel 11**.

⚠️ **Nur `audit` kennt `--vorschrift-von`.** `zitate` und `index pruefen` lesen
`sites.yml` (`--url` filtert nur daraus) — **ein fremdes Repo kann sie heute
nicht ohne eigene Konfiguration nutzen.** Die drei Wege sind nicht gleich weit
geöffnet.

⚠️ **Websuche verfügbar heißt nicht Websuche passiert.** Ohne Anweisung hat
Perplexity in keinem Modell gesucht. „Gesucht" ist Pflichtfeld je Antwort, in
der Ergebnisreihe dreiwertig (`ja`, `nein`, `unbestimmt`); Antworten ohne
belegte Suche stehen getrennt von der Hauptverteilung.

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

## Elf Regeln, bevor du einem Wert glaubst

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

**2. „Nicht gemessen" ist nicht null.** `offpage` steht seit 2026-10-11 in
**jedem** Lauf auf `None` (Faktor 5 ist eine eigene Ergebnisreihe) und wird
**herausgerechnet**, nicht als 0 gewertet; dasselbe gilt für jeden anderen
Faktor ohne Messung. Wer den Wert weiterverarbeitet, muss `None` behandeln — `0.0` ist
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
⛔ **Am 2026-10-11 sind wieder alle 13 Hashes gebrochen worden**, `profil_version`
5 → 6, weil die Sichtbarkeit die `bestandteile` verlassen hat. Keine Note hat
sich dadurch geändert. Der Laufbericht von `audit` und `portfolio` nennt einen
solchen Bruch seither selbst: je Seite eine Zeile „Profilbruch der Note" mit dem
Tag des Vorlaufs und den geänderten Bestandteilen, in `portfolio` dazu die Zahl
der betroffenen Seiten. Gemeldet wird er nur, wenn **kein** früherer Lauf mit
Note denselben Hash trägt.

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

⭐ **Und die Stufe `genannt` der Ergebnisreihe sucht die Marke WÖRTLICH**, und zwar in den
**namensfreien** Fragen. Seit 2026-09-19 in zwei Stufen, weil ein Personenname anders zählt als ein
Produktname; seit 2026-10-12 mit zwei eigenen Feldern für Werktitel:

| Schlüssel | zählt |
|---|---|
| `marke_varianten` | **direkt** — jede Schreibweise, die die Marke meint |
| `personenname` | **nur mit einem Kontextmerkmal** im selben Block |
| `werktitel` | **direkt**, als ganze Phrase — eindeutige Titel eines Werks der Seite |
| `werktitel_mit_kontext` | als ganze Phrase und **nur mit dem `personenname`** nah im selben Block |

Der Grund für die zweite Stufe: Ein bloßer Name trifft zu oft jemand anderen.
Gezählt wird erst, wenn im selben **Block** ein Merkmal steht, das die Person
festlegt — nicht im selben Absatz, der ist zu weit. **Wer eine Marke einträgt,
trägt ihre Schreibweisen mit ein**; was nicht in der Liste steht, findet die
Messung nicht, auch wenn ein Mensch es sofort erkennt. Das Merkmal muss
höchstens 150 Zeichen vom Namen entfernt stehen; ein Name ohne Merkmal wird als
`unbestaetigt` mitgeschrieben und nicht gezählt. **Eine Schreibweise, die schon
in der Frage steht, zählt nicht** (seit 2026-10-11) — sie wäre ein Echo.

⛔ **In der Markenklasse entfällt `genannt` ganz, ohne Ausnahme** (Dirk, 2026-10-12, abends). Dort
steht der Name in der Frage. Weder die Domain noch eine weitere Schreibweise noch ein Werktitel
macht aus einer Markenantwort ein `genannt ja`, und ein Fehlen macht kein `nein`. Die Ausgabe heißt
**„entfällt (Name stand in der Frage)"**. Was die Antwort belegt, steht in den drei Zuordnungen
`urheber_zugeordnet`, `werk_zugeordnet` und `domain_zugeordnet` (Abschnitt „Faktor 5: eigene
Ergebnisreihe"). **Eine Markenzeile ohne Anteil bei `genannt` ist also kein Ausfall.**

Für Werktitel gilt seit dem 2026-10-12:

- `werktitel` sind eindeutig: volle Titel und Haupttitel, die nichts anderes bezeichnen. Sie zählen
  als ganze Phrase direkt.
- `werktitel_mit_kontext` sind Titel, die auch etwas anderes heißen können („Awakening", „Gemeinsam
  den Weg gehen"). Sie zählen nur, wenn der `personenname` im selben Block höchstens 150 Zeichen
  entfernt steht. **Der Beruf allein genügt nicht:** „Selbstsabotage überwinden" neben
  „Psychotherapeut" kann das gleichnamige Buch eines anderen sein.
- Beide zählen nur in **namensfreien** Fragen für `genannt`. In der Markenklasse stehen sie als
  `werk_zugeordnet`.
- ⛔ **Werktitel gehören nicht in `marke_varianten`.** Dort würden sie auch dort als Schreibweise der
  Marke gelesen, wo sie keine sind. Für deinen eigenen Eintrag: Marken-Schreibweisen nach
  `marke_varianten`, Titel von Büchern, Kursen oder Spielen in eines der beiden Titelfelder; ein
  Titel der zweiten Stufe braucht einen `personenname` an derselben Seite.
- Erster Einsatz: `dirkwernerbooks.com` und `books.werner-productions.com` tragen 38 Titel in
  `werktitel` und 20 in `werktitel_mit_kontext` (31 Werke, volle Titel und Haupttitel). Einstufung
  und Nachzählung: `docs/2026-09-19_Werktitel-zur-Bestaetigung.md` im Repo `websonde`.

Drei Verschärfungen vom 2026-10-12 (vormittags), alle an gespeicherten Antworten nachgezählt:

- **Ein Kontextmerkmal zählt nur als ganzes Wort oder ganze Phrase.** „Autor" trifft nicht
  „Autorennfahrer", „Buch" nicht „Lehrbuch". Folge: Gebeugte Formen stehen nicht mehr von selbst
  mit drin (`Psychologe` findet `Psychologen` nicht) und werden eigens eingetragen.
- **Bei der Markenfrage zählt der Personenname nicht als `genannt`.** Die Marke steht in der
  Frage; ein Urheber im Text belegt die Marke nicht. Was der Name dort aussagt, steht in der
  eigenen Angabe `urheber_zugeordnet` (Abschnitt „Faktor 5: eigene Ergebnisreihe").
- **Die eigene Domain zählt nur als ganzer Host**, `www.` eingeschlossen. Vorher war sie eine
  Teilzeichenkette: Die Buchseite auf einer Unterdomain zählte bei der Dachseite mit.

⛔ **Vor jedem neuen Eintrag in `marke_varianten`, `personenname`, `kontextmerkmale` oder einem
der Titelfelder die gespeicherten Antworten durchsuchen.** Zwei Fälle vom 2026-10-12: „ClearArrows" stand 19-mal in den
Antworten, jedes Mal als Kennung einer fremden, gleichnamigen App, und blieb draußen. Die Kurzform
„Markdownly" blieb draußen, weil es ein fremdes Werkzeug `markdownly.js` gibt. Eine Variante, die
plausibel aussieht, kann einen Fremden zählen.

**8. Ein „0 von 5" in der Ergebnisreihe sagt nichts, solange die Frage ungeprüft ist.**
Die Stufe `genannt` einer namensfreien Klasse misst immer *zwei* Dinge zugleich:
wie sichtbar die Seite ist **und** ob die Frage die richtige Nachbarschaft
aufruft. Eine schiefe `branche` erzeugt verlässlich 0 von 5 und sieht aus wie ein
Sichtbarkeitsbefund. **Bevor du eine Null deutest, lies die Antwort (`wortlaut`
im Datensatz) und sieh nach, wer darin steht.** Stehen dort deine Wettbewerber,
ist die Null echt; stehen dort Analysten oder Plattformen, misst du die Frage.
Dasselbe gilt für den Nenner: Gezählt werden nur Antworten mit `gesucht=ja` —
„0 von 2" ist eine andere Aussage als „0 von 5". Und eine Null kann am **Weg**
liegen statt an der Seite: Im Vollauf vom 2026-10-11 fand Perplexity `sundamind.com`
bei der Markenfrage in 5 von 5 Antworten, Poe mit GPT zitierte die Domain in 0 von 5.

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

**11. Ein Sichtbarkeitslauf kostet Geld — erst die Schätzung, dann Dirks Ok.**
(Dirk, 2026-10-11.) Eine Sitzung in einem anderen Repo startet einen
kostenpflichtigen Sichtbarkeitslauf **nur** in dieser Folge:

1. `sonde sichtbarkeit --nur-kosten`, mit denselben Angaben (`--url`, `--weg`)
   wie der geplante Lauf. Kein API-Aufruf, keine Kosten.
2. Die Schätzung **Dirk vorlegen**: Anfragen und Summe je Weg, das
   Erhebungsdatum der Preise und jeden Hinweis, den der Schätzmodus ausgibt.
3. **Auf sein Ok warten.**
4. Erst danach `--kosten-bestaetigt` setzen.

Der Schalter ist die Unterschrift unter eine Zahl, die ein Mensch gesehen hat,
kein Mittel, die Rückfrage zu überspringen. Ohne Bestätigung bricht der Lauf
ohne Kosten ab (Exit 2). Überschreiten die tatsächlichen Kosten die Schätzung um
mehr als 25 %, bricht er ab und meldet den Stand. In einen Workflow, eine
geplante Aufgabe oder den Nachtlauf gehört das Kommando nicht.

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

## Kopfsignale: hreflang, Twitter Card, og:locale (seit 2026-10-07)

Auftrag Dirk, 2026-10-07: hreflang und Twitter Card „generell in WebSonde einbauen", und
„Note verbessert sich proportional zu den anderen Markern". Zwei Wege, ein Leser
(`src/websonde/kopfsignale.py`):

| Weg | Was | Wirkung |
|---|---|---|
| **Note** (`probes.SondenErgebnis.kopfsignale`, Faktor `struktur`) | die **geprüfte Seite** (URL aus `sites.yml`) und ihre `hreflang`-Gegenseiten, höchstens sechs | dritter, **gleichgewichtiger** Bestandteil: `mittel(Schema, Meta, Kopfsignale)` statt `mittel(Schema, Meta)`; der JavaScript-Abzug bleibt danach |
| **Zusatzmessung** (`sonde kopfsignale`) | **alle HTML-Seiten der Sitemap** je eigenem Host (Rolle `eigen`, Seiten im Bau eingeschlossen, Referenzseiten nicht), höchstens 150 je Host | keine Note, kein Hash, kein Export, nicht im Nachtlauf |

**Signale** (je Host oder je Seite, vier Ausgänge: `vorhanden`, `fehlt`, `nicht_geprueft`,
`nicht_zutreffend`): `hreflang_vorhanden`, `hreflang_selbstverweis`, `hreflang_x_default`,
`hreflang_gegenverweis`, `hreflang_code_gueltig`, `hreflang_passt_zu_lang`, `twitter_card`,
`twitter_titel`, `twitter_beschreibung`, `twitter_bild`, `og_locale`.

**Regeln, die das Messgerät haben muss** (jede aus einem Fehler oder einer Gegenprobe vom 2026-10-07):

- **Beide Schreibweisen lesen:** `<meta name="twitter:card">` und `<meta property="twitter:card">`.
  Die Startseiten von `dirkwernerbooks.com` schreiben `property=`; ein Leser nur für `name=` meldete
  dort „fehlt", und die erste Messung des Tages tat genau das. Das war ein Messfehler, keine Lücke.
- **Open Graph ist die zweite gültige Form** für Twitter-Titel, -Beschreibung und -Bild. `twitter:card`
  wird in der eigenen Form verlangt; steht dort nur Open Graph, meldet der Befund „fehlt" und nennt dazu,
  dass die Ersetzung durch die Plattform **nicht gemessen** ist.
- **Ein einsprachiger Host hat keinen `hreflang`-Mangel:** keine Seite mit `hreflang` und nur eine
  `<html lang>`-Sprache ergibt `nicht_zutreffend`, nicht „fehlt".
- **Ein gescheiterter Abruf ist nie „fehlt":** nicht lesbare Seiten zählen als `nicht_lesbar`, nicht
  als Lücke; ohne messbaren Anteil entfällt der Bestandteil und der Faktor mittelt über Schema und Meta.
- **Rückverweis nur über einen Sprach-Eintrag:** ein `x-default`, das auf die Seite zeigt, ist kein
  Gegenverweis (ein Test fing diesen Fehler im Messgerät vor dem ersten echten Lauf).

**Der Anteil in der Note:** `vorhanden` an (`vorhanden` + `fehlt`) über die geprüfte Seite und ihre
Gegenseiten; `nicht_zutreffend` und `nicht_geprueft` werden herausgerechnet, nicht geschätzt. Die
Begründung des Faktors nennt die fehlenden Signale mit Namen. **Marker:** der Schlüssel `kopfsignale`
in `belege` des Faktors `struktur` (Regelstand `kopfsignale`, fünfter Wechsel, `store.REGELSTAENDE`).

- ⚠️ **Der Regelwechsel bricht die Kurve.** Jeder Lauf nach der Regel trägt einen anderen
  `config_hash`; die Delta-Anzeige meldet gegen frühere Läufe „nicht vergleichbar". Ein Sprung am
  Tag des ersten Laufs ist der Maßstabswechsel, kein Befund über die Seite.
- **Gegen den ersten Nachtlauf gehalten (2026-10-08, ausgewertet 2026-10-10):** Der Durchschnitt der neun
  eigenen Hauptseiten stieg von 7,38 auf 7,49, also um **+0,11**; erwartet waren +0,07 (Spanne +0,03 bis
  +0,12). Sieben von zwölf Seiten steigen (+0,10 bis +0,30), zwei sinken durch eigene Lücken (beide
  Fassungen von `sundamind.com`, je −0,10), drei bleiben. Bei keiner Seite hat sich zwischen den beiden
  Läufen ein anderer Faktor bewegt. Die Einzelwerte fallen gröber aus als gerechnet: `struktur` steht im
  Datensatz in halben Schritten, die Gesamtnote mit einer Nachkommastelle; Unterschiede unter 0,1 sind an
  einer einzelnen Seite nicht messbar. Beleg:
  `docs/2026-10-10_1548-CEST_Auswertung-Regelwechsel-kopfsignale-erster-Nachtlauf-N1-N2.md`.
- **Kontrolle am 2026-10-07 mit zwei Läufen** (`audit` nach `kontrolle/`): `dirkwernerbooks.com`
  Gesamt 8,2 auf 8,3, Struktur 9,0 auf 9,5; `sundamind.com` mit 54 % Kopfsignalen. Beide tragen
  den Marker und einen neuen Hash.

**Messung vom 2026-10-07** (`sonde kopfsignale`, neun Hosts, 99 Signale: 55 vorhanden, 26 fehlt,
18 nicht zutreffend). Beobachtung vom Tag, keine Regel:

| Host | gelesen | Befund |
|---|---|---|
| dirkwernerbooks.com | 118 Seiten | `hreflang_*` 118 von 118, 116 Gegenverweise ohne Ausfall; `twitter_bild` fehlt auf 8 Seiten |
| werner-productions.com | 7 Seiten | alles vorhanden außer `og_locale` (7 von 7 fehlen) |
| insightvue.app | 11 Seiten | `hreflang` zeigt auf jeder Unterseite auf `/` (kein Selbstverweis auf 10 von 11); nur mit der WebSonde-Kennung sichtbar, ein `curl` mit anderer Kennung erhielt keine Links |
| books.werner-productions.com | 34 Seiten | `x-default` fehlt auf 31 von 31, `twitter:card` fehlt auf 33 von 34 |
| sundamind.com | 12 Seiten | `twitter:*`, `og:*` und `og:locale` fehlen auf 11 von 12 |
| markdownly-anything.com | 26 Seiten | 5 ohne `hreflang`, 3 ohne Selbstverweis, `og:locale` fehlt auf 10 |
| psyprofiler.com, shadow-integrator.com, clear-arrows.com | 32, 5, 1 Seiten | einsprachig, `hreflang` nicht zutreffend; `og:locale` fehlt auf 28 von 32 und 5 von 5 |

- **Aufruf:** `.\sonde.ps1 kopfsignale [--site <Host>] [--ablage <Ordner>] [--seiten-max <n>]`; nie
  `sonde.exe` direkt (nur `sonde.ps1` liest `~\.secrets\cf-access.env`). Rückgabe: 0 nichts fehlt, 1 etwas fehlt,
  2 nicht vollständig geprüft. Ablage nur nach `kontrolle/` oder in einen eigenen Ordner, nie nach `runs/`.
- **Offen:** Meta-Tags liest `geo audit` (Upstream, Kategorie `meta`: Titel 5, Description 2, Canonical 3,
  Open Graph 4 von 14 Punkten); Twitter Card, `hreflang` und `og:locale` kommen erst hier dazu. Keine der
  gemessenen Lücken wurde an den Seiten geändert; sichtbare Änderungen brauchen Dirks Freigabe.
- **Belege:** `src/websonde/kopfsignale.py`, `probes.py`, `factors.py`, `store.py`, `cli.py`; Commit `ecb0e34`;
  Vorhersagen `docs/2026-10-07_Vorhersage-sonde-kopfsignale.md` und
  `docs/2026-10-07_Vorhersage-Regelwechsel-kopfsignale-in-der-note.md`; Vermerk und Auswertung
  `docs/2026-10-07_0850-CEST_Vermerk-Regelwechsel-kopfsignale-und-Auswertung-der-Vorhersagen.md`.

---

## Differenzprobe: deklariert gegen beobachtet (seit 2026-10-10)

Auftrag Dirk, 2026-10-10. Die Note liest robots.txt, also was eine Seite **erklärt**. Ob der Server
einem Crawler dasselbe ausliefert wie einem Browser, steht in keiner Datei: Eine Zone kann GPTBot in
robots.txt einladen und ihn am Rand abweisen. Die Differenzprobe misst das, in drei Angaben je Crawler,
die **nie zu einer verrechnet** werden:

| Angabe | Woher | Werte |
|---|---|---|
| `deklariert` | robots.txt, über denselben Leser wie die Note | `erlaubt`, `gesperrt`, `teilweise`, `nicht_pruefbar` |
| `beobachtet` | synthetische Probe: Startseite und `/llms.txt`, je einmal mit Browser-Kopf, je Crawler-Token, noch einmal mit Browser-Kopf | `gleich`, `abweichend`, `nicht_pruefbar` |
| `identitaet` | bei der synthetischen Probe **immer** `unbestimmt` | `unbestimmt` |

Mit `--identitaet` kommt **Stufe 3** dazu, nur für eigene Zonen, aus Zugriffsdaten statt aus einem
eigenen Abruf:

| Angabe | Woher | Werte |
|---|---|---|
| `identitaet` (Stufe 3) | Cloudflare-Analytics oder Firebase-Logs des eigenen Hosts, Fenster sieben Tage | `bestaetigt`, `unbestaetigt`, `kein_zugriff`, `nicht_pruefbar` |
| `zugang` | nur bei `bestaetigt` | `bedient`, `abgewiesen`, jeweils mit „n von m" |

Crawler der Probe: GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot. `evidence` ist `synthetic` für die
Probe und `observed_crawler` für Stufe 3.

**Was die synthetische Probe ist und was nicht.** Ihr Kopf trägt das Token des Crawlers **und** die
Kennung `WebSonde-Differenzprobe`; sie gibt sich nicht als der echte Crawler aus und kommt vom Messort.
Eine Abweichung weist auf Bot-Abwehr hin, die auf den Kopf reagiert. Sie belegt nicht, dass der echte
Crawler abgewiesen wird. Umgekehrt belegt `gleich` nicht, dass er durchkommt, wenn eine Regel an der
Adresse hängt. Deshalb steht die Probe weder in der Note noch im K.-o. noch im `config_hash`.

**Regeln, die das Messgerät haben muss** (jede aus einem Fehler oder einer Gegenprobe vom 2026-10-10):

- **Beide gesperrt ist `nicht_pruefbar`, nie `gleich`.** Offen ist ein Browser-Abruf nur mit Status 200
  ohne Abwehr-Kopf; ein 202 ist bei Bot-Abwehr die Wartestellung einer Challenge.
- **Die Kontrolle liegt nach den Bot-Abrufen.** Unterscheiden sich schon die zwei Browser-Abrufe im Hash,
  trägt der Hash kein Urteil; dann zählen Status, Endadresse, Content-Type und grob die Größe (eine
  Bot-Antwort unter der Hälfte der kleineren Browser-Antwort gilt als abweichend; die Hälfte ist eine
  Setzung). Enden die zwei Browser-Abrufe selbst verschieden, ist das Ziel `nicht_pruefbar`.
- **Eine Abweichung zählt erst, wenn sie sich wiederholt.** Ein einzelner 502 oder ein Ratenlimit mitten
  in der Folge ist kein Befund.
- **Ein grünes Ergebnis zählt nur wegen der Positivkontrolle.** Am 2026-10-10 an fremden Seiten gegengeprüft:
  Die Probe meldet Sperren mit 403 und 451 als `abweichend` und eine Seite, die schon den Browser-Kopf
  sperrt, als `nicht_pruefbar`.
- **Stufe 3 kennt zwei Belege, weil eine Form allein zu wenig meldet:** die Kategorie verifizierter Bots an
  der Cloudflare-Edge **oder** die Absender-Adresse in den Bereichen, die der Betreiber selbst veröffentlicht.
  PerplexityBot trägt bei Cloudflare keine Kategorie; ClaudeBot hat in den Firebase-Logs kein Prüfverfahren
  und ist dort `nicht_pruefbar`. Die Adresse dient nur dem Abgleich und steht in keinem Datensatz.
- **Ein 401 und ein 404 sind keine Abweisung.** Ein Anmelde-Endpunkt antwortet jedem mit 401.
  Als Abweisung zählen 403, 429, 451 und Sperr- oder Challenge-Aktionen der Edge.
- **Eine leere Quelle ist nicht „kein Zugriff".** Die eigene Probe des laufenden Kommandos ist die
  Positivkontrolle je Host: Nennt die Quelle nicht einmal sie, trägt sie keine Daten, und der Host ist
  `nicht_pruefbar`. Die Abrufe der eigenen Probe werden gezählt und gehen in kein Urteil ein.
- **`kein_zugriff` sagt nichts über eine Sperre.** Der Crawler kam im Fenster nicht.

**Messung vom 2026-10-10** (neun eigene Hosts, Messort NL). Beobachtung vom Tag, keine Regel:

- Synthetische Probe: 36 von 36 Crawler-Zeilen `erlaubt` und `gleich`, in drei Läufen. Auf drei Hosts
  (dirkwernerbooks.com, werner-productions.com, books.werner-productions.com) wechselt der Hash der Startseite
  schon zwischen zwei Browser-Abrufen; dort ruht das Urteil auf Status, Endadresse und Content-Type.
- Stufe 3, sieben Tage: 31 von 36 `bestaetigt` und `bedient`, **kein verifizierter Abruf abgewiesen**;
  ClaudeBot dreimal `nicht_pruefbar` (Firebase-Hosts), einmal `kein_zugriff`, einmal `unbestaetigt`.
- Nebenbefund: Auf allen neun Hosts gibt es Abrufe unter Crawler-Namen ohne Beleg. Ein Teil sucht nach
  Geheimnisdateien (`/.env`, Schlüsseldateien). Wo solche Abrufe eine 200 bekamen, war es die Startseite
  einer Anwendung, die jeden Pfad mit 200 beantwortet, oder eine für den Browser bestimmte
  Konfigurationsdatei. Ein Crawler-Name im Log ist deshalb kein Beleg für den Crawler.

- **Aufruf:** `.\sonde.ps1 differenzprobe [--site <Host>] [--ablage <Ordner>] [--identitaet] [--fenster-tage <n>]`;
  nie `sonde.exe` direkt. Ohne `--identitaet` braucht das Kommando keinen Token. Mit dem Schalter braucht es
  `CLOUDFLARE_ANALYTICS_TOKEN` (aus `~\.secrets\cf-access.env`, `sonde.ps1` liest ihn) und für Firebase-Hosts
  ein angemeldetes `gcloud`. Rückgabe: 0 alles gleich und kein verifizierter Abruf abgewiesen, 1 mindestens
  eine wiederholte Abweichung oder ein abgewiesener verifizierter Abruf, 2 der Vergleich oder eine Quelle
  war nicht prüfbar. Ablage nur nach `kontrolle/` oder in einen eigenen Ordner, nie nach `runs/`.
- **Nur eigene Hosts** (Rolle `eigen` in `sites.yml`). Eine fremde Seite bekommt keinen Abruf mit Bot-Token.
- **Grenzen:** Ein Bot-Abruf, der in ein Zeitlimit läuft, ist `nicht_pruefbar`, nicht `abweichend`. Ein 403
  auf einem Pfad, der jedem so antwortet, gälte in Stufe 3 als Abweisung; die Abfrage führt keinen Pfad mit.
  Die Zählwerte aus Cloudflare sind hochgerechnete Stichproben.
- **Evidenz:** zwei Einträge in `evidenz.yml`, beide Empfehlung `none` und **an keine Maßnahme gebunden**
  (`checks: []`): `robots-erlaubnis-ohne-zugang` (CrawlIndex, Stufe C) und
  `ki-crawler-abrufe-gegen-vermittelte-sitzungen` (Karbon, eine Domain, Stufe D). Ein Eintrag mit `none` darf
  nie an der Kennung einer K.-o.-Maßnahme hängen: er stufte sie im Bericht zu „keine Empfehlung" herab.
- **Belege:** `src/websonde/probes.py` (`pruefe_crawlerzugang`), `crawler.py` (Stufe 3), `klartext.py`, `cli.py`;
  Commits `a6fd5b3`, `a00f2ee`, `6670711`; Vorhersagen und Auswertungen
  `docs/2026-10-10_1155-CEST_Vorhersage-Differenzprobe-deklariert-gegen-beobachtet.md`,
  `docs/2026-10-10_1210-CEST_Auswertung-Differenzprobe-deklariert-gegen-beobachtet.md`,
  `docs/2026-10-10_1317-CEST_Vorhersage-Differenzprobe-Stufe-3-Identitaet-bestaetigt.md`,
  `docs/2026-10-10_1336-CEST_Auswertung-Differenzprobe-Stufe-3-Identitaet-bestaetigt.md`.

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
- **Kontrolllauf vom 2026-10-07, Seite unverändert, Profil 2 (Kennung `b497f17c7f00`):** Ein
  zweiter Lauf eine Stunde nach dem ersten zeigt die Streuung. La Gomera blieb bei allen drei
  Fragen in 0 von 5. Die Hub-llms.txt stand bei F3 in 0 statt 3 von 5 Läufen unter den
  gefundenen Seiten, bei F1 und F2 weiter in 5 von 5. Die verschiedenen Marker bei F2 stiegen
  von 5 auf 11, ohne dass sich die Seite änderte. Die Mediane der Länge lagen bei 859, 1474 und
  2088 Zeichen (erster Lauf 821, 1295, 2111), die Kosten bei 0,0693 USD. Zwei der acht
  Vorhersagezeilen wurden verfehlt (Hub-llms.txt bei F3, Marker bei F2). **Folge für jede
  spätere Wiederholung:** „llms.txt gefunden" bei F3 und die Markerzahl bei F2 gelten erst als
  Wirkung, wenn sie die Spannen 0 bis 3 beziehungsweise 5 bis 11 verlassen; zwei Läufe schätzen
  die Streuung, sie sind keine Verteilung.
- **Stand der Wiederholung:** „La Gomera" steht am 2026-10-07 in keiner llms-Datei der Hub-Seite
  und von dirkwernerbooks.com (0 Treffer); die Wiederholung wartet auf diesen Eintrag.
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
  `docs/2026-10-07_Vorhersage-sonde-absorption-profil2.md` und
  `docs/2026-10-07_Vorhersage-sonde-absorption-kontrolllauf.md` (Vorhersage `2e7d1fe`,
  Auswertung `78c369a`); Datensätze vom 2026-10-07 im
  lokalen Ordner `absorption/` (nicht im Repo).

---

## Faktor 5: eigene Ergebnisreihe `sonde sichtbarkeit` (seit 2026-10-11)

Auftrag Dirk, 2026-10-11. „Werden Sie in KI-Antworten tatsächlich genannt?" war bis dahin Faktor 5 der
Note und in jedem Nachtlauf „nicht gemessen". Jetzt ist es eine eigene Ergebnisreihe: **nicht in der
Note, nicht in ihrem `config_hash`, nicht im Nachtlauf**, mit eigenem Hash und eigener Ablage.

**Drei Wege, keiner entfällt, nie zu einer Zahl verrechnet:**

| Weg | Umfang | Modelle | Zugang |
|---|---|---|---|
| Poe (direkte API, kein MCP-Proxy) | `GPT-5.4` **voll**, `Claude-Sonnet-4.6` nur **Stichprobe** | zwei Modelle | `POE_API_KEY` |
| Perplexity Agent API | voll | `perplexity/sonar` | `PERPLEXITY_API_KEY` |
| DataForSEO | **Stichprobe**, zwei Seiten | `gpt-5.4-2026-03-05`, `claude-sonnet-4-6`, `gemini-3.1-pro-preview` | `DATAFORSEO_KEY_FILE` |

Die Stichprobe (`dirkwernerbooks.com`, `sundamind.com`) steht in `sichtbarkeit.yml` und im Hash. Sie
dient der Kreuzprüfung der Wege und wird nie automatisch erweitert.

⛔ **Poe ist seit Vorschrift Version 2 klein** (Dirk, 2026-10-11). Drei Poe-Modelle im vollen Umfang
kosteten je Vollauf 19,37 $, so viel wie ein Monatsabo. Geblieben ist `GPT-5.4` im vollen Umfang
(das billigste, sucht belegbar, liefert Quellen); `Claude-Sonnet-4.6` läuft nur noch auf den zwei
Stichprobenseiten als Gegenstück zu DataForSEO; `Gemini-3.1-Pro` entfällt bei Poe, weil dort jede
Antwort `gesucht=unbestimmt` war und keine in die Hauptverteilung zählte. Ein Modell kann in der
Vorschrift den Umfang seines Wegs überschreiben (`umfang: stichprobe` am Modell); der wirksame
Umfang steht im Hash. **Wer ein Poe-Modell zurückholt oder hebt, ändert Kosten und Hash** — das ist
eine Entscheidung Dirks, kein Handgriff.

**Vier Frageklassen, Wortlaut von Dirk und exakt so in der Vorschrift und im Hash:**

| Klasse | Wortlaut | braucht in `sites.yml` |
|---|---|---|
| Anbieter | „Wer sind die wichtigsten Anbieter im Bereich {branche}?" | `branche` |
| Empfehlung | „Ich suche {branche} für {einsatzzweck}. Was würdest du mir empfehlen und warum?" | `branche`, `einsatzzweck` |
| Orientierung | „Worauf sollte man bei {branche} achten?" | `branche` |
| Marke | „Was ist {marke} und für wen ist es gedacht?" | `marke` |

Jede Frage läuft **fünfmal** je Weg und Modell. Fehlt einer Seite ein Feld, ist die Klasse dort
`nicht_geprueft`; es gibt keine generische Ersatzfassung. Seiten ohne `branche`
(`dirkwernerbooks.com`, `werner-productions.com`) laufen nur die Markenfrage und stehen im Ergebnis als
„nur Marke, Kategorie nicht geprüft". Sprachfassungen (`fassung_von`) laufen nicht.

**Feld je Frageklasse (seit 2026-10-12).** `branche` speist alle drei namensfreien Klassen zugleich.
Ruft eine Klasse die richtige Nachbarschaft auf und eine andere nicht, übersteuert ein eigenes Feld
`branche` für genau diese Klasse:

| Schlüssel in `sites.yml` | gilt für |
|---|---|
| `branche_anbieter` | nur die Anbieterfrage |
| `branche_empfehlung` | nur die Empfehlungsfrage |
| `branche_orientierung` | nur die Orientierungsfrage |

- Fehlt das Klassenfeld, gilt `branche` wie bisher. Ist `branche` leer, läuft nur die Klasse mit Feld.
- Ein Schlüssel ohne passende Klasse ist ein Fehler (Exit 2), kein stilles Nichts.
- Die Hinweiszeile des Schätzmodus nennt die Klasse, die über ein Klassenfeld läuft; der Datensatz
  trägt je Frage `branche_aus`.
- Im Hash der Ergebnisreihe steht das Feld nur bei Seiten, die eins tragen. Nicht im `config_hash`
  der Note.
- Erster Einsatz: `clear-arrows.com` trägt nur `branche_empfehlung` (ein einzelnes Spiel hat keinen
  Anbietermarkt). **Auch hier gilt Regel 8: erst die Nachbarschaftsprobe, dann der Eintrag.**

**Drei Stufen je Antwort, je dreiwertig (`ja`, `nein`, `nicht_geprueft`):**

| Stufe | heißt | woher |
|---|---|---|
| `gefunden` | die eigene Domain steht in der Trefferliste der Suche | nur wo die Antwort die Treffer trägt (Perplexity) |
| `zitiert` | die eigene Domain steht in einer **strukturierten** Quelle | nur wo die Antwort Quellen als Feld trägt; **nie aus dem Antworttext gelesen** |
| `genannt` | eine Schreibweise der Marke, die Domain als ganzer Host oder ein Werktitel steht im Antworttext | in **namensfreien** Fragen; Regeln unter Regel 7. In der **Markenklasse** entfällt die Stufe ohne Ausnahme: Anzeige „entfällt (Name stand in der Frage)" |

Dazu das Pflichtfeld **`gesucht`** (`ja`, `nein`, `unbestimmt`). Die Hauptverteilung zählt nur Antworten
mit `gesucht=ja`; Antworten mit `unbestimmt` stehen getrennt daneben. Bei Poe mit Gemini war das der
Regelfall (Beleglauf: 5 von 5 `unbestimmt`), deshalb läuft das Modell dort nicht mehr.

**Drei Zuordnungen der Markenklasse (seit 2026-10-12).** Nur bei der Markenfrage, getrennt von den drei
Stufen, gezählt und **nie mit `genannt` verrechnet**. Im Laufbericht je eine eigene Zeile: „Urheber
zugeordnet", „Werk zugeordnet", „Domain zugeordnet". In namensfreien Fragen tragen die drei Felder
keinen Wert.

**`urheber_zugeordnet`** (vier Werte):

| Wert | heißt |
|---|---|
| `ja` | der `personenname` der Seite steht mit einem ihrer Kontextmerkmale im Text |
| `falsch` | beim Namen steht ein Namensvetter-Kontext, oder ein anderer Personenname steht in einer Urheberrolle |
| `nein` | kein Urheber genannt |
| `nicht_geprueft` | die Seite trägt keinen `personenname`, oder der Name steht ohne Merkmal da |

Das Muster für „anderer Name" kennt nur ausdrückliche Rollenwörter (entwickelt, gegründet, Gründer,
developed by …). Was es nicht kennt, bleibt `nein`, nie `falsch`. Der Namensvetter-Kontext steht im
Hash. `personenname` trägt eine Seite nur, wenn die ausgelieferte Seite die Person als Urheber führt.

**`werk_zugeordnet`** (drei Werte): Nennt die Antwort ein Werk der Seite?

| Wert | heißt |
|---|---|
| `ja` | ein `werktitel` steht als ganze Phrase da, oder ein `werktitel_mit_kontext` mit dem `personenname` nah im selben Block |
| `nein` | die Seite führt Werktitel, keiner steht in der Antwort |
| `nicht_geprueft` | die Seite führt keine Werktitel, oder ein Titel der zweiten Stufe steht ohne den Namen da |

**`domain_zugeordnet`** (drei Werte): Steht die Domain der Seite in der Antwort?

| Wert | heißt |
|---|---|
| `ja` | die Domain steht als ganzer Host da (`www.` eingeschlossen, eine Unterdomain zählt nicht) |
| `nein` | sie steht nicht da |
| `nicht_geprueft` | die Domain steht schon in der Frage |

**So liest du das Ergebnis.** Je Seite, Weg, Modell und Klasse eine Zeile:

```
poe / GPT-5.4 / anbieter: gemessen 5 von 5 | gesucht ja 5, nein 0, unbestimmt 0
   mit Suche (5): gefunden nicht geprüft | zitiert 0 von 5 | genannt 0 von 5
poe / GPT-5.4 / marke: gemessen 5 von 5 | gesucht ja 5, nein 0, unbestimmt 0
   mit Suche (5): gefunden nicht geprüft | zitiert 4 von 5 | genannt entfällt (Name stand in der Frage)
   Urheber zugeordnet (eigene Angabe, nicht in `genannt`): ja 5, nein 0, falsch 0, nicht geprüft 0
   Werk zugeordnet (eigene Angabe, nicht in `genannt`): ja 0, nein 4, nicht geprüft 1
   Domain zugeordnet (eigene Angabe, nicht in `genannt`): ja 4, nein 1, nicht geprüft 0
```

(Zeilen aus der Neuauswertung vom 2026-10-12, abends: `shadow-integrator.com` und
`dirkwernerbooks.com`.)

Ausgegeben wird eine **Verteilung** („3 von 5"), nie ein Ja oder Nein und nie ein Mittel über Wege oder
Modelle. „nicht geprüft" bei `gefunden` oder `zitiert` heißt: Diese Stufe liefert dieser Weg nicht — es
ist keine Null. „entfällt (Name stand in der Frage)" bei `genannt` heißt: Markenklasse, die Stufe gibt
es dort nicht; lies die drei Zuordnungszeilen darunter. `evidence` ist `observed_search`.

**Übereinstimmung Poe gegen DataForSEO** (nur Stichprobe): je Frage und Modell `gleich`, `abweichend`
oder `nicht vergleichbar`, gemessen an der Stufe `genannt` unter den Antworten mit Suche. Das ist ein
**Befund über die Messwege, nicht über die Seite**. Zellen der Markenklasse stehen dort als `nicht
vergleichbar` („Poe 0 von 0, DataForSEO 0 von 0"), weil `genannt` in ihr entfällt. Weichen mehr als ein Drittel der vergleichbaren
Zellen ab, empfiehlt der Bericht, die Stichprobe zu erweitern; unter drei vergleichbaren Zellen meldet
er, dass die Zahl für eine Aussage nicht reicht.

**Vergleich gegen den letzten Lauf (seit 2026-10-12).** Der Laufbericht stellt jeden regulären Lauf
neben den jüngsten früheren Datensatz der Seite **unter gleichem Hash**: je Weg, Modell, Klasse und
Stufe die Verteilung mit Suche. Er zählt gleiche, verschiedene und nicht vergleichbare Zellen; jeder
Unterschied steht einzeln da, mit „innerhalb" oder „AUSSERHALB der Spanne einer unveränderten Seite".
Der Datensatz trägt dasselbe als `vergleich`.

- ⚠️ **Die Spanne ist gerechnet, nicht gemessen**, und so beschriftet: zwei Standardabweichungen des
  Unterschieds zweier Anteile bei fünf Wiederholungen. 0 gegen 2 von 5 liegt innerhalb, 0 gegen 3 von 5
  außerhalb. Eine gemessene Spanne gibt es erst nach mehreren Vollläufen unter gleichem Hash.
- Nie über Wege, Modelle oder Klassen hinweg. Die drei Zuordnungen der Markenklasse sind nicht Teil
  des Vergleichs.
- **Hat sich der Hash geändert, gibt es keinen Vergleich, sondern eine Bruchzeile:** „BRUCH DER
  ERGEBNISREIHE" je Seite, mit dem Hash des Vorlaufs und den geänderten Bestandteilen. Der Datensatz
  trägt das als `vorlauf`.

**Kommandos:**

```bash
# Schätzmodus: Anfragen mal Preis je Weg, ohne einen einzigen API-Aufruf
sonde sichtbarkeit --nur-kosten
sonde sichtbarkeit --url https://example.com/ --nur-kosten

# Lauf: zeigt zuerst dieselbe Schätzung und fragt dann nach
sonde sichtbarkeit --url https://example.com/
sonde sichtbarkeit --url https://example.com/ --weg perplexity   # nur ein Weg

# Beleg- und Kontrollläufe: eigene Ablage, nie runs/
sonde sichtbarkeit --url https://example.com/ --ablage kontrolle/<Datum>_<Anlass>
```

| Exit | Bedeutung |
|---|---|
| 0 | alles gemessen, Schätzmodus oder Neuauswertung |
| 2 | nicht gestartet (Konfiguration, Zugang, **Kosten nicht bestätigt**), abgebrochen oder nicht vollständig gemessen |

**Kosten** (Preise vom 2026-10-11, gemessen an zwei bis drei Proben je Modell, in
`sichtbarkeit-preise.yml`; nicht im Hash, weil ein Preis keine Messvorschrift ist):

| Lauf | Anfragen | Schätzung |
|---|---:|---:|
| Vollauf, 10 Seiten, 32 Fragen (Stand 2026-10-12) | 420 | 9,80 $ |
| davon Poe (GPT voll, Claude Stichprobe) | 185 | 5,59 $ |
| davon Perplexity | 160 | 0,74 $ |
| davon DataForSEO (Stichprobe) | 75 | 3,47 $ |
| Einzelseitenlauf `werner-productions.com` (eine Frage, nicht in der Stichprobe) | 10 | 0,15 $ |

- Der erste Vollauf vom 2026-10-11 war mit 440 Anfragen und 10,10 $ geschätzt. Seither läuft
  `clear-arrows.com` nur noch die Empfehlungs- und die Markenfrage; daher 420 und 9,80 $. **Die Zahl
  gilt zu ihrem Datum; maßgeblich ist immer die Ausgabe von `--nur-kosten`.**
- Ist die Preistabelle älter als 30 Tage, steht im Schätzmodus eine Warnung neben der Summe.
- Fehlt einer Seite `branche` oder `einsatzzweck`, nennt der Schätzmodus die Seite, das Feld und die
  Klassen, die dadurch nicht geprüft werden — **vor** der Kostenfreigabe.
- Im Laufkopf stehen geschätzte und tatsächliche Kosten nebeneinander. Über 125 % der Schätzung bricht
  der Lauf ab.
- ⚠️ **Poe-Kosten kommen verzögert.** Poe trägt einen Eintrag beim Start der Anfrage in den
  Punkteverlauf ein und füllt die Punkte erst danach; die Abbruchgrenze sieht sie etwa eine Anfrage je
  Modell später. Im Beleglauf meldete der Laufkopf deshalb 0,81 $ statt 1,26 $ (behoben, `d41e8ee`).

⛔ **Regel 11 gilt für jeden Lauf:** erst der Schätzmodus, dann Dirks Ok, dann `--kosten-bestaetigt`.

**Monatlicher Schätzlauf (seit 2026-10-12).** Die Aufgabe „WebSonde Sichtbarkeit Schaetzung
(monatlich)" läuft am 1. jedes Monats um 05:00 (`sichtbarkeit-schaetzlauf.ps1`). Sie führt nur
`sonde sichtbarkeit --nur-kosten` aus, schreibt `protokolle\letzter-sichtbarkeit-schaetzlauf.txt`
(Schätzung je Weg, Summe, „kein Lauf gestartet") und zeigt ein Meldungsfenster. **Sie startet nie
einen bezahlten Lauf**; ein Wächter hält fest, dass der Bestätigungsschalter in keiner ausgeführten
Zeile steht. Die Aufgabe läuft interaktiv, also nur bei angemeldetem Benutzer, und holt einen
verpassten Start nach; ob das Nachholen greift, ist nicht gemessen.

**Aus einem anderen Repo:** Das Kommando liest `sites.yml`, `sichtbarkeit.yml` und
`sichtbarkeit-preise.yml` aus dem Arbeitsordner und kennt kein `--vorschrift-von`. Eine URL, die nicht
in `sites.yml` steht, wird abgelehnt (ohne Marke und Branche gibt es keine Frage). **Ein fremdes Repo
misst die Sichtbarkeit deshalb nicht selbst**; der Lauf findet im Arbeitsordner von `websonde` statt.

**Der erste Vollauf** (2026-10-11, 21:44 bis 22:39 CEST, Vorschrift Version 2, 10 Seiten, 34 Fragen,
**440 von 440 Anfragen gemessen**, geschätzt 10,10 $, tatsächlich **9,90 $**). Das ist der Ausgangsstand
der Reihe:

- **Namensfreie Klassen, eigene Seiten:** In 4 von 215 Antworten mit Suche wird eine eigene Seite
  genannt, alle bei `shadow-integrator.com` über Perplexity (Anbieter 1 von 5, Empfehlung 3 von 5).
  Jede andere Zeile der sieben Seiten mit `branche` steht auf 0.
- **Die Referenz** `developers.cloudflare.com`: Empfehlungsfrage 5 von 5 über Poe-GPT und über
  Perplexity, Anbieterfrage 1 von 5 und 0 von 5.
- **GPT sucht bei der Orientierungsfrage nie** (40 von 40 Antworten ohne Suche). In dieser Klasse kann
  eine Seite bei GPT nicht gefunden werden; die Zeilen stehen getrennt von der Hauptverteilung.
- **Die Nachbarschaft stimmt bei fünf Seiten** (die Antworten nennen die erwartbaren Wettbewerber).
  Bei `books.werner-productions.com` liest sich die Empfehlungsfrage als Autor, der einen Verlag sucht;
  dort misst die Null die Frage. Bei `clear-arrows.com` ruft die Anbieterfrage Spieleportale auf.
- **Markenfrage:** Perplexity findet die eigene Domain bei sieben von neun Seiten in 5 von 5
  Antworten (`insightvue.app` und `books.werner-productions.com`: 2 von 5). Poe-GPT zitiert sie bei
  `sundamind.com` und `clear-arrows.com` in 0 von 5: SundaMind wird über `dirkwernerbooks.com`
  beschrieben, „Clear Arrows" für ein gleichnamiges Handy-Spiel gehalten, „Werner Productions" mehrfach
  für eine Filmfirma (eigene Domain zitiert in 2 von 5).
- **Übereinstimmung der Wege** (Stichprobe, 10 Zellen): 6 gleich, 0 abweichend, 4 nicht vergleichbar.

⛔ **Zwei Berichtigungen, an diesem Lauf gefunden** (Regelstand `stufen-dreiwertig-echo-ungeprueft`):

- **Bei der Markenfrage war `genannt` ohne Beleg außerhalb des Echos kein `nein` mehr** (überholt:
  seit dem 2026-10-12 abends entfällt die Stufe in der Markenklasse ganz).
  In 92 Antworten stand der Markenname im Text, und die Stufe lautete trotzdem `nein`, auch bei der
  Referenz. Gezählt hatte nur, wer zusätzlich die Domain ausschrieb; gemessen wurde also die
  Zitierweise des Modells. **Ein „0 von 5" bei der Markenfrage aus einem Datensatz vor dieser
  Berichtigung ist kein Befund.**
- **`suche_belegbar` am Modell:** Wo ein Weg jede Suche als Eintrag zeigt (Poe mit GPT: 120 von 120
  Antworten mit Sucheintrag tragen Quellen, 50 von 50 ohne ihn keine), ist ein fehlender Eintrag
  `gesucht nein` statt `unbestimmt`.

⛔ **Drei weitere Brüche am 2026-10-12, vormittags** (Regelstand danach
`stufen-dreiwertig-urheber-hostgrenze`):
Schreibweisen und Personenname für alle Seiten mit Ganzwort-Merkmal, dann die Berichtigung „Personenname
ist bei der Markenfrage kein `genannt`" samt `urheber_zugeordnet`, dann die Hostgrenze. **Die Zeilen
des ersten Vollaufs oben stehen nach dem Regelstand vom 2026-10-11** und sind mit einem Lauf ab dem
2026-10-12 nicht vergleichbar. Nachgezählt an den gespeicherten Antworten, ohne neue Anfrage: Die
namensfreien Klassen blieben überall unverändert, die Hostgrenze änderte keine einzige Wertung (0
Abweichungen in 440 Antworten). Bei `dirkwernerbooks.com` verloren 10 Markenantworten ihr `genannt ja`
(25 → 15 von 30), weil sie nur über den Personennamen gezählt hatten.

Acht Seiten wurden dafür neu ausgewertet, `books.werner-productions.com` und `clear-arrows.com`
nachgemessen (60 Anfragen, geschätzt 0,90 $, tatsächlich 0,83 $), weil sich dort die Fragen geändert
hatten.

⛔ **Zwei weitere Brüche am 2026-10-12, abends** (Regelstand jetzt
`stufen-dreiwertig-urheber-hostgrenze-werktitel-markenklasse`): erst die zwei Felder für Werktitel
samt `werk_zugeordnet`, dann „Markenklasse ohne Ausnahme" samt `domain_zugeordnet`. Bei den beiden
Buchseiten stehen zusätzlich `werktitel` und `werktitel_mit_kontext` in den Bestandteilen des Hashes.
Nachgezählt an den gespeicherten Antworten, ohne neue Anfrage:

- `genannt` in **namensfreien** Fragen ist an keiner Stelle verändert, `urheber_zugeordnet` auch nicht.
- In der Markenklasse standen vorher 39 `genannt ja` (`dirkwernerbooks.com` 15, `insightvue.app` 5,
  `markdownly-anything.com` 5, `psyprofiler.com` 5, `shadow-integrator.com` 3, `sundamind.com` 3,
  `werner-productions.com` 2, `books.werner-productions.com` 1). Sie sind entfallen. 38 davon kamen
  von der Domain und stehen jetzt als `domain_zugeordnet ja`; eines (`shadow-integrator.com`) kam von
  einer weiteren Schreibweise der Marke und steht in keiner Zuordnung mehr.
- `werk_zugeordnet`: `dirkwernerbooks.com` ja 13, nein 16, nicht geprüft 1;
  `books.werner-productions.com` nein 10.

**Alle zehn Seiten liegen seit dem Abend des 2026-10-12 unter dem heutigen Regelstand** (neu
ausgewertet, kein Abruf). Ein Lauf davor ist mit einem Lauf danach nicht vergleichbar.

> ⛔ **EINGEFROREN bis nach dem Sichtbarkeits-Vollauf am 01.11.2026** (Dirk, 2026-10-12): Der
> Regelstand `stufen-dreiwertig-urheber-hostgrenze-werktitel-markenklasse` bleibt, wie er ist.
> **Keine Änderungen an Zählregeln, Varianten, Klassen oder Hash-Bestandteilen** – also auch kein
> neuer Eintrag in `marke_varianten`, `personenname`, `kontextmerkmale`, `werktitel`,
> `werktitel_mit_kontext`, `branche` oder einem Klassenfeld, und keine Änderung an
> `sichtbarkeit.yml`. Sonst hätte der Vollauf keinen Vorlauf unter gleichem Hash.
> **Neue Regelideen werden nur gesammelt:** in `OFFEN.md` im Repo `websonde`, unter der Überschrift
> „nach dem Vollauf 01.11.". Aus einem anderen Repo heraus: dort eintragen lassen, nichts umbauen.

`sonde sichtbarkeit --neu-auswerten` bewertet die jüngsten Datensätze der Ablage nach dem heutigen
Regelstand neu: dieselben Antworten, **kein API-Aufruf, keine Kosten**, ein neuer Datensatz neben dem
alten (Feld `neu_ausgewertet`). **Seiten, deren Fragen sich seither geändert haben, übergeht es** und
nennt sie; sie brauchen einen neuen Lauf. So ist der Ausgangsstand oben entstanden. Alle Zeilen und die Belege:
`docs/2026-10-11_2246-CEST_Auswertung-Sichtbarkeit-erster-Vollauf-Verteilungen-Kosten-zwei-Regelberichtigungen.md`.

**Der Beleglauf davor** (2026-10-11, Vorschrift Version 1 mit drei Poe-Modellen, `dirkwernerbooks.com`,
nur Markenfrage, 35 von 35 Anfragen gemessen, geschätzt 1,29 $, tatsächlich 1,26 $; mit dem Vollauf
nicht vergleichbar, anderer Hash). ⚠️ Die Spalte `genannt` dieses Laufs steht hier nicht mehr: In
der Markenklasse entfällt die Stufe (Name stand in der Frage); die damaligen Werte entstanden nach
einer Regel, die es nicht mehr gibt.

| Weg | Modell | gesucht | zitiert | gefunden |
|---|---|---|---|---|
| Poe | GPT-5.4 | 5 ja | 5 von 5 | nicht geprüft |
| Poe | Claude-Sonnet-4.6 | 5 ja | nicht geprüft | nicht geprüft |
| Poe | Gemini-3.1-Pro | 5 unbestimmt | getrennt: 5 von 5 | nicht geprüft |
| Perplexity | perplexity/sonar | 5 ja | nicht geprüft | 5 von 5 |
| DataForSEO | gpt-5.4-2026-03-05 | 5 ja | 4 von 5 | nicht geprüft |
| DataForSEO | claude-sonnet-4-6 | 5 ja | **0 von 5** | nicht geprüft |
| DataForSEO | gemini-3.1-pro-preview | 5 ja | 5 von 5 | nicht geprüft |

**Was das belegt und was nicht.** Der Adapter läuft über alle drei Wege. Eine Markenfrage misst die
Bekanntheit des Namens, nicht die Auffindbarkeit im Thema: Ihre Werte stellt man nicht neben
die 0,0 % der alten Kategoriefragen. Die namensfreien Klassen misst erst der Vollauf oben. Die Abweichung bei Claude (`zitiert` 0 von 5 über DataForSEO) ist ein Befund über den Weg: Über
DataForSEO stellte das Modell je Antwort eine Suchanfrage und zitierte nur Händler.

- Vorschrift `sichtbarkeit.yml`, Preise `sichtbarkeit-preise.yml`, Modul `src/websonde/sichtbarkeit.py`.
- Herleitung: `docs/2026-10-11_1910-CEST_Preflight-Faktor-5-drei-Wege-Text-Suche-Quellen-Preis.md`,
  `docs/2026-10-11_1911-CEST_Vorhersage-Faktor-5-Ergebnisreihe-Kosten-Uebereinstimmung-Profilbruch.md`,
  `docs/2026-10-11_2021-CEST_Auswertung-Faktor-5-Beleglauf-Vorhersage-gegen-Ergebnis.md`.
- Ablage: lokaler Ordner `sichtbarkeit/` (nicht im Repo); der Beleglauf liegt unter `kontrolle/`.

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
  ist die Datei im Repo (9 Einträge am 2026-10-10).

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

## Nach dem Deploy: IndexNow (Dirk, 2026-10-12)

> **Sämtliche Hauptapps müssen mit dem neuesten Stand auf IndexNow sein.**

Das ist keine Messung der WebSonde, aber eine Regel für jedes Repo, das eine Hauptseite ausliefert.

- **Gemeldet wird, was ausgeliefert ist, nicht was gepusht ist.** Die Meldung läuft nach dem Deploy.
  Wo ein Push nicht deployt, gehört sie ans Ende des Deploy-Vorgangs, nicht an den Push.
- **Einheitliche Wertung** (in `clear-arrows` und `InsightVUE-Webapp` umgesetzt, Datei
  `scripts/lib/indexnow-wertung.mjs` mit Test): grün, wenn mindestens `api.indexnow.org` oder Bing
  angenommen hat; rot nur, wenn keine der beiden annimmt. Yandex bleibt in der Liste.
- **Je gescheiterter Stelle eine sichtbare Zeile** `WARNUNG: <Stelle> nicht erreicht`, in GitHub Actions
  zusätzlich als Annotation. In den übrigen sieben Repos mit eigenem Meldeweg steht seit dem
  2026-10-12 nur diese Warnung; ihre jeweilige Regel, wann der Lauf rot endet, ist unverändert.
- **Ein Schritt `success` belegt nicht, dass eine Stelle angenommen hat.** Er belegt, dass das Skript
  nicht rot endete. Im Protokoll nachlesen, welche Stelle mit welchem Status geantwortet hat.
- ⚠️ `yandex.com/indexnow` nahm am 2026-10-12 nichts an, weder von Dirks Rechner noch aus GitHub
  Actions. Ursache nicht belegt. Eine Warnung zu Yandex ist deshalb zunächst kein Befund über dein Repo.
- **Proben eines Meldeskripts laufen gegen eine lokale Attrappe**, nicht gegen die echten Stellen.

**Sonderfall `insightvue.app` (Firebase Hosting, Deploy von Hand).** Dort gilt seit dem 2026-10-12 nur
noch dieser Weg; er steht ausführlich in der `CLAUDE.md` des Repos und in `REPOS.md`:

1. `.firebaserc` und `firebase.json` lesen; Target-Name und Site-ID getrennt feststellen.
2. Den Build in einen Vorschaukanal der eigenen Site legen (`firebase hosting:channel:deploy`).
3. Im Kanal prüfen: die Schnittstelle antwortet, die Dateien sind byte-gleich mit dem Build, die
   Ausgabe trägt keine Warnung „Unable to find a valid endpoint".
4. Erst dann innerhalb **derselben Site-ID** auf live klonen (`firebase hosting:clone`), live noch
   einmal prüfen, zuletzt IndexNow.

Der Grund: Ein direkter Hosting-Deploy gab am 2026-10-12 eine Version frei, deren Weiterleitung zur
Schnittstelle nicht aufgelöst war. Die Schnittstelle antwortete rund 90 Sekunden mit 404, bei Exit 0
und „Deploy complete". ⛔ **Container ≠ App:** Die Firebase-Projekt-ID ist ein Container mit mehreren
Apps und Sites; Projekt-ID und Site-ID nie verwechseln, nie projektweit deployen. Zwei Fallen dabei:
Vorschauadressen tragen von Firebase aus `X-Robots-Tag: noindex` (kein Befund), und
`firebase hosting:clone` endete mehrfach mit Exit 2 nach der Meldung „has been cloned". Entscheidend
sind das Release und die Live-Prüfung, nicht der Exit-Code.

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
