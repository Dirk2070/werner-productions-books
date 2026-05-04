import * as cheerio from "cheerio";

export const SECTION_BISAC: Record<string, string[]> = {
  "Dr. Seelmann Krimireihe": ["FIC031000", "FIC022040"],
  "Fantasy & Sci-Fi": ["FIC009000", "FIC028000"],
  "Beziehung & Partnerschaft": ["SEL034000", "FAM029000"],
  "Psychologie & Selbsthilfe": ["SEL031000", "PSY045000"],
  "Kreativ & Malbücher": ["CRA037000", "SEL036000"],
};

export const SECTION_GENRE: Record<string, string[]> = {
  "Dr. Seelmann Krimireihe": ["Mystery", "Psychological Thriller", "Detective Fiction"],
  "Fantasy & Sci-Fi": ["Fantasy", "Science Fiction", "Speculative Fiction"],
  "Beziehung & Partnerschaft": ["Self-Help", "Relationships", "Personal Growth"],
  "Psychologie & Selbsthilfe": ["Self-Help", "Psychology", "Personal Development"],
  "Kreativ & Malbücher": ["Self-Help", "Coloring Books", "Mindfulness"],
};

export interface SectionMapping {
  asin: string;
  section: string;
  bisac: string[];
  genre: string[];
}

export function parseSectionMap(html: string): SectionMapping[] {
  const $ = cheerio.load(html);
  const mappings: SectionMapping[] = [];

  // Real structure: <div class="mega-cat"><strong>Category</strong>
  //   <div>...<a href="/buecher/<ASIN>-de"><img src="/assets/covers/<ASIN>-400.webp"></a>...
  // Books are siblings (inside the same mega-cat div) after the <strong> label.
  $("div.mega-cat").each((_, div) => {
    const strongText = $(div).find("strong").first().text().trim();
    if (!strongText) return;

    // Decode HTML entities in section name (cheerio text() already does this)
    const section = strongText;
    const bisac = SECTION_BISAC[section] || [];
    const genre = SECTION_GENRE[section] || [];

    // Extract ASINs from <a href="/buecher/<ASIN>-..."> links within this div
    $(div).find("a[href]").each((_, a) => {
      const href = $(a).attr("href") || "";
      const asinMatch = href.match(/\/buecher\/(B0[A-Z0-9]{8})-/);
      if (asinMatch) {
        mappings.push({ asin: asinMatch[1], section, bisac, genre });
      }
    });
  });

  return mappings;
}
