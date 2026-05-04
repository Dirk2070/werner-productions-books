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

export interface GoodreadsBookDetail {
  goodreadsBookId: string;
  url: string;
  title: string;
  authorName: string;
  isbn?: string;
  asin?: string;
  pages?: number;
  publishedDate?: string;    // ISO YYYY-MM-DD if parseable
  publishedYear?: string;    // fallback year only
  description?: string;      // cleaned full description
  descriptionExcerpt?: string; // first paragraph, max 800 chars
  descriptionForLong?: string; // ~600 chars, no marketing
  rating?: number;
  ratingCount?: number;
  reviewCount?: number;
  language?: string;
  format?: string;
  coverImageUrl?: string;
}

const TTL_7D = 7 * 24 * 60 * 60 * 1000;

export async function fetchBookDetail(
  goodreadsBookId: string
): Promise<GoodreadsBookDetail | null> {
  const url = `https://www.goodreads.com/book/show/${goodreadsBookId}`;
  const cacheKey = `goodreads-detail-${goodreadsBookId}.html`;

  let html: string;
  try {
    html = await fetchWithCache(url, cacheKey, TTL_7D, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
      },
    });
  } catch (e) {
    return null;
  }

  const $ = cheerio.load(html);

  // Strategy 1: Try JSON-LD (most reliable)
  let jsonLd: any = null;
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html() || "");
      if (data["@type"] === "Book" || (Array.isArray(data["@graph"]) && data["@graph"].find((n: any) => n["@type"] === "Book"))) {
        jsonLd = data["@type"] === "Book" ? data : data["@graph"].find((n: any) => n["@type"] === "Book");
      }
    } catch {}
  });

  const result: GoodreadsBookDetail = {
    goodreadsBookId,
    url,
    title: "",
    authorName: "",
  };

  if (jsonLd) {
    result.title = jsonLd.name || "";
    if (jsonLd.author) {
      result.authorName = typeof jsonLd.author === "string" ? jsonLd.author :
        Array.isArray(jsonLd.author) ? jsonLd.author[0]?.name || "" : jsonLd.author.name || "";
    }
    if (jsonLd.isbn) result.isbn = jsonLd.isbn;
    if (jsonLd.numberOfPages) result.pages = parseInt(jsonLd.numberOfPages);
    if (jsonLd.datePublished) {
      result.publishedDate = jsonLd.datePublished;
      result.publishedYear = jsonLd.datePublished.slice(0, 4);
    }
    if (jsonLd.aggregateRating) {
      result.rating = parseFloat(jsonLd.aggregateRating.ratingValue);
      result.ratingCount = parseInt(jsonLd.aggregateRating.ratingCount);
      if (jsonLd.aggregateRating.reviewCount) {
        result.reviewCount = parseInt(jsonLd.aggregateRating.reviewCount);
      }
    }
    if (jsonLd.image) result.coverImageUrl = typeof jsonLd.image === "string" ? jsonLd.image : jsonLd.image.url;
    if (jsonLd.bookFormat) result.format = jsonLd.bookFormat;
    if (jsonLd.inLanguage) result.language = jsonLd.inLanguage;
  }

  // Strategy 2: HTML fallback for missing fields
  if (!result.title) {
    result.title = $("h1").first().text().trim();
  }
  if (!result.authorName) {
    result.authorName = $("a.authorName span").first().text().trim() ||
                        $("[data-testid='name']").first().text().trim() || "";
  }
  if (!result.coverImageUrl) {
    result.coverImageUrl = $("meta[property='og:image']").attr("content") || undefined;
  }

  // Description: try multiple selectors
  let rawDesc = "";
  // Modern Goodreads
  const descEl = $("[data-testid='description'] .Formatted").first();
  if (descEl.length) {
    rawDesc = descEl.html() || "";
  }
  // Legacy Goodreads
  if (!rawDesc) {
    const legacyDesc = $("#description span[style='display:none']").first();
    if (legacyDesc.length) rawDesc = legacyDesc.html() || "";
    if (!rawDesc) rawDesc = $("#description span").first().html() || "";
  }

  if (rawDesc) {
    const cleaned = cleanDescription(rawDesc);
    result.description = cleaned.full;
    result.descriptionExcerpt = cleaned.excerpt;
    result.descriptionForLong = cleaned.forLong;
  }

  // Pages fallback from HTML
  if (!result.pages) {
    const pageMatch = $("body").text().match(/(\d+)\s+pages/i);
    if (pageMatch) result.pages = parseInt(pageMatch[1]);
  }

  // Published fallback
  if (!result.publishedDate && !result.publishedYear) {
    const pubMatch = $("body").text().match(/(?:Published|First published)\s+([A-Za-z]+\s+\d{1,2},?\s+\d{4}|\d{4})/i);
    if (pubMatch) {
      const dateStr = pubMatch[1];
      if (/^\d{4}$/.test(dateStr)) {
        result.publishedYear = dateStr;
      } else {
        try {
          const d = new Date(dateStr);
          if (!isNaN(d.getTime())) {
            result.publishedDate = d.toISOString().slice(0, 10);
            result.publishedYear = result.publishedDate.slice(0, 4);
          }
        } catch {
          result.publishedYear = dateStr.match(/(\d{4})/)?.[1];
        }
      }
    }
  }

  // ASIN from Amazon links
  if (!result.asin) {
    const amazonLink = $("a[href*='amazon.com/dp/']").attr("href") ||
                        $("a[href*='amzn.to/']").attr("href") || "";
    const asinMatch = amazonLink.match(/\/dp\/(B0[A-Z0-9]{8})/);
    if (asinMatch) result.asin = asinMatch[1];
  }

  return result;
}

export function cleanDescription(rawHtml: string): {
  full: string;
  excerpt: string;
  forLong: string;
} {
  // 1. Strip HTML tags but keep line breaks
  let text = rawHtml
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();

  // 2. Remove author bio section
  text = text.replace(/(?:\n|^)\s*(?:Über den Autor|About the Author|About Dirk Werner)[\s\S]*$/i, "").trim();

  // 3. Remove marketing imperatives
  const marketingPatterns = [
    /Fangen Sie noch heute an[^.]*\./gi,
    /Bestellen Sie jetzt[^.]*\./gi,
    /Lassen Sie sich[^.]*inspirieren[^.]*\./gi,
    /Order now[^.]*\./gi,
    /Don't miss out[^.]*\./gi,
    /Get your copy[^.]*\./gi,
    /Buy now[^.]*\./gi,
    /Click (?:the )?"[^"]*" button[^.]*\./gi,
    /Scroll up and[^.]*\./gi,
  ];
  for (const pat of marketingPatterns) {
    text = text.replace(pat, "");
  }

  // 4. Clean up whitespace
  text = text.replace(/\n{3,}/g, "\n\n").replace(/ {2,}/g, " ").trim();

  // Full: max 3000 chars
  const full = text.slice(0, 3000);

  // Excerpt: first paragraph, max 800 chars
  const firstPara = text.split(/\n\n/)[0] || text;
  let excerpt = firstPara.slice(0, 800);
  if (firstPara.length > 800) {
    const lastDot = excerpt.lastIndexOf(".");
    if (lastDot > 200) excerpt = excerpt.slice(0, lastDot + 1) + " …";
  }

  // forLong: first 2-3 sentences, max 600 chars, no bullets
  let forLong = text
    .replace(/^[-•*]\s+/gm, "")  // strip bullet points
    .replace(/\n+/g, " ")         // flatten to single line
    .trim();

  // Take sentences until ~600 chars
  const sentences = forLong.match(/[^.!?]+[.!?]+/g) || [forLong];
  let accumulated = "";
  for (const s of sentences) {
    if ((accumulated + s).length > 600) break;
    accumulated += s;
  }
  forLong = accumulated.trim() || forLong.slice(0, 600);

  return { full, excerpt, forLong };
}
