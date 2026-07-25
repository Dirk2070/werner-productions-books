# 2026-07-25, 23:26 CEST — SundaMind Status quo: PROD-Flip, Stripe-Founder-Kette und Cross-Linking auf drei Webseiten

> **Verifizierte Uhrzeit:** 2026-07-25, **23:26 CEST** (= 21:26 UTC; Zeitzone `W. Europe Standard Time`, Sommerzeit aktiv, UTC+2 — per `Get-TimeZone` geprüft, nicht geschätzt).
> **Berichtszeitraum:** 2026-07-24 (frühe Stunden) und 2026-07-25 (voller Tag).
> **Autor:** Claude Code (Opus 5) im Auftrag von Dipl.-Psych. Dirk Werner.

---

## 1. Stand in einem Satz

**SundaMind ist seit heute live auf `https://sundamind.com`** — der Flip ist vollzogen, die Seite ist indexierbar, `www` leitet 301 auf den Apex, `dev.sundamind.com` läuft unberührt weiter mit `noindex`. Custom-SMTP stellt zu, Passwort-Reset ist gebaut und ausgerollt, die Stripe-Kette ist von der Signaturprüfung bis zum Founder-Button vollständig gebaut und live — **aber noch nie durchlaufen.** Parallel wurde SundaMind auf allen drei Werner-Webseiten aufgenommen.

---

## 2. Was am 2026-07-24 passierte (00:19–00:44 CEST)

Kurze Nachtsitzung, ausschließlich Status-Korrekturen am SMTP-Bild:

| Commit | Inhalt |
|---|---|
| `addfe6c` | Status-Quo 2026-07-24 + Kommentar zum `dailyAward`-Tages-Key |
| `5191826` | SMTP-Stand korrigiert: kein harter Blocker via Resend-verified, **Fremdadress-Test unbelegt** |
| `4f26926` | Präzisiert: Custom-SMTP ist in PROD **bereits AKTIVIERT, aber ungetestet** — Zustellungs-Beweis vor dem Flip nötig |

**Der Kern dieser Nacht:** Die Unterscheidung zwischen „konfiguriert" und „zugestellt" wurde scharf gezogen. Genau diese Unterscheidung hat am 25.07. den Flip getragen.

---

## 3. Was am 2026-07-25 passierte

### 3.1 SMTP gelöst — der letzte harte Flip-Blocker fiel (15:58 CEST)

- **Anker erfüllt:** Resend-Status **`Delivered`** (Sent 15:57 → Delivered 15:58), Resend-Log `POST /emails` **200**, Magic Link an `werner.productions.media@gmail.com`, kein `535` mehr.
- **Ursache: Konto-Mismatch.** Im Supabase-Passwortfeld stand ein alter/fremder Key. Eingetragen wurde `sundamind-smtp` aus dem Resend-Konto `dirkwerner733@googlemail.com` (dort ist `sundamind.com` verifiziert).
- **Das SMTP-User-Feld war bereits korrekt (`resend`)** — gelesen **vor** dem Tausch, damit nur eine Unbekannte in Bewegung blieb.
- **Zweitprobe:** zugestellte Mail zeigt `From: SundaMind <noreply@sundamind.com>` — korrekter Absender **und** Anzeigename.

**⛔ Offener Restpunkt mit Nachwirkung:** Der Resend-Key wurde im Chat genannt und ist **nicht rotiert** (Entscheidung: „Kanal schließen statt rotieren"). `~/.claude/history.jsonl` ist seither `git rm --cached` + in `.gitignore`; es lief auf `github.com/Dirk2070/claude-memories`, war aber in keinem Commit — **nichts wurde gepusht.** Der Wert bleibt gültig ⇒ bei künftigem Auth-Verdacht erster Kandidat.

### 3.2 Prod-Datenbereinigung

`mood_logs id 36` in `pctzxercgotlccigszsh` (PROD) gelöscht — Browser-Agent-Artefakt. `mood_logs` 18 → 17.

### 3.3 Der Flip (17:14–17:18 CEST, `3669bfd`)

- CI-Run `30163213757`: `test` success · `deploy-prod` success · `deploy` **skipped**.
- **Alle Anker am einen Boot:** Cold-Start **2,720 s** (echter Kaltstart) · `Last-Modified 15:17:17Z` im Bau-Fenster · **kein `X-Robots-Tag`** ⇒ Apex kanonisch ⇒ indexierbar · 33× „SundaMind" im Body (kein leeres Messgerät).
- **Die Prüfung, die schiefgehen konnte, ging nicht schief:** `dev.sundamind.com` antwortet weiter `200` mit `X-Robots-Tag: noindex` — der Prod-Deploy hat dem Dev-Worker die Custom-Domain **nicht entrissen**.
- `www.sundamind.com/faq` → **301** auf den Apex, pfaderhaltend. Apex `/llms.txt` → **200** (war vorher 404).
- Danach: Supabase Site-URL + Redirect-Allowlist auf den Apex nachgezogen, `workers.dev` raus.

### 3.4 Auth-Lücken geschlossen

| Commit | Inhalt |
|---|---|
| `760f9e1` + `688b579` | **Passwort-Reset** — `/forgot-password` (fordert an) **und** `/reset-password` (das `redirectTo`-Ziel, setzt das Passwort). Ohne die zweite Route landet der Klick aus der Mail im Nichts. Copy bewusst im **Konjunktiv**, weil Supabase aus Enumeration-Schutz auch ohne Konto Erfolg meldet. Suite 500 → 508 grün. |
| `26871a5` + `346e49a` | **Registrierungs-Fix** — die Meldung „Bestätigungs-E-Mail versendet" behauptet keine Mail mehr, die (bei bekannter Adresse) gar nicht verschickt wird. |

### 3.5 Stripe — die ganze Kette gebaut

| Commit | Inhalt |
|---|---|
| `dc2b639` | **Webhook-Naht**: Raw-Body-Route **vor** `express.json()`, Signaturprüfung, Idempotenz über PK auf `event.id` in `stripe_events`, fail-closed **503** statt 200 |
| `b0979a3` | `STRIPE_WEBHOOK_SECRET` durch `envVars` in den Container gereicht — ein reines Worker-Secret erreicht den Container **nicht** |
| `b93a1f0` + `d4f7b21` | **Founder-Erfüllung** (`server/stripeFulfillment.ts`: `onEvent` → `grantFounderBySupabaseId` → `isFounder`) + Welcome-Seite |
| `0465219` + `2301c75` | **Founder-Button** in den Einstellungen, mit `client_reference_id` = `supabaseId` |

**Stripe-Dashboard-Objekte** (Live-Mode, Account Werner Productions): Produkt, Preis (24 € einmalig, §19 UStG, kein Anchor-Price), Payment-Link `https://buy.stripe.com/cNi3cu3bQ5LO1rh41V87K05`, Webhook-Endpoint `we_1Tx83jD6J5HZ8mOme4TnU1QE` → `https://sundamind.com/api/stripe/webhook`.

**Verifikation heute Abend (~23:16 CEST) — beide Belege gemessen, nicht angenommen:**
- **Rollout:** Bundle-Hash wechselte `index-NFhgYhXp.js` → **`index-CWRDecw3.js`**, `Last-Modified 19:53:39Z` im Bau-Fenster, `client_reference_id` **1 Treffer** im Bundle (vorher 0), Payment-Link im Bundle.
- **Signaturprüfung:** POST mit gefälschter Signatur → **`HTTP 400`**, Body **`Webhook Error: timestamp outside tolerance window`**. Diese Meldung stammt aus `stripe.webhooks.constructEvent` und wird **nur erreicht, wenn das Secret nicht leer ist** — der 503-Pfad hätte davor abgebogen. ⇒ Die Kette Worker-Secret → `envVars` → Container → Express → Signaturprüfung ist belegt.

### 3.6 SundaMind auf drei Webseiten aufgenommen (18:12–22:58 CEST)

| Site | Commit | Inhalt | Deploy-Weg |
|---|---|---|---|
| `books.werner-productions.com` | `7ab63df`, `9678ec4` | Claim-Verstoß raus, `category: LifestyleApplication` explizit, `url` gesetzt; **Icon auf die aktuelle Fassung getauscht** (trug byte-genau die April-Version ohne Gesicht) | Push auf `master` → Pages |
| `werner-productions.com` | `f7f253d` | ProjectCard im Apps-Raster (DE/EN), `identity.yaml`: `sundamind: null # TODO` aufgelöst, Produktliste ergänzt, **Regelverstoß „therapeutisches Journaling (Sundamind)" behoben**, FAQ + JSON-LD nachgezogen, `sundamind.com` in `Person.sameAs` | ⛔ **Direct Upload** — `npm run deploy` |
| `dirkwernerbooks.com` | `5cb456fb` | **183 Buchseiten + 6 Top-Level** in Header-Nav und Footer, App-Karte + Icon auf `/apps` und `/apps-en`, alle Zählwörter „vier"→„fünf", eigener `SoftwareApplication`-JSON-LD-Knoten | Merge nach `main` → CI + IndexNow |

**Live belegt:** Buchseite trägt nav-link **und** Footer-Link · `/apps` zeigt die Karte · Icon liefert `image/png`, 58.385 B (**nicht** der SPA-Catch-all — `content_type` mitgelesen) · Hub zeigt 3× `sundamind.com`, 0× „therapeutisches Journaling" · IndexNow 3/3 (Yandex 202, Bing 200, api.indexnow.org 200).

---

## 4. Alle Ordnerpfade, in denen gearbeitet wurde

### 4.1 Repositories (lokal)

| Pfad | Repo | Branch | Rolle |
|---|---|---|---|
| `C:\Users\psych\OneDrive\SundaMind` | `Dirk2070/SundaMind` | `main` | **Die App.** Vite + React 19 + tRPC + Drizzle, Cloudflare Containers |
| `C:\Users\psych\werner-productions-books` | `Dirk2070/werner-productions-books` | `master` | **Aktueller Klon** für books.werner-productions.com (Astro) |
| `C:\Users\psych\OneDrive\Werner Productions` | `Dirk2070/werner-productions` | `main` | Hub werner-productions.com (Astro, **Direct Upload**) |
| `C:\Users\psych\OneDrive\dirkwernerbooks1` | `Dirk2070/dirkwernerbooks1` | `geo/faq-all-apps` ⚠️ | Autorenwebseite (statisches HTML, 183 Buchseiten) |
| `C:\Users\psych\dwb-sm` | — | `feat/sundamind-crosslinks` | **Temporärer Worktree**, nach dem Push wieder entfernt |

**⚠️ Zu `dirkwernerbooks1`:** Dirks Arbeitsbaum steht auf dem **alten** Branch `geo/faq-all-apps` mit 12 nicht-operativen Änderungen und einer ungetrackten Secret-Datei (`env.SerpAPI-Key.env.txt`, in `.gitignore` auf `main`). Er wurde **nicht angefasst** — die Arbeit lief in einem separaten Worktree auf `origin/main`.

**⚠️ Zwei Klone von `werner-productions-books`:** `C:\Users\psych\OneDrive\Werner Productions Books` steht auf dem **06.06., 7 Commits zurück**, mit uncommitteten Änderungen an `AppsSection.astro`, `llms.txt.ts`, `CrossLinkingFooter.astro`, `faqs.yaml`. **Geprüft: inhaltlich überholt** (älterer Anlauf der InsightVUE-Korrektur „sechs→fünf Analysen"; `origin/master` trägt sie längst als `tagline: "5 KI-Analysen aus einem Bild"`). Nichts geht verloren — aber der Ordner sieht nach Arbeit aus, die keine ist.

### 4.2 Asset-Quellen

| Pfad | Inhalt |
|---|---|
| `C:\Users\psych\OneDrive\SundaMind\client\public\` | **Lebende** App-Icons: `icon-1024.png`, `icon-512.png`, `icon-192.png`, `apple-touch-icon.png`, `favicon.ico`, `logo-lockup.png` |
| `C:\Users\psych\OneDrive\SundaMind\Logo u. Twitter-Cards\` | Marken-Assets, OG-Cards. ⛔ `SundaMind-Logo-Marke-8Knoten.png` trägt die Bildunterschrift „weich · 8 Knoten" **eingebrannt** — Vergleichsblatt, kein auslieferbares Icon |
| `C:\Users\psych\OneDrive\SundaMind\SundaMind-App\` | ⛔ **Ungetrackte Kopie**, veraltete Icons (April). Nicht damit arbeiten |

### 4.3 Speicher und Dokumentation

| Pfad | Inhalt |
|---|---|
| `C:\Users\psych\.claude\projects\C--Users-psych-OneDrive-SundaMind\memory\` | Auto-Memory SundaMind: `MEMORY.md` (Index) + 25 Themendateien |
| `C:\Users\psych\.claude\projects\C--Users-psych-OneDrive-Werner-Productions\memory\` | ⭐ `project_book-sites-topology.md` — **kanonische Zuordnung Domain→Repo→Ordner** |
| `C:\Users\psych\.claude\projects\C--Users-psych-OneDrive-Hermes-Agent-Asset-YAMLs\memory\` | `reference_cloudflare_domain.md` |
| `C:\Users\psych\OneDrive\DirkVault\00 - Inbox\` | Vault-Inbox |
| `C:\Users\psych\OneDrive\DirkVault\10 - 00 Projekte\15 - SundaMind\` | Vault-Projektordner SundaMind |
| `C:\Users\psych\OneDrive\DirkVault\10 - 00 Projekte\03 - dirkwernerbooks.com\` | ⛔ Ordnername lügt: Inhalt handelt von **books.werner-productions.com** |
| `C:\Agents\amh-vault\docs\` | AMH-Doku-Spiegel |
| `C:\Users\psych\OneDrive\SundaMind\docs\` | Status-Quo-Dateien im App-Repo |
| `C:\Users\psych\OneDrive\dirkwernerbooks1\docs\` | 114 Status-/Analyse-Dateien der Autorenwebseite |
| `C:\Users\psych\werner-productions-books\docs\` | Doku des Books-Repos |

### 4.4 Neu angelegte Scripts

- `C:\Users\psych\OneDrive\dirkwernerbooks1\scripts\add-sundamind-links.cjs` — Header/Footer site-weit, idempotent
- `C:\Users\psych\OneDrive\dirkwernerbooks1\scripts\add-sundamind-apps-page.cjs` — `/apps`-Karte, Zählwörter, JSON-LD, idempotent

---

## 5. ToDos

### 5.1 Blockierend für den Verkauf

- [ ] **Selbstkauf + Refund durchführen.** Die einzige Prüfung, die die Kette wirklich belegt: feuert `onEvent`, greift `grantFounderBySupabaseId`, steht `isFounder` in der DB, schalten die Einstellungen um, trägt die Welcome-Seite ihren Zwischenzustand? **Alles ist gebaut, getestet und live — aber nie durchlaufen.** Der `client_reference_id`-Pfad ist die einzige Brücke zwischen Stripe-Kunde und App-Nutzer; bricht sie, zahlt jemand und bleibt Nicht-Founder.
- [ ] Davor kostenlos: **Incognito-Check des Payment-Links** (Produktbild, Beschreibung, Submit-Message, Brand-Color).
- [ ] **Stripe-Dashboard-Reste** (keine API-Endpunkte): Brand-Color `#2BA392` (nicht `#2DD4BF` — Kontrast mit weißer Schrift nur 1,86:1 statt 3,11:1), Statement Descriptor `WERNERPROD SUNDAMIND`, Unternehmensdaten, Sprache der Kunden-E-Mails.

### 5.2 Rechtlich

- [ ] **⛔ Art. 17 DSGVO ist offen, nicht „per Copy geschlossen".** Der einzige dokumentierte Löschweg ist eine Mail an `datenschutz@sundamind.com` — **`sundamind.com` hat KEINEN MX-Record** (heute gemessen). Die Adresse ist tot. Entscheidung steht: **In-App-Löschung mit Warnhinweis.** ⚠️ `auth.users` löschen ≠ App-Daten löschen; FK-CASCADE existiert nur auf `journal_sessions` und `experiment_recommendation_cache`.

### 5.3 Auth

- [ ] **Live-Durchlauf des Passwort-Resets** (gebaut und deployt, aber nicht end-to-end getestet).
- [ ] Google-Auth: Infrastruktur steht, **nur der Client-Code fehlt**.

### 5.4 Webseiten

- [ ] **Entscheidung Dirk:** `<title>` und `og:title` auf `/apps` und `/apps-en` zählen die Apps namentlich auf und führen **weiterhin vier**. Der Titel ist mit 86 Zeichen schon über der SERP-Grenze; SundaMind anzuhängen brächte ihn auf 97 und schnitte ihn genau dort ab. Bewusst nicht entschieden.
- [ ] **Einzelbuchkarten** auf `dirkwernerbooks.com` — von Dirk ausdrücklich auf „später" gesetzt.
- [ ] **EN-Fassung des kanonischen Satzes formal festschreiben.** ⚠️ Sie ist heute **faktisch entstanden**: auf `/apps-en` und auf dem Hub sind wortgleiche EN-Beschreibungen live gegangen. Sie ist damit nicht mehr offen, sondern **ungeschrieben festgelegt** — wer sie kanonisiert, übernimmt diesen Wortlaut oder ändert ihn an **beiden** Stellen.
- [ ] Optional: Klon `C:\Users\psych\OneDrive\Werner Productions Books` auf `origin/master` ziehen und die überholten Änderungen verwerfen (nur auf Dirks Wort).

### 5.5 Sicherheit

- [ ] **Resend-Key `re_YkTHnKBp…` ist nicht rotiert.** Entscheidung war „Kanal schließen statt rotieren". Der Wert bleibt gültig ⇒ bei künftigem Auth-Verdacht erster Kandidat.

### 5.6 Aus früheren Sitzungen offen

- [ ] Fürsorge-Hinweis: Kern gebaut (`7bb39eb`), **noch toter Code**. Der behaviorale Grenz-Test vom 23.07. zeigte: die Diagnose-Grenze hält in allen vier Übertretungs-Richtungen, **fällt aber bei der Unterschreitung** (kein Wort zu professioneller Unterstützung bei breitem Monats-Tief).
- [ ] Output-Prüfung der Diagnose-Grenze (die Instruktion existiert, die Prüfung nicht).
- [ ] Krisen-Safety: Sicherheitsplan + Reihenfolge der Ressourcen.
- [ ] CloudFront-Hintergrundbilder self-hosten.
- [ ] Step-Name in `.github/workflows/deploy.yml`: heißt weiter „Deploy PROD (…, OHNE Domain-Bindung)", **bindet seit dem Flip aber die Domain**. *(Teilweise adressiert in `517fce7` — verifizieren.)*

---

## 6. Fallen, die heute Zeit gekostet haben

1. **Ein selbstgebautes Prüf-Tor kann selbst ausfallen.** Ein Hintergrund-Poll auf `LIVE INSTANCES: 0` lief aus mit `INSTANCES=` — nicht „0", sondern **nie befüllt**. Ein Tor, das nie „offen" meldet, ist von „noch zu" nicht unterscheidbar. Aufgelöst, indem die Bedingung **überflüssig** wurde (Rollout unabhängig über den Bundle-Hash bewiesen), nicht erfüllt.
2. **Bei einer SPA ist HTTP 200 kein Existenzbeweis.** `/logo-lockup.png` kam mit 200 zurück und war `text/html`, 19.734 B — die Startseite. **`content_type` und Größe mitlesen.**
3. **Ein dokumentierter Notausgang muss einmal geöffnet worden sein.** „Container-Neustart im CF-Dashboard" stand zweimal als zuverlässiger Fallback in der Deploy-Doktrin — **den Button gibt es nicht.** Korrigiert.
4. **Der Anker eines Massen-Edits ist die eigentliche Entscheidung.** Der Markdownly-Link existierte in **fünf** Markup-Varianten; ein Ersetzen auf eine davon trifft 125 von 185 Stellen und meldet Erfolg. Zwei Seiten (`about.html`/`about-en.html`) hingen auf einem älteren Stand, dem der Anker ganz fehlte.
5. **Eine Einfügung erbt Kontext, den man nicht mitgelesen hat.** Layout-A wickelt Nav-Links in `<li>` — mein erster Anker hängte SundaMind *innerhalb* des fremden Listenpunkts ein. Und die Seiten sind **CRLF**; ein hartes `\n` erzeugte pro Einfügung ein einsames LF.
6. **Ein sichtbares Element hinzufügen macht jede Zählung daneben zur Lüge.** „vier"/„four" stand je Sprache an **zehn** Stellen — inklusive OG-Card, die die falsche Zahl in fremde Feeds trägt.
7. **Fünf Cloudflare-/GitHub-Projekte konkurrieren um den Namen „dirkwernerbooks", nur `dirkwernerbooks1` trägt die Domain.** Der Diskriminator ist die **Domain-Spalte** in `wrangler pages project list`, nicht der Projektname.

---

## 7. Deploy-Wege — je Ziel verschieden

| Ziel | Weg | Beweis |
|---|---|---|
| **SundaMind (CF Containers)** | `gh workflow run deploy.yml -f target=production` | `Last-Modified` im Bau-Fenster **+** Bundle-Hash bei Client-Änderungen. ⛔ **Poll-Verbot** — eigene Requests setzen `sleepAfter` zurück. Der Header `x-sundamind-deploy` lügt |
| `books.werner-productions.com` | Push auf `master` | Pages baut automatisch |
| `dirkwernerbooks.com` | Push/Merge auf `main` | GitHub Action: `node build.cjs` → `wrangler pages deploy ./dist` + IndexNow |
| `werner-productions.com` | ⛔ **`npm run deploy`** | **Kein Git-Provider** — ein Push allein deployt nichts und sieht dabei aus wie ein Deploy |

---

## 8. Verbindliche Regeln (unverändert in Kraft)

- **„Therapie/therapeutisch/klinisch/Patient" tauchen für diese App nie auf.** Der Prüfstein ist die **Satzart**: eine **Grenze** („keine Gesundheitsanwendung") bleibt, eine **Rollenzuweisung** im Behandlungskontext fällt. Dirks eigene Qualifikationen („approbierter Psychotherapeut") sind Markenpfeiler und bleiben. Buchtexte sind eine eigene Klasse.
- **`applicationCategory` ist `LifestyleApplication`**, nie `HealthApplication` — auch nicht implizit über einen Generator-Default.
- Jede `protectedProcedure` braucht `WHERE userId = ctx.user.id`.
- LLM-Aufrufe ausschließlich über `invokeLLM()` aus `server/_core/llm.ts`.
- **Niemals committen:** `.env`, alles mit `SERVICE_ROLE_KEY` oder `ANTHROPIC_API_KEY`.
- **`pnpm add` ist in SundaMind verboten** (bricht die drizzle-kit-Junction → bricht die Testsuite). Tests laufen mit `pnpm test`, nicht `npx vitest run`.
- Secrets **interaktiv** per `wrangler secret put` setzen, nie `echo … |` (Whitespace-Klasse, die die SMTP-535 gekostet hat).

---

*Erstellt 2026-07-25, 23:26 CEST. Abgelegt in Vault-Inbox, Vault-Projektordner `15 - SundaMind`, `C:\Agents\amh-vault\docs`, `SundaMind\docs`, `dirkwernerbooks1\docs` und `werner-productions-books\docs`.*
