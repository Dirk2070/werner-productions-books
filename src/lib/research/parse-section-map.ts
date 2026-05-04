import * as cheerio from "cheerio";

export const SECTION_BISAC: Record<string, string[]> = {
  "Dr. Seelmann Krimireihe": ["FIC031000", "FIC022040"],
  "Fantasy & Science Fiction": ["FIC009000", "FIC028000"],
  "Beziehung & Partnerschaft": ["SEL034000", "FAM029000"],
  "Psychologie & Selbsthilfe": ["SEL031000", "PSY045000"],
  "Kreativ & Malbücher": ["CRA037000", "SEL036000"],
};

export const SECTION_GENRE: Record<string, string[]> = {
  "Dr. Seelmann Krimireihe": ["Mystery", "Psychological Thriller", "Detective Fiction"],
  "Fantasy & Science Fiction": ["Fantasy", "Science Fiction", "Speculative Fiction"],
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

  $("h2").each((_, h2) => {
    const section = $(h2).text().trim();
    const bisac = SECTION_BISAC[section] || [];
    const genre = SECTION_GENRE[section] || [];

    let el = $(h2).next();
    while (el.length && !el.is("h2")) {
      const imgs = el.find("img[src*='-800.webp']");
      imgs.each((_, img) => {
        const src = $(img).attr("src") || "";
        const asinMatch = src.match(/\/(B0[A-Z0-9]{8})-800\.webp/);
        if (asinMatch) {
          mappings.push({ asin: asinMatch[1], section, bisac, genre });
        }
      });
      el = el.next();
    }
  });

  return mappings;
}
