export interface BooksJsonEntry {
  asin: string;
  title: { de: string; en: string };
  description: { de: string; en: string };
  author: string;
  image: { link: string };
  link: string;
  links: Record<string, string>;
  language: "de" | "en";
  bookFormat: { de: string; en: string };
  hasAudiobook: boolean;
  hasPaperback: boolean;
  paperbackAsin?: string;
  relatedBook?: string;
}

export interface ParsedBookPage {
  paperbackIsbn: string | null;
  appleAudioId: string | null;
  aboutBullets: string[];
  quotes: string[];
  formatBadges: string[];
}

export interface GoodreadsMatch {
  goodreadsBookId: string | null;
  matchType: "exact" | "isbn" | "fuzzy" | null;
  bestCandidate?: string;
}

export interface AppMatch {
  id: string;
  slug: string;
  name: string;
  overlap: number;
}

export interface ResearchResult {
  slug: string;
  title: string;
  language: "de" | "en";
  asin: string;
  paperbackIsbn: string | null;
  appleAudioId: string | null;
  goodreadsBookId: string | null;
  bisac: string[];
  genre: string[];
  keywords: string[];
  knowsAbout: string[];
  mentions: Array<{ id: string }>;
  descriptions: { meta: string; short: string; long: string };
  formatBadges: string[];
}

export interface ErrorLogEntry {
  timestamp: string;
  asin: string;
  type: "NETWORK_FAIL" | "SCHEMA_FAIL" | "COVER_MISSING" | "GOODREADS_NO_MATCH";
  detail: string;
}
