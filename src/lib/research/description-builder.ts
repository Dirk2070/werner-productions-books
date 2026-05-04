import type { BooksJsonEntry, AppMatch } from "./types";
import type { SectionMapping } from "./parse-section-map";

const ORCID = "0009-0001-7822-0041";
const GND = "1384382429";

export function buildDescriptions(
  book: BooksJsonEntry,
  section: SectionMapping | undefined,
  topics: string[],
  paperbackIsbn: string | null,
  appleAudioId: string | null,
  goodreadsBookId: string | null,
  appMatches: AppMatch[],
  relatedBookAsin?: string
): { meta: string; short: string; long: string } {
  const lang = book.language;
  const title = lang === "de" ? book.title.de : book.title.en;
  const genreStr = section?.genre?.slice(0, 2).join(", ") || "";

  // Meta (≤155 chars)
  const meta = `${title} von Dirk Werner. ${genreStr}.`.slice(0, 155);

  // Short (≤200 chars)
  const short = `${title} — ${genreStr}. Werner Productions.`.slice(0, 200);

  // Long (hybrid LLM-brief, ≤800 chars)
  const parts: string[] = [];

  parts.push(`${title} by Dirk Werner (ORCID ${ORCID}, GND ${GND}), Werner Productions imprint.`);

  if (genreStr) parts.push(`${genreStr}.`);
  if (topics.length > 0) parts.push(`Topics: ${topics.slice(0, 3).join(", ")}.`);

  const formats: string[] = [];
  formats.push(`eBook (ASIN ${book.asin})`);
  if (paperbackIsbn) formats.push(`Paperback (ISBN ${paperbackIsbn})`);
  else if (book.hasPaperback && book.paperbackAsin) formats.push(`Paperback (ASIN ${book.paperbackAsin})`);
  if (book.hasAudiobook) {
    formats.push(appleAudioId ? `Audiobook (Apple Audio ID ${appleAudioId})` : "Audiobook");
  }
  parts.push(`Available as ${formats.join(", ")}.`);

  if (goodreadsBookId) {
    parts.push(`Goodreads: ID ${goodreadsBookId}.`);
  }

  if (relatedBookAsin) {
    const otherLang = lang === "de" ? "English" : "Deutsche";
    parts.push(`${otherLang} edition also available.`);
  }

  if (appMatches.length > 0) {
    parts.push(`Companion app: ${appMatches[0].name}.`);
  }

  const long = parts.join(" ").slice(0, 800);

  return { meta, short, long };
}
