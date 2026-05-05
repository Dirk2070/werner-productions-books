import { z } from "zod";
import { readFileSync } from "fs";
import { parse as parseYaml } from "yaml";

// --- Sub-schemas ---

const slugPattern = /^[a-z0-9-]+$/;
const isbnPattern = /^\d{13}$/;
const asinPattern = /^B0[A-Z0-9]{8}$/;
const bisacPattern = /^[A-Z]{3}\d{6}$/;

const urlMapSchema = z.record(z.string(), z.string().url());

const workExampleSchema = z
  .object({
    format: z.enum(["ebook", "paperback", "hardcover", "audiobook"]),
    isbn: z.string().regex(isbnPattern, "ISBN must be 13 digits").optional(),
    asin: z.string().regex(asinPattern, "ASIN must start with B0 + 8 alphanumeric chars").optional(),
    publisher: z.string(),
    publicationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD").optional(),
    urls: urlMapSchema.default({}),
    narrator: z.string().optional(),
    durationMinutes: z.number().int().positive().optional(),
  })
  .refine(
    (e) => e.format !== "audiobook" || e.narrator !== undefined,
    { message: "Audiobook format requires narrator" }
  );

const descriptionsSchema = z.object({
  meta: z.string().max(155, "meta description must be ≤155 chars"),
  short: z.string().max(200, "short description must be ≤200 chars"),
  long: z.string().max(800, "long description must be ≤800 chars"),
  marketing: z.string().min(50, "marketing description must be ≥50 chars").optional(),
});

const coverSchema = z.object({
  filename: z.string(),
  dimensions: z.object({
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }),
  alt: z.string(),
});

// --- Book schema ---

export const bookSchema = z.object({
  slug: z.string().regex(slugPattern, "slug must be kebab-case (a-z, 0-9, hyphens)"),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  language: z.enum(["de", "en"]),
  authors: z.array(z.object({ ref: z.string() })).min(1),
  workTranslation: z.array(z.string()).default([]),
  translationOfWork: z.array(z.string()).default([]),
  descriptions: descriptionsSchema,
  cover: coverSchema,
  workExample: z.array(workExampleSchema).default([]),
  bisac: z.array(z.string().regex(bisacPattern, "BISAC must be 3 letters + 6 digits")),
  keywords: z.array(z.string()).default([]),
  relatedBooks: z.array(z.string()).default([]),
  knowsAbout: z.array(z.string()).default([]),
  goodreadsBookId: z.string().regex(/^\d+$/, "Goodreads ID must be numeric").optional(),
  dateModified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD"),
  reviews: z.array(z.object({
    quote: z.string(),
    source: z.string(),
    attribution: z.string().optional(),
    reviewedBookSlug: z.string().regex(slugPattern).optional(),
  })).default([]),
  mentions: z.array(z.object({
    id: z.string().url(),
  })).default([]),
  searchHints: z.object({
    de: z.string().nullable(),
    en: z.string().nullable(),
  }).optional(),
  alternateName: z.string().nullable().optional(),
});

export type Book = z.infer<typeof bookSchema>;

// --- File-level schema ---

export const booksFileSchema = z.object({
  books: z.array(bookSchema),
});

export type BooksFile = z.infer<typeof booksFileSchema>;

// --- Cross-validation ---

const PREPOSITION_STARTS = new Set([
  "Until", "Beneath", "Over", "Through", "While", "After", "Before", "During",
  "Above", "Below", "Behind", "Beyond", "Within", "Without", "Against",
  "Among", "Between", "Towards", "Across", "Beside",
  "Bis", "Unter", "Ueber", "Durch", "Waehrend", "Nach", "Vor", "Hinter",
  "Innerhalb", "Ausserhalb", "Gegen", "Zwischen",
]);

function keywordGarbageScore(
  keyword: string,
  descriptionLong: string,
  descriptionMarketing: string | undefined
): number {
  const words = keyword.trim().split(/\s+/);
  // single-word keywords cannot be sentence-fragments, even if they are prepositions
  if (words.length < 2 || words[0] === "") return 0;

  let score = 0;
  if (PREPOSITION_STARTS.has(words[0])) score += 2;
  if (words.length === 2 && words[1] && words[1][0] === words[1][0].toLowerCase()) {
    score += 1;
  }
  const haystack = `${descriptionLong} ${descriptionMarketing ?? ""}`.toLowerCase();
  if (haystack.includes(keyword.toLowerCase())) score += 1;

  return score;
}

function crossValidate(
  data: BooksFile
): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const slugs = new Set(data.books.map((b) => b.slug));
  const titleToSlug = new Map<string, string>();
  for (const b of data.books) titleToSlug.set(b.title, b.slug);

  for (const book of data.books) {
    for (const field of ["workTranslation", "translationOfWork", "relatedBooks"] as const) {
      for (const ref of book[field]) {
        if (ref === book.slug) {
          errors.push(`${book.slug}: ${field} must not contain own slug (self-reference)`);
        }
        if (!slugs.has(ref)) {
          errors.push(`${book.slug}: ${field} references unknown slug "${ref}"`);
        }
      }
    }

    for (const review of book.reviews) {
      if (review.reviewedBookSlug) {
        if (!slugs.has(review.reviewedBookSlug)) {
          errors.push(
            `${book.slug}: review.reviewedBookSlug references unknown slug "${review.reviewedBookSlug}"`
          );
        }
        if (review.reviewedBookSlug !== book.slug) {
          errors.push(
            `${book.slug}: review.reviewedBookSlug "${review.reviewedBookSlug}" differs from book slug — review belongs on the referenced book's page or should be removed`
          );
        }
      }
      if (review.attribution) {
        for (const [otherTitle, otherSlug] of titleToSlug) {
          if (otherSlug !== book.slug && review.attribution.includes(otherTitle)) {
            warnings.push(
              `${book.slug}: review.attribution mentions another book's title "${otherTitle}" — possible misattribution (set reviewedBookSlug=${otherSlug} to confirm or move review)`
            );
          }
        }
      }
    }

    for (const list of [
      { name: "keywords", values: book.keywords },
      { name: "knowsAbout", values: book.knowsAbout },
    ]) {
      for (const kw of list.values) {
        const score = keywordGarbageScore(
          kw,
          book.descriptions.long,
          book.descriptions.marketing
        );
        if (score >= 3) {
          warnings.push(
            `${book.slug}: ${list.name} contains "${kw}" (score ${score}/4) — looks like an auto-extracted fragment from descriptions, please review`
          );
        }
      }
    }
  }

  return { errors, warnings };
}

// --- Validation function ---

export function validateBooksYaml(yamlPath: string):
  | { valid: true; data: BooksFile; warnings: string[] }
  | { valid: false; errors: string[]; warnings: string[] } {
  let raw: string;
  try {
    raw = readFileSync(yamlPath, "utf-8");
  } catch (e) {
    return { valid: false, errors: [`Cannot read file: ${yamlPath}`], warnings: [] };
  }

  let parsed: unknown;
  try {
    parsed = parseYaml(raw);
  } catch (e) {
    return { valid: false, errors: [`YAML parse error: ${(e as Error).message}`], warnings: [] };
  }

  const result = booksFileSchema.safeParse(parsed);
  if (!result.success) {
    const errors = result.error.issues.map((issue) => {
      const path = issue.path.join(".");
      return `${path}: ${issue.message} (expected: ${(issue as any).expected ?? "n/a"}, received: ${(issue as any).received ?? "n/a"})`;
    });
    return { valid: false, errors, warnings: [] };
  }

  const { errors, warnings } = crossValidate(result.data);
  if (errors.length > 0) {
    return { valid: false, errors, warnings };
  }

  return { valid: true, data: result.data, warnings };
}
