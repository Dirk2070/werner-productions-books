import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { parse as parseYaml } from "yaml";
import { createHash } from "crypto";
import { validateBooksYaml, type Book, type BooksFile } from "./books-schema";

// --- Config ---
const BASE_URL = "https://books.werner-productions.com";
const AUTHOR_ID = `${BASE_URL}/#author`;
const ORG_ID = `${BASE_URL}/#org-werner-productions`;
const WEBSITE_ID = `${BASE_URL}/#website`;

// --- Platform labels ---
const PLATFORM_LABELS: Record<string, string> = {
  kindle: "Amazon Kindle",
  amazon: "Amazon",
  amazon_de: "Amazon.de",
  amazon_com: "Amazon.com",
  appleBooks: "Apple Books",
  googlePlay: "Google Play",
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
  goodreads: "Goodreads",
};

const FORMAT_MAP: Record<string, string> = {
  ebook: "https://schema.org/EBook",
  paperback: "https://schema.org/Paperback",
  hardcover: "https://schema.org/Hardcover",
  audiobook: "https://schema.org/AudiobookFormat",
};

const FORMAT_LABEL: Record<string, string> = {
  ebook: "E-Book",
  paperback: "Taschenbuch",
  hardcover: "Hardcover",
  audiobook: "Hörbuch",
};

// --- State (hash-based idempotency) ---
interface GeneratorState {
  hashes: Record<string, string>;
}

function loadState(statePath: string): GeneratorState {
  if (existsSync(statePath)) {
    return JSON.parse(readFileSync(statePath, "utf-8"));
  }
  return { hashes: {} };
}

function saveState(statePath: string, state: GeneratorState) {
  writeFileSync(statePath, JSON.stringify(state, null, 2));
}

function contentHash(content: string): string {
  return createHash("sha256").update(content).digest("hex").slice(0, 16);
}

// --- JSON-LD Builder ---
function buildBookJsonLd(book: Book, allBooks: Book[]): object {
  const bookId = `${BASE_URL}/${book.slug}/#book`;
  const dates = book.workExample
    .map((e) => e.publicationDate)
    .filter((d): d is string => !!d)
    .sort();
  const earliestDate = dates[0];

  const firstIsbn = book.workExample.find((e) => e.isbn)?.isbn;

  const workExamples = book.workExample.map((edition) => {
    const id = `${BASE_URL}/${book.slug}/#${edition.format}-${edition.isbn || edition.asin || "edition"}`;
    const example: any = {
      "@type": edition.format === "audiobook" ? "Audiobook" : "Book",
      "@id": id,
      "bookFormat": FORMAT_MAP[edition.format],
    };
    if (edition.isbn) example.isbn = edition.isbn;
    if (edition.asin) {
      example.identifier = {
        "@type": "PropertyValue",
        "propertyID": "ASIN",
        "value": edition.asin,
      };
    }
    if (edition.narrator) example.readBy = { "@type": "Person", "name": edition.narrator };
    if (edition.durationMinutes) example.duration = `PT${edition.durationMinutes}M`;

    const actions = Object.entries(edition.urls).map(([platform, url]) => ({
      "@type": "BuyAction",
      "target": url,
      "name": PLATFORM_LABELS[platform] || platform,
    }));
    if (actions.length > 0) example.potentialAction = actions;

    return example;
  });

  const bookNode: any = {
    "@type": "Book",
    "@id": bookId,
    "name": book.title,
    "inLanguage": book.language,
    "description": book.descriptions.long,
    "author": { "@id": AUTHOR_ID },
    "publisher": { "@id": ORG_ID },
    "image": `${BASE_URL}/${book.cover.filename}`,
    "dateModified": book.dateModified,
    "keywords": book.keywords.join(", "),
  };

  if (earliestDate) bookNode.datePublished = earliestDate;
  if (book.subtitle) bookNode.alternativeHeadline = book.subtitle;
  if (firstIsbn) bookNode.isbn = firstIsbn;
  if (workExamples.length > 0) bookNode.workExample = workExamples;

  // Translation cross-references
  if (book.workTranslation.length > 0) {
    bookNode.workTranslation = book.workTranslation.map((slug) => ({
      "@id": `${BASE_URL}/${slug}/#book`,
    }));
  }
  if (book.translationOfWork.length > 0) {
    bookNode.translationOfWork = book.translationOfWork.map((slug) => ({
      "@id": `${BASE_URL}/${slug}/#book`,
    }))[0]; // translationOfWork is singular
  }

  // About / knowsAbout
  if (book.knowsAbout.length > 0) {
    bookNode.about = book.knowsAbout.map((topic) => ({
      "@type": "Thing",
      "name": topic,
    }));
  }

  // Goodreads sameAs
  if (book.goodreadsBookId) {
    bookNode.sameAs = `https://www.goodreads.com/book/show/${book.goodreadsBookId}`;
  }

  const webPageNode = {
    "@type": "WebPage",
    "@id": `${BASE_URL}/${book.slug}/`,
    "url": `${BASE_URL}/${book.slug}/`,
    "name": `${book.title} — Dirk Werner`,
    "isPartOf": { "@id": WEBSITE_ID },
    "primaryImageOfPage": `${BASE_URL}/${book.cover.filename}`,
    "mainEntity": { "@id": bookId },
    "dateModified": book.dateModified,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [bookNode, webPageNode],
  };
}

// --- HTML Builder ---
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildBuyLinksHtml(book: Book): string {
  const groups: { label: string; links: { platform: string; url: string }[] }[] = [];

  for (const edition of book.workExample) {
    const label = FORMAT_LABEL[edition.format] || edition.format;
    const links = Object.entries(edition.urls).map(([platform, url]) => ({
      platform: PLATFORM_LABELS[platform] || platform,
      url,
    }));
    if (links.length > 0) {
      groups.push({ label, links });
    }
  }

  return groups
    .map(
      (group) => `
      <div class="edition-group">
        <h3>${group.label}</h3>
        <div class="buy-links">
          ${group.links.map((l) => `<a href="${escapeHtml(l.url)}" rel="noopener">${escapeHtml(l.platform)}</a>`).join("\n          ")}
        </div>
      </div>`
    )
    .join("\n");
}

function buildTranslationBox(book: Book, allBooks: Book[]): string {
  const refs = [...book.workTranslation, ...book.translationOfWork];
  if (refs.length === 0) return "";

  const links = refs
    .map((slug) => {
      const other = allBooks.find((b) => b.slug === slug);
      if (!other) return "";
      const label = book.language === "de" ? "English edition" : "Deutsche Ausgabe";
      return `<a href="../${slug}/">${label}: <em>${escapeHtml(other.title)}</em></a>`;
    })
    .filter(Boolean);

  if (links.length === 0) return "";
  return `\n    <div class="translation-box">${links.join(" · ")}</div>\n`;
}

function buildDescriptionParagraphs(longDesc: string): string {
  return longDesc
    .split(/\n\n|\. (?=[A-ZÄÖÜ«»"])/)
    .filter(Boolean)
    .map((p) => `      <p>${escapeHtml(p.trim())}</p>`)
    .join("\n");
}

function buildBookHtml(book: Book, allBooks: Book[], jsonLd: object): string {
  const ogLocale = book.language === "de" ? "de_DE" : "en_US";
  const firstIsbn = book.workExample.find((e) => e.isbn)?.isbn;
  const year = book.workExample[0]?.publicationDate?.slice(0, 4) || "";
  const hasAudiobook = book.workExample.some((e) => e.format === "audiobook");

  return `<!DOCTYPE html>
<html lang="${book.language}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(book.title)} — Dirk Werner</title>
  <meta name="description" content="${escapeHtml(book.descriptions.meta)}">
  <meta name="author" content="Dirk Werner">
  <link rel="canonical" href="${BASE_URL}/${book.slug}/">
  <meta property="og:title" content="${escapeHtml(book.title)}">
  <meta property="og:description" content="${escapeHtml(book.descriptions.meta)}">
  <meta property="og:image" content="${BASE_URL}/${book.cover.filename}">
  <meta property="og:type" content="book">
  <meta property="og:locale" content="${ogLocale}">
  <meta property="og:url" content="${BASE_URL}/${book.slug}/">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(book.title)}">
  <meta name="twitter:description" content="${escapeHtml(book.descriptions.meta)}">
  <meta name="twitter:image" content="${BASE_URL}/${book.cover.filename}">
  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Georgia, 'Times New Roman', serif;
      background: #0a0a12;
      color: #e0d8cc;
      line-height: 1.7;
      min-height: 100vh;
    }
    .container {
      max-width: 720px;
      margin: 0 auto;
      padding: 3rem 1.5rem;
    }
    .book-header {
      display: flex;
      gap: 2rem;
      align-items: flex-start;
      margin-bottom: 2.5rem;
    }
    .cover {
      width: 220px;
      min-width: 220px;
      border-radius: 4px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.6);
    }
    .book-info h1 {
      font-size: 1.6rem;
      color: #d4a843;
      margin-bottom: 0.3rem;
      line-height: 1.3;
    }
    .subtitle {
      font-style: italic;
      color: #a09880;
      margin-bottom: 0.8rem;
      font-size: 0.95rem;
    }
    .meta {
      font-size: 0.85rem;
      color: #8a8070;
      margin-bottom: 1rem;
    }
    .meta span { margin-right: 1.2rem; }
    .description {
      margin-bottom: 2rem;
      font-size: 1.05rem;
    }
    .description p { margin-bottom: 1rem; }
    .edition-group { margin-bottom: 1.5rem; }
    .edition-group h3 {
      font-size: 0.95rem;
      color: #a09880;
      margin-bottom: 0.5rem;
    }
    .buy-links {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
    }
    .buy-links a {
      display: inline-block;
      padding: 0.5rem 1.2rem;
      background: #1a1a2e;
      color: #d4a843;
      text-decoration: none;
      border: 1px solid #2a2a3e;
      border-radius: 4px;
      font-size: 0.9rem;
      transition: background 0.2s;
    }
    .buy-links a:hover { background: #2a2a3e; }
    .translation-box {
      margin: 1.5rem 0;
      padding: 1rem;
      background: #0e0e1a;
      border: 1px solid #2a2a3e;
      border-radius: 4px;
      font-size: 0.95rem;
    }
    .translation-box a { color: #d4a843; text-decoration: none; }
    .translation-box a:hover { text-decoration: underline; }
    .author {
      border-top: 1px solid #1a1a2e;
      padding-top: 1.5rem;
      margin-top: 2.5rem;
      font-size: 0.85rem;
      color: #8a8070;
    }
    .author a { color: #a09880; }
    @media (max-width: 600px) {
      .book-header { flex-direction: column; align-items: center; text-align: center; }
      .cover { width: 180px; min-width: auto; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="book-header">
      <img src="cover.jpg" alt="${escapeHtml(book.cover.alt)}" class="cover" width="220" height="${Math.round(220 * (book.cover.dimensions.height / book.cover.dimensions.width))}">
      <div class="book-info">
        <h1>${escapeHtml(book.title.split(":")[0].trim())}</h1>
        ${book.subtitle ? `<div class="subtitle">${escapeHtml(book.subtitle)}</div>` : ""}
        <div class="meta">
          <span>Dirk Werner</span>
          <span>${year}</span>
          ${firstIsbn ? `<span>ISBN ${firstIsbn}</span>` : ""}
        </div>
        <div class="meta">
          ${hasAudiobook ? "<span>Auch als Hörbuch</span>" : ""}
        </div>
      </div>
    </div>

    <div class="description">
${buildDescriptionParagraphs(book.descriptions.long)}
    </div>
${buildBuyLinksHtml(book)}
${buildTranslationBox(book, allBooks)}
    <div class="author">
      <p><strong>Dirk Werner</strong> — Diplom-Psychologe, Psychotherapeut, Autor.</p>
      <p>
        <a href="https://dirkwernerbooks.com">dirkwernerbooks.com</a> ·
        <a href="https://orcid.org/0009-0001-7822-0041">ORCID</a> ·
        <a href="https://d-nb.info/gnd/1384382429">GND</a> ·
        <a href="https://www.goodreads.com/author/show/70076437">Goodreads</a>
      </p>
      <p style="margin-top: 0.5rem;"><a href="schema-org.jsonld">Schema.org JSON-LD</a> · <a href="../llms.txt">llms.txt</a></p>
    </div>
  </div>
</body>
</html>`;
}

// --- Main Generator ---

export interface GenerateResult {
  slug: string;
  changed: boolean;
  size?: number;
}

export function generateBookPages(opts: {
  booksYamlPath: string;
  outputDir: string;
  slugFilter?: string;
  dryRun?: boolean;
}): GenerateResult[] {
  const { booksYamlPath, outputDir, slugFilter, dryRun } = opts;

  // Validate
  const validation = validateBooksYaml(booksYamlPath);
  if (!validation.valid) {
    throw new Error(`books.yaml invalid:\n${validation.errors.join("\n")}`);
  }

  const { books } = validation.data;
  const statePath = resolve(outputDir, ".generator-state.json");
  const state = loadState(statePath);
  const results: GenerateResult[] = [];

  const booksToGenerate = slugFilter
    ? books.filter((b) => b.slug === slugFilter)
    : books;

  for (const book of booksToGenerate) {
    const jsonLd = buildBookJsonLd(book, books);
    const html = buildBookHtml(book, books, jsonLd);
    const jsonLdStr = JSON.stringify(jsonLd, null, 2);

    const hash = contentHash(html + jsonLdStr);
    const prevHash = state.hashes[book.slug];

    if (hash === prevHash) {
      results.push({ slug: book.slug, changed: false });
      continue;
    }

    if (!dryRun) {
      const bookDir = resolve(outputDir, book.slug);
      if (!existsSync(bookDir)) mkdirSync(bookDir, { recursive: true });
      writeFileSync(resolve(bookDir, "index.html"), html);
      writeFileSync(resolve(bookDir, "schema-org.jsonld"), jsonLdStr);
      state.hashes[book.slug] = hash;
    }

    results.push({ slug: book.slug, changed: true, size: html.length });
  }

  if (!dryRun) {
    saveState(statePath, state);
  }

  return results;
}
