# GEO-Entity-Welle — Status quo & ToDos

**Datum:** 2026-06-06
**Uhrzeit (verifiziert):** 19:13 CEST (UTC+2, DST aktiv)
**Scope:** Multi-Domain-GEO-/Entity-Konsolidierung über 4 Web-Properties von Dirk Werner

---

## Zusammenfassung
Die 3-Domain-Entity-Welle ist **abgeschlossen und an allen vier Properties live verifiziert** (per-node-Gegencheck am 2026-06-06). Ziel war: kanonische InsightVUE-Dimensionen überall, tote Wikidata-ID entfernen, Entity-Fakten (4 Apps + 13 Hörbücher) konsistent, MDA als zitierfähiger App-Eintrag.

## Erreicht (live)
- **Kanonische InsightVUE-Dimensionen** an allen 4 Properties identisch: **Psychologie · Beauty-Score (0–10) · Mythologie · Emotion · Farbpsychologie** („5 KI-Analysen aus einem Bild"). Alte Fehlbegriffe entfernt: „Symbolische Deutung", „Mythologische Bezüge", „Symbolik", „Narrativ", „6 Analysen".
- **Tote Wikidata-ID `Q137711448` (404)** überall aus dem Live-Output entfernt (sameAs, SoftwareApplication/Person-JSON-LD, llms.txt, FAQ-EN). Disambiguation/Identität laufen über lebende Normdaten **ORCID + GND**.
- **Entity „Wer ist Dirk Werner?"**: 4 Apps namentlich (PsyProfiler, Shadow Integrator, InsightVUE, Markdownly Anything) + **31 Bücher / 13 Hörbücher** — konsistente Fakten, je Domain eigenständig formuliert (kein Near-Duplicate-Risiko); JSON-LD ↔ sichtbar deckungsgleich.
- **Markdownly Anything (MDA)** als zitierfähiger Eintrag ergänzt (App-Sektion, FAQ, Footer, llms.txt) + Entwickler-Schema (`creator` Person, `sameAs` ORCID+GND).
- **MDA-„Lifetime"-Wording** auf werner-productions.com UWG-konform → „einmalig, kein Abo" / „one-time, no subscription".
- **werner-productions.com:** doppelter FAQPage-JSON-LD-Block dedupliziert (genau 1 FAQPage je Seite).

## Property-Status (live, 2026-06-06)
| Domain | Stack / Deploy | InsightVUE kanon. | Wikidata weg | Entity 4 Apps/13 HB |
|---|---|---|---|---|
| books.werner-productions.com (Hub) | Astro / Cloudflare Pages (Push `master`) | ✅ | ✅ | ✅ |
| dirkwernerbooks.com | statisches HTML / Cloudflare (Push `main`) | ✅ | ✅ | ✅ |
| insightvue.app | Vite+React / Firebase Hosting (manuell `deploy:hosting`) | ✅ (Root-Cause-Fix) | n/a | — |
| werner-productions.com | Astro / Cloudflare (`deploy.yml`/Wrangler, Push `main`) | ✅ | ✅ | ✅ |

## PRs / Deploys (alle gemergt + live, Stand 2026-06-06)
- **dirkwernerbooks**: PR #9 (MDA-Listing + Schema), PR #10 (FAQ alle 4 Apps + InsightVUE kanonisch) — Cloudflare + IndexNow ok.
- **insightvue.app**: PR #1 (Hero + Meta + JSON-LD kanonisch) — manuell deployt; IndexNow (Bing/Yandex/api.indexnow) 202/200/200.
- **Hub (werner-productions-books)**: PR #1 (FAQ-Konsolidierung + InsightVUE + Wikidata-Removal) + Footer/FAQ/llms-Lücken-Commit — live.
- **werner-productions**: PR #9 (InsightVUE/Wikidata/Entity), PR #10 (sichtbare „Wer ist?"-FAQ + MDA-UWG), PR #11 (FAQPage-Dedup) — Deploys #43–#45 + IndexNow-Step ok.

## Konventionen (etabliert, in Memory festgehalten)
- **Prod-Deploys** nur auf explizites Einzel-Go (sonst PR + Preview-Gate). Default-Deny; geerbter Firebase-Login spannt über alle Apps.
- **Firebase-Scope**: Projekt `shadow-integrator` = ein Auth-/Deploy-Scope, aber je App eigene Site-ID/Datenhaltung/Config (InsightVUE→Neon, Shadow/PsyProfiler→Firestore) → Deploys **strikt site-spezifisch** (`firebase deploy --only hosting:<site-id>`), nie projektweit.
- **Verifikation per-node** (Negativ-Check auf alte Formulierung), nie per Aggregat-Grep-Count — besonders bei dupliziertem Markup.

## ToDos (offen)
- [ ] **AI-Overview-Recheck** (Dirk, in einigen Tagen — Reindex-Lag): Query „Welche Apps hat Dirk Werner entwickelt?" → Erfolgssignal: alle vier Apps inkl. **Markdownly Anything**, InsightVUE mit den korrekten 5 Dimensionen.
- [ ] **Search Console**: URL-Prüfung / Reindex für die vier Domains anstoßen (beschleunigt gegenüber IndexNow).
- [ ] **Rich Results Test** (Google, Browser) für die neuen SoftwareApplication-/FAQPage-JSON-LD.
- [ ] Optional: wp `data/identity.yaml` (SSoT) um die 4 App-Namen + 13 Hörbücher anreichern (aktuell generisch; Live-Output ist bereits kanonisch).
- [ ] Optional: globalen `#author`-Knoten (Hub `index.astro`) auf weitere `sameAs`-Konsistenz prüfen (Wikidata war dort nie drin).

## Nicht wieder einbauen
- **Wikidata `Q137711448`** — gelöscht (404, Rapid-Marketing/Notability). Identität ausschließlich über ORCID `0009-0001-7822-0041` + GND `1384382429` (+ FOCUS-Profil).
