import * as cheerio from "cheerio";
import { fetchWithCache } from "./fetch-cache";
import { levenshtein, normalize } from "./slug-utils";
import type { BooksJsonEntry, GoodreadsMatch } from "./types";

const RSS_URL = "https://www.goodreads.com/author/list/70076437.rss";
const CACHE_KEY = "goodreads-author.rss";
const TTL_24H = 24 * 60 * 60 * 1000;

export interface GoodreadsItem {
  title: string;
  bookId: string;
  isbn: string | null;
}

function parseRssXml(xml: string): GoodreadsItem[] {
  const $ = cheerio.load(xml, { xmlMode: true });
  const items: GoodreadsItem[] = [];

  $("item").each((_, el) => {
    const title = $(el).find("title").text().trim();
    const link = $(el).find("link").text().trim();
    const desc = $(el).find("description").text().trim();

    const idMatch = link.match(/\/book\/show\/(\d+)/);
    const isbnMatch = desc.match(/(\d{13})/);

    if (idMatch) {
      items.push({
        title,
        bookId: idMatch[1],
        isbn: isbnMatch ? isbnMatch[1] : null,
      });
    }
  });

  return items;
}

function parseGoodreadsHtml(html: string): GoodreadsItem[] {
  const $ = cheerio.load(html);
  const items: GoodreadsItem[] = [];
  const seen = new Set<string>();

  // Goodreads author list page: book titles in .bookTitle links
  // href="/book/show/<id>-slug"
  $("a.bookTitle[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    const idMatch = href.match(/\/book\/show\/(\d+)/);
    if (!idMatch) return;
    const bookId = idMatch[1];
    if (seen.has(bookId)) return;
    seen.add(bookId);

    // title is the itemprop="name" span inside the link, or the link text
    const title = $(el).find("[itemprop='name']").text().trim() || $(el).text().trim();
    if (title) {
      items.push({ title, bookId, isbn: null });
    }
  });

  return items;
}

export async function fetchGoodreadsRss(): Promise<GoodreadsItem[]> {
  const content = await fetchWithCache(RSS_URL, CACHE_KEY, TTL_24H, {
    headers: {
      "Accept": "application/rss+xml, application/xml, text/xml, */*",
      "User-Agent": "Mozilla/5.0 (compatible; WernerProductionsResearch/1.0)",
    },
  });

  // Check if we got real RSS/XML or an HTML fallback
  const trimmed = content.trimStart();
  if (trimmed.startsWith("<?xml") || trimmed.startsWith("<rss") || trimmed.startsWith("<feed")) {
    const items = parseRssXml(content);
    if (items.length > 0) return items;
  }

  // Fallback: parse the HTML author page for book links
  return parseGoodreadsHtml(content);
}

// Hardcoded overrides for books on wrong Goodreads author profiles
// Suizidprävention is listed under ghost profile 1142115 (Namesake-Mischprofil)
const GOODREADS_ID_OVERRIDES: Record<string, string> = {
  "B0D3BMXBN1": "212790817", // Suizidprävention — on author 1142115 instead of 70076437
};

export function matchGoodreadsToBook(
  book: BooksJsonEntry,
  rssItems: GoodreadsItem[]
): GoodreadsMatch {
  // 0. Hardcoded override (for books on wrong author profiles)
  if (GOODREADS_ID_OVERRIDES[book.asin]) {
    return { goodreadsBookId: GOODREADS_ID_OVERRIDES[book.asin], matchType: "exact" };
  }

  const bookTitleDe = normalize(book.title.de);
  const bookTitleEn = normalize(book.title.en);

  // 1. Exact title match
  for (const item of rssItems) {
    const rssTitle = normalize(item.title);
    if (rssTitle === bookTitleDe || rssTitle === bookTitleEn) {
      return { goodreadsBookId: item.bookId, matchType: "exact" };
    }
  }

  // 2. ISBN match
  const knownIsbns: string[] = [];
  if (book.paperbackAsin?.match(/^\d{13}$/)) knownIsbns.push(book.paperbackAsin);

  for (const item of rssItems) {
    if (item.isbn && knownIsbns.includes(item.isbn)) {
      return { goodreadsBookId: item.bookId, matchType: "isbn" };
    }
  }

  // 3. Fuzzy match (Levenshtein < 10)
  // Also compare main-title-only (before colon) to handle subtitle differences
  const bookTitleDeMain = normalize(book.title.de.split(":")[0]);
  const bookTitleEnMain = normalize(book.title.en.split(":")[0]);

  let bestDist = Infinity;
  let bestItem: GoodreadsItem | null = null;

  for (const item of rssItems) {
    const rssTitle = normalize(item.title);
    const rssTitleMain = normalize(item.title.split(":")[0]);
    const distDe = Math.min(levenshtein(rssTitle, bookTitleDe), levenshtein(rssTitleMain, bookTitleDeMain));
    const distEn = Math.min(levenshtein(rssTitle, bookTitleEn), levenshtein(rssTitleMain, bookTitleEnMain));
    const dist = Math.min(distDe, distEn);

    if (dist < bestDist) {
      bestDist = dist;
      bestItem = item;
    }
  }

  if (bestDist < 10 && bestItem) {
    return { goodreadsBookId: bestItem.bookId, matchType: "fuzzy" };
  }

  // 4. No match
  return {
    goodreadsBookId: null,
    matchType: null,
    bestCandidate: bestDist < 20 && bestItem
      ? `"${bestItem.title}" (dist=${bestDist})`
      : undefined,
  };
}
