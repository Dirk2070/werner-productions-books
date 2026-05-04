import type { BooksJsonEntry } from "./types";

export interface EditionUrls {
  ebook: Record<string, string>;
  paperback: Record<string, string>;
  audiobook: Record<string, string>;
}

/**
 * Splits a books.json `links` flat map into edition-specific URL buckets.
 * Unknown keys are silently dropped — nothing gets dumped wholesale.
 */
export function splitEditionUrls(book: BooksJsonEntry): EditionUrls {
  const links = book.links || {};
  const ebook: Record<string, string> = {};
  const paperback: Record<string, string> = {};
  const audiobook: Record<string, string> = {};

  if (book.link) ebook.amazon = book.link;

  for (const [key, url] of Object.entries(links)) {
    if (!url) continue;

    // Audiobook URLs
    if (key === "audiobook") { audiobook.apple = url; continue; }
    if (key === "audiobook_de") { audiobook.apple_de = url; continue; }
    if (key === "audiobook_us") { audiobook.apple_us = url; continue; }
    if (key === "audiobook_google_play") { audiobook.googlePlay = url; continue; }
    if (key === "audiobook_elevenreader") { audiobook.elevenreader = url; continue; }
    if (key === "audiobook_spotify") { audiobook.spotify = url; continue; }
    if (key === "audiobook_kobo") { audiobook.kobo = url; continue; }
    if (key === "audiobook_nook") { audiobook.nook = url; continue; }
    if (key === "audiobook_tunein") { audiobook.tunein = url; continue; }

    // Paperback URLs
    if (key === "amazon_de_paperback") { paperback.amazon_de = url; continue; }
    if (key === "amazon_us_paperback") { paperback.amazon_us = url; continue; }
    if (key === "books2read_paperback") { paperback.books2read = url; continue; }

    // Ebook URLs
    if (key === "amazon_de") { ebook.amazon_de = url; continue; }
    if (key === "amazon_us") { ebook.amazon_us = url; continue; }
    if (key === "apple_books") { ebook.appleBooks = url; continue; }
    if (key === "books2read") { ebook.books2read = url; continue; }
    if (key === "google_play") { ebook.googlePlay = url; continue; }
    if (key === "kobo") { ebook.kobo = url; continue; }
    // Unknown keys: skip
  }

  return { ebook, paperback, audiobook };
}
