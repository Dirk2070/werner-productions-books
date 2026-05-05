import type { BooksJsonEntry, AppMatch, ParsedBookPage } from "./types";
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

// ---------------------------------------------------------------------------
// buildMarketing — käufer-orientierter Markdown-Klappentext
// ---------------------------------------------------------------------------

// HTML entity decoder (minimal, no DOM dependency)
function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

// Strip trailing marketing imperatives ("Lassen Sie sich...", "Holen Sie sich...", etc.)
function stripTrailingImperatives(text: string): string {
  const imperativePatterns = [
    /\n+(Lassen Sie sich[^.!?]*[.!?])\s*$/i,
    /\n+(Holen Sie sich[^.!?]*[.!?])\s*$/i,
    /\n+(Entdecken Sie[^.!?]*[.!?])\s*$/i,
    /\n+(Tauchen Sie ein[^.!?]*[.!?])\s*$/i,
    /\n+(Erleben Sie[^.!?]*[.!?])\s*$/i,
    /\n+(Jetzt[^.!?]*kaufen[^.!?]*[.!?])\s*$/i,
    /\n+(Get your copy[^.!?]*[.!?])\s*$/i,
    /\n+(Grab your[^.!?]*[.!?])\s*$/i,
    /\n+(Order now[^.!?]*[.!?])\s*$/i,
  ];
  let result = text;
  for (const pattern of imperativePatterns) {
    result = result.replace(pattern, "");
  }
  return result.trim();
}

// Detect genre from BISAC prefix
function isFiction(bisac: string[]): boolean {
  return bisac.some(b => b.startsWith("FIC"));
}

export function buildMarketing(
  parsed: ParsedBookPage,
  bookEntry: BooksJsonEntry,
  bisac: string[] = []
): string {
  let raw = parsed.marketingMarkdown?.trim() ?? "";

  // Fallback: if no "Über dieses Buch" section found, use bookEntry.description
  if (!raw || raw.length < 50) {
    const lang = bookEntry.language;
    const desc = lang === "de" ? bookEntry.description.de : bookEntry.description.en;
    raw = desc?.trim() ?? "";
  }

  if (!raw) return "";

  // Decode HTML entities
  raw = decodeHtmlEntities(raw);

  // Process the raw markdown into structured blocks
  const lines = raw.split(/\n/);
  const blocks: string[] = [];
  let currentBlock: string[] = [];

  const flushBlock = () => {
    const joined = currentBlock.join("\n").trim();
    if (joined) blocks.push(joined);
    currentBlock = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // Empty line = block separator
    if (!trimmed) {
      flushBlock();
      continue;
    }

    // Keep headings as-is (### become bold paragraphs in context)
    if (trimmed.startsWith("###")) {
      flushBlock();
      // Convert h3 to bold text for marketing context
      const headingText = trimmed.replace(/^###\s*/, "");
      currentBlock.push(`**${headingText}**`);
      flushBlock();
      continue;
    }

    // Bullet points stay as bullets
    if (trimmed.startsWith("- ")) {
      // If we were accumulating a non-bullet block, flush it
      if (currentBlock.length > 0 && !currentBlock[0]?.startsWith("- ")) {
        flushBlock();
      }
      currentBlock.push(trimmed);
      continue;
    }

    currentBlock.push(trimmed);
  }
  flushBlock();

  // For fiction (FIC*): keep all prose blocks intact
  // For non-fiction: keep about section + bullets
  // (Genre detection is informational here — we keep all blocks regardless)
  const _ = isFiction(bisac); // consumed for potential future branching

  const result = blocks.join("\n\n");

  // Strip trailing imperatives
  return stripTrailingImperatives(result);
}
