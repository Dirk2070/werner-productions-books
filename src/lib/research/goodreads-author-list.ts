import * as cheerio from "cheerio";
import { fetchWithCache } from "./fetch-cache";

const AUTHOR_LIST_BASE = "https://www.goodreads.com/author/list/";
const TTL_24H = 24 * 60 * 60 * 1000;
const MAX_PAGES = 10; // safety limit

export interface GoodreadsBookListEntry {
  goodreadsBookId: string;
  url: string;
  title: string;
  publishedYear?: string;
  rating?: number;
  ratingCount?: number;
}

export async function scrapeAuthorBookList(
  authorId: string = "70076437"
): Promise<GoodreadsBookListEntry[]> {
  const allBooks: GoodreadsBookListEntry[] = [];
  const seen = new Set<string>();

  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = `${AUTHOR_LIST_BASE}${authorId}.Dirk_Werner?page=${page}`;
    const cacheKey = `goodreads-author-list-page${page}.html`;

    const html = await fetchWithCache(url, cacheKey, TTL_24H, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    const $ = cheerio.load(html);
    let foundOnPage = 0;

    // Parse book entries - Goodreads uses table rows with bookTitle links
    $("a.bookTitle[href]").each((_, el) => {
      const href = $(el).attr("href") || "";
      const idMatch = href.match(/\/book\/show\/(\d+)/);
      if (!idMatch) return;

      const bookId = idMatch[1];
      if (seen.has(bookId)) return;
      seen.add(bookId);

      const title =
        $(el).find("[itemprop='name']").text().trim() ||
        $(el).text().trim();
      if (!title) return;

      const fullUrl = `https://www.goodreads.com${href}`;

      // Try to extract rating and published year from the same row
      const row = $(el).closest("tr");
      const ratingText = row.find(".minirating").text().trim();
      const ratingMatch = ratingText.match(/([\d.]+)\s+avg/);
      const countMatch = ratingText.match(/([\d,]+)\s+rating/);
      const pubMatch = row.text().match(/published\s+(\d{4})/i);

      const entry: GoodreadsBookListEntry = {
        goodreadsBookId: bookId,
        url: fullUrl,
        title,
      };

      if (ratingMatch) entry.rating = parseFloat(ratingMatch[1]);
      if (countMatch)
        entry.ratingCount = parseInt(countMatch[1].replace(/,/g, ""));
      if (pubMatch) entry.publishedYear = pubMatch[1];

      allBooks.push(entry);
      foundOnPage++;
    });

    console.log(`  Goodreads page ${page}: ${foundOnPage} books`);

    // Check for next page
    const hasNext = $("a.next_page").length > 0;
    if (!hasNext || foundOnPage === 0) break;

    // Rate limiting between pages
    await new Promise((r) => setTimeout(r, 500));
  }

  return allBooks;
}
