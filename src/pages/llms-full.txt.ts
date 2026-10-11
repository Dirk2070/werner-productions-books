import type { APIRoute } from "astro";
import { loadBooks } from "../lib/load-books.js";
import { GET as llmsTxt } from "./llms.txt.js";

const BASE_URL = "https://books.werner-productions.com";

// llms.txt (Katalog, Identitaet, FAQ) + je Buch der Text, den die Buchseite
// zeigt (`descriptions.marketing`, sonst `long` -- wie BookAbout.astro).
// Der Kopf kommt aus llms.txt.ts selbst, damit es keine zweite Fassung gibt.
export const GET: APIRoute = async (ctx) => {
  const head = await (await llmsTxt(ctx)).text();
  const books = (await loadBooks()).sort((a, b) =>
    a.slug.localeCompare(b.slug, "de"),
  );

  const lines: string[] = [head.trimEnd(), "", "## Volltexte der Bücher", ""];
  for (const b of books) {
    lines.push(`### ${b.title}`);
    lines.push("");
    lines.push(`URL: ${BASE_URL}/${b.slug}/ · Sprache: ${b.language}`);
    lines.push("");
    lines.push((b.descriptions.marketing ?? b.descriptions.long).trim());
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
