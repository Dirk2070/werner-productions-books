import * as cheerio from "cheerio";
import type { ParsedBookPage, Review } from "./types";

// ---------------------------------------------------------------------------
// parseAboutSection — extracts "Über dieses Buch" / "About This Book" section
// ---------------------------------------------------------------------------

export function parseAboutSection($: cheerio.CheerioAPI): string {
  const heading = $("h2:contains('Über dieses Buch'), h2:contains('About This Book'), h2:contains('About this Book')").first();

  const blocks: string[] = [];

  // Real markup wraps content in DIVs (.tldr-box, .key-takeaways, [itemprop=description]).
  // Recursive walker descends into DIV children so wrapped p/h3/ul/strong are captured.
  // Stop at next h2 OR at navigational/purchase markers that follow the about-section.
  const STOP_SELECTOR = "h2, .purchase-options, .all-books-button-container";

  function processElement(el: any): void {
    const $el = $(el);
    const tag = (el as any).tagName?.toLowerCase();
    if (!tag) return;

    // Stop-marker check (defensive — also enforced via nextUntil above)
    if (tag === "div" && ($el.hasClass("purchase-options") || $el.hasClass("all-books-button-container"))) {
      return;
    }
    // Skip press-review blocks — those belong in reviews[], not marketing
    if (tag === "div" && $el.hasClass("press-review")) {
      return;
    }

    if (tag === "p") {
      const strongChild = $el.children("strong").first();
      // <p><strong>Header</strong></p> with no other children → bold heading
      if (strongChild.length === 1 && $el.children().length === 1 && !$el.text().replace(strongChild.text(), "").trim()) {
        blocks.push(`**${strongChild.text().trim()}**`);
      } else {
        const text = $el.text().trim();
        if (text) blocks.push(text);
      }
    } else if (tag === "h3" || tag === "h4") {
      const text = $el.text().trim();
      if (text) blocks.push(`**${text}**`);
    } else if (tag === "ul" || tag === "ol") {
      $el.find("> li").each((_, li) => {
        const liText = $(li).text().trim();
        if (liText) blocks.push(`- ${liText}`);
      });
    } else if (tag === "strong") {
      // Bare <strong> (e.g. inside .tldr-box without <p> wrapper) → bold heading
      const text = $el.text().trim();
      if (text) blocks.push(`**${text}**`);
    } else if (tag === "div") {
      // Recurse into DIV children
      $el.children().each((_, child) => processElement(child));
    }
  }

  if (heading.length) {
    heading.nextUntil(STOP_SELECTOR).each((_, el) => processElement(el));
  } else {
    // Fallback: page lacks the h2 anchor but has a .tldr-box wrapper (e.g. EN editions
    // where "About This Book" heading was omitted by the page template).
    const tldr = $(".tldr-box").first();
    if (!tldr.length) return "";
    processElement(tldr.get(0));
    tldr.nextAll().each((_, el) => {
      const tag = (el as any).tagName?.toLowerCase();
      if (tag === "h2" || $(el).hasClass("purchase-options") || $(el).hasClass("all-books-button-container")) {
        return false; // break
      }
      processElement(el);
    });
  }

  return blocks.join("\n\n");
}

// ---------------------------------------------------------------------------
// parseReviews — extracts blockquote + cite pairs as structured reviews
// ---------------------------------------------------------------------------

export function parseReviews($: cheerio.CheerioAPI): Review[] {
  const reviews: Review[] = [];

  // Pattern A: <blockquote> + optional <cite> or following <p>
  $("blockquote").each((_, el) => {
    const rawQuote = $(el).text().trim().replace(/^[„""]|[""""]$/g, "");
    if (!rawQuote) return;

    const cite = $(el).next("cite, p").first();
    const citeText = cite.length ? cite.text().trim() : "";

    const sourceMatch = citeText.match(/—\s*(.+?)(?:\s+(?:über|on)\s+)/);
    const attrMatch = citeText.match(/(?:über|on)\s+(.+)/);

    reviews.push({
      quote: rawQuote,
      source: sourceMatch?.[1]?.trim() ?? citeText.replace(/^—\s*/, "").trim(),
      attribution: attrMatch?.[1]?.trim(),
    });
  });

  // Pattern B: paragraph-pair — <p>"quote..."</p> + <p>— <strong>Source</strong> ...</p>
  // Explicit Unicode codepoints: U+201E „ U+201C " U+201D " U+0022 " U+00AB «
  const OPEN_QUOTE = /^[„“”"«]/;
  const QUOTE_STRIP_LEAD = /^[„“”"«]\s*/;
  const QUOTE_STRIP_TRAIL = /[\s.…”“„"»]+$/;
  $("p").each((_, el) => {
    const text = $(el).text().trim();
    if (!OPEN_QUOTE.test(text)) return;

    const next = $(el).next("p");
    if (!next.length) return;
    const citeText = next.text().trim();
    if (!/^—/.test(citeText) || next.find("strong").length === 0) return;

    const quote = text.replace(QUOTE_STRIP_LEAD, "").replace(QUOTE_STRIP_TRAIL, "").trim();
    const source = next.find("strong").first().text().trim();

    // Attribution: everything after "über"/"on" following the source
    const afterSource = citeText.replace(/^—\s*/, "").replace(source, "");
    const attrMatch = afterSource.match(/^\s*(?:über|on)\s+(.+)/i);
    const attribution = attrMatch?.[1]?.trim() || undefined;

    // Avoid duplicates already captured via blockquote pattern
    const alreadyAdded = reviews.some(r => r.source === source);
    if (!alreadyAdded) {
      reviews.push({ quote, source, attribution });
    }
  });

  return reviews;
}

// ---------------------------------------------------------------------------
// parseFormats — maps existing formatBadges into availableFormats
// ---------------------------------------------------------------------------

export function parseFormats($: cheerio.CheerioAPI, formatBadges: string[]): string[] {
  // Prefer badge list if already populated; otherwise try structured selectors
  if (formatBadges.length > 0) return formatBadges;

  const formats: string[] = [];
  $(".book-formats li, .formats > p").each((_, el) => {
    const t = $(el).text().trim();
    if (t) formats.push(t);
  });
  return formats;
}

// ---------------------------------------------------------------------------
// parseBookPage — main entry point (backwards-compatible, additive)
// ---------------------------------------------------------------------------

export function parseBookPage(html: string): ParsedBookPage {
  const $ = cheerio.load(html);

  // a) Paperback ISBN — look for /dp/979... links
  const isbnMatch = html.match(/\/dp\/(979\d{10})/);
  const paperbackIsbn = isbnMatch ? isbnMatch[1] : null;

  // b) Apple Audiobook ID
  const appleMatch = html.match(/apple\.com\/.*\/audiobook\/[^"]+\/id(\d+)/);
  const appleAudioId = appleMatch ? appleMatch[1] : null;

  // c) About/What You'll Learn bullets (legacy)
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

  // d) Quotes from blockquotes (legacy — raw text)
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

  // f) New: marketing markdown from "Über dieses Buch" section
  const marketingMarkdown = parseAboutSection($);

  // g) New: structured reviews
  const reviews = parseReviews($);

  // h) New: available formats (mapped from badges)
  const availableFormats = parseFormats($, formatBadges);

  return {
    paperbackIsbn,
    appleAudioId,
    aboutBullets,
    quotes,
    formatBadges,
    marketingMarkdown,
    reviews,
    availableFormats,
  };
}
