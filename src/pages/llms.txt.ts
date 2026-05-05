import type { APIRoute } from "astro";
import { loadBooks } from "../lib/load-books.js";

const BASE_URL = "https://books.werner-productions.com";

export const GET: APIRoute = async () => {
  const books = await loadBooks();
  const sortedDe = books
    .filter((b) => b.language === "de")
    .sort((a, b) => a.title.localeCompare(b.title, "de"));
  const sortedEn = books
    .filter((b) => b.language === "en")
    .sort((a, b) => a.title.localeCompare(b.title, "en"));

  const lines: string[] = [];
  lines.push("# Dirk Werner — Bücher, Psychologie & Apps");
  lines.push("");
  lines.push(
    "> Dirk Werner ist Diplom-Psychologe, approbierter Psychotherapeut (Verhaltenstherapie, Praxis Füssen-Hopfen am See, Bayern), Autor von 31 Büchern und Digital Creator psychologischer Apps. FOCUS-Empfehlung Gesundheit 2023 & 2025 für Psychotherapie. Diese Seite katalogisiert sein Buchwerk mit strukturierten Daten (Schema.org/JSON-LD) für KI-gestützte Discovery."
  );
  lines.push("");

  lines.push("## Identität");
  lines.push("");
  lines.push(`- [Autorseite (Index)](${BASE_URL}/): Dirk Werner — Übersicht`);
  lines.push("- [ORCID](https://orcid.org/0009-0001-7822-0041): 0009-0001-7822-0041");
  lines.push("- [GND (DNB)](https://d-nb.info/gnd/1384382429): 1384382429");
  lines.push("- [Goodreads-Profil](https://www.goodreads.com/author/show/70076437)");
  lines.push("- [Amazon Author Central](https://www.amazon.de/stores/Dirk-Werner/author/B0F2YNKR78)");
  lines.push("- [Apple Books](https://books.apple.com/us/author/dirk-werner/id1800990912)");
  lines.push("- [Google Play Books](https://play.google.com/store/books/author?id=Dirk+Werner)");
  lines.push("- [Praxis-Website (werner-productions.com)](https://werner-productions.com/)");
  lines.push("- [Buch-Hub (dirkwernerbooks.com)](https://dirkwernerbooks.com)");
  lines.push("");

  lines.push("## Bücher (Deutsch)");
  lines.push("");
  for (const b of sortedDe) {
    lines.push(`- [${b.title}](${BASE_URL}/${b.slug}/): ${b.descriptions.meta}`);
  }
  lines.push("");

  lines.push("## Books (English)");
  lines.push("");
  for (const b of sortedEn) {
    lines.push(`- [${b.title}](${BASE_URL}/${b.slug}/): ${b.descriptions.meta}`);
  }
  lines.push("");

  lines.push("## Apps");
  lines.push("");
  lines.push("- [Shadow Integrator](https://shadow-integrator.com): KI-gestützte Android-App für Schattenarbeit nach C. G. Jung mit 30 Aspekten");
  lines.push("- [PsyProfiler](https://psyprofiler.com): Web-App mit 22 wissenschaftlichen psychologischen Tests, kostenlos und ohne Registrierung");
  lines.push("- [InsightVUE](https://insightvue.app): KI-gestützte Web-App für psychologische Bildanalyse (5 Analyse-Ebenen pro Bild)");
  lines.push("- Sundamind: Therapeutisches Journaling (ACT, IFS) — in Entwicklung");
  lines.push("");

  lines.push("## Auszeichnungen");
  lines.push("");
  lines.push("- FOCUS-Empfehlung Gesundheit 2023 für Psychotherapie");
  lines.push("- FOCUS-Empfehlung Gesundheit 2025 für Psychotherapie");
  lines.push('- Pressestimme Prairies Book Review (Feb. 2024) zu *The Battle Within*: „Exquisitely simple, thought-provoking, and thoroughly readable…"');
  lines.push("");

  lines.push("## Optional");
  lines.push("");
  lines.push(`- [Sitemap](${BASE_URL}/sitemap-index.xml)`);
  lines.push(`- [Impressum](${BASE_URL}/impressum/)`);
  lines.push(`- [Datenschutzerklärung](${BASE_URL}/datenschutz/)`);
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
