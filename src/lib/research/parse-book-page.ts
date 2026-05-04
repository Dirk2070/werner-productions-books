import * as cheerio from "cheerio";
import type { ParsedBookPage } from "./types";

export function parseBookPage(html: string): ParsedBookPage {
  const $ = cheerio.load(html);

  // a) Paperback ISBN — look for /dp/979... links
  const isbnMatch = html.match(/\/dp\/(979\d{10})/);
  const paperbackIsbn = isbnMatch ? isbnMatch[1] : null;

  // b) Apple Audiobook ID
  const appleMatch = html.match(/apple\.com\/.*\/audiobook\/[^"]+\/id(\d+)/);
  const appleAudioId = appleMatch ? appleMatch[1] : null;

  // c) About/What You'll Learn bullets
  const aboutBullets: string[] = [];
  $("h2, h3").each((_, el) => {
    const text = $(el).text().trim();
    if (/about this book|what you.ll learn/i.test(text)) {
      let sibling = $(el).next();
      while (sibling.length && !sibling.is("h2, h3")) {
        if (sibling.is("ul")) {
          sibling.find("li").each((_, li) => {
            aboutBullets.push($(li).text().trim());
          });
        }
        sibling = sibling.next();
      }
    }
  });

  // d) Quotes from blockquotes
  const quotes: string[] = [];
  $("blockquote").each((_, el) => {
    quotes.push($(el).text().trim());
  });

  // e) Format badges
  const formatBadges: string[] = [];
  const badgePatterns = ["EBook", "Hörbuch", "Taschenbuch", "Audiobook", "Paperback"];
  const bodyText = $("body").text();
  for (const badge of badgePatterns) {
    if (bodyText.includes(badge)) formatBadges.push(badge);
  }

  return { paperbackIsbn, appleAudioId, aboutBullets, quotes, formatBadges };
}
