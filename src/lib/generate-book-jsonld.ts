import type { Book } from "./books-schema.js";

const BASE_URL = "https://books.werner-productions.com";
const AUTHOR_ID = `${BASE_URL}/#author`;
const ORG_ID = `${BASE_URL}/#org-werner-productions`;
const WEBSITE_ID = `${BASE_URL}/#website`;

const FORMAT_MAP: Record<string, string> = {
  ebook: "https://schema.org/EBook",
  paperback: "https://schema.org/Paperback",
  hardcover: "https://schema.org/Hardcover",
  audiobook: "https://schema.org/AudiobookFormat",
};

const PLATFORM_LABELS: Record<string, string> = {
  kindle: "Amazon Kindle",
  amazon: "Amazon",
  amazon_de: "Amazon.de",
  amazon_com: "Amazon.com",
  appleBooks: "Apple Books",
  apple_books: "Apple Books",
  apple_books_de: "Apple Books DE",
  apple_books_us: "Apple Books US",
  googlePlay: "Google Play",
  google_play: "Google Play",
  books2read: "Books2Read",
  spotify: "Spotify",
  kobo: "Kobo",
  elevenreader: "ElevenReader",
  nook: "NOOK",
  tunein: "TuneIn",
  tolino: "Tolino",
  weltbild: "Weltbild",
  audible: "Audible",
  inaudio: "INAudio",
};

export function generateJsonLd(book: Book, allBooks: Book[]): object {
  const bookId = `${BASE_URL}/${book.slug}/#book`;

  const dates = book.workExample
    .map((e) => e.publicationDate)
    .filter((d): d is string => !!d)
    .sort();
  const earliestDate = dates[0];
  const firstIsbn = book.workExample.find((e) => e.isbn)?.isbn;

  const workExamples = book.workExample.map((edition) => {
    const id = `${BASE_URL}/${book.slug}/#${edition.format}-${edition.isbn ?? edition.asin ?? "edition"}`;
    const example: Record<string, unknown> = {
      "@type": edition.format === "audiobook" ? "Audiobook" : "Book",
      "@id": id,
      bookFormat: FORMAT_MAP[edition.format],
    };
    if (edition.isbn) example["isbn"] = edition.isbn;
    if (edition.asin) {
      example["identifier"] = {
        "@type": "PropertyValue",
        propertyID: "ASIN",
        value: edition.asin,
      };
    }
    if (edition.narrator) example["readBy"] = { "@type": "Person", name: edition.narrator };
    if (edition.durationMinutes) example["duration"] = `PT${edition.durationMinutes}M`;

    const actions = Object.entries(edition.urls).map(([platform, url]) => ({
      "@type": "BuyAction",
      target: url,
      name: PLATFORM_LABELS[platform] ?? platform,
    }));
    if (actions.length > 0) example["potentialAction"] = actions;

    return example;
  });

  const bookNode: Record<string, unknown> = {
    "@type": "Book",
    "@id": bookId,
    name: book.title,
    inLanguage: book.language,
    description: book.descriptions.long,
    author: { "@id": AUTHOR_ID },
    publisher: { "@id": ORG_ID },
    image: `${BASE_URL}/${book.cover.filename}`,
    dateModified: book.dateModified,
    keywords: book.keywords.join(", "),
  };

  if (earliestDate) bookNode["datePublished"] = earliestDate;
  if (book.subtitle) bookNode["alternativeHeadline"] = book.subtitle;
  if (book.alternateName) bookNode["alternateName"] = book.alternateName;
  if (firstIsbn) bookNode["isbn"] = firstIsbn;
  if (workExamples.length > 0) bookNode["workExample"] = workExamples;

  if (book.workTranslation.length > 0) {
    bookNode["workTranslation"] = book.workTranslation.map((slug) => ({
      "@id": `${BASE_URL}/${slug}/#book`,
    }));
  }
  if (book.translationOfWork.length > 0) {
    bookNode["translationOfWork"] = {
      "@id": `${BASE_URL}/${book.translationOfWork[0]}/#book`,
    };
  }

  if (book.knowsAbout.length > 0) {
    bookNode["about"] = book.knowsAbout.map((topic) => ({
      "@type": "Thing",
      name: topic,
    }));
  }

  if (book.mentions && book.mentions.length > 0) {
    bookNode["mentions"] = book.mentions.map((m) => ({ "@id": m.id }));
  }

  if (book.reviews && book.reviews.length > 0) {
    bookNode["review"] = book.reviews.map((r) => ({
      "@type": "Review",
      reviewBody: r.quote,
      author: r.attribution
        ? { "@type": "Person", name: r.attribution }
        : { "@type": "Organization", name: r.source },
      publisher: { "@type": "Organization", name: r.source },
    }));
  }

  const identifier: object[] = [];
  const ebookAsin = book.workExample.find((e) => e.format === "ebook")?.asin;
  if (ebookAsin) {
    identifier.push({
      "@type": "PropertyValue",
      propertyID: "ASIN",
      value: ebookAsin,
    });
  }
  if (firstIsbn) {
    identifier.push({
      "@type": "PropertyValue",
      propertyID: "ISBN",
      value: firstIsbn,
    });
  }
  if (identifier.length > 0) bookNode["identifier"] = identifier;

  const sameAs: string[] = [];
  if (book.goodreadsBookId) {
    sameAs.push(`https://www.goodreads.com/book/show/${book.goodreadsBookId}`);
  }
  const appleAudiobook = book.workExample.find(
    (e) => e.format === "audiobook" && e.urls["apple_books"]
  );
  if (appleAudiobook?.urls["apple_books"]) {
    sameAs.push(appleAudiobook.urls["apple_books"]);
  }
  if (sameAs.length > 0) bookNode["sameAs"] = sameAs.length === 1 ? sameAs[0] : sameAs;

  const webPageNode = {
    "@type": "WebPage",
    "@id": `${BASE_URL}/${book.slug}/`,
    url: `${BASE_URL}/${book.slug}/`,
    name: `${book.title} — Dirk Werner`,
    isPartOf: { "@id": WEBSITE_ID },
    primaryImageOfPage: `${BASE_URL}/${book.cover.filename}`,
    mainEntity: { "@id": bookId },
    dateModified: book.dateModified,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [bookNode, webPageNode],
  };
}
