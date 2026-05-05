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

function crossValidate(data: BooksFile): string[] {
  const errors: string[] = [];
  const slugs = new Set(data.books.map((b) => b.slug));

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
  }

  return errors;
}

// --- Validation function ---

export function validateBooksYaml(yamlPath: string):
  | { valid: true; data: BooksFile }
  | { valid: false; errors: string[] } {
  let raw: string;
  try {
    raw = readFileSync(yamlPath, "utf-8");
  } catch (e) {
    return { valid: false, errors: [`Cannot read file: ${yamlPath}`] };
  }

  let parsed: unknown;
  try {
    parsed = parseYaml(raw);
  } catch (e) {
    return { valid: false, errors: [`YAML parse error: ${(e as Error).message}`] };
  }

  const result = booksFileSchema.safeParse(parsed);
  if (!result.success) {
    const errors = result.error.issues.map((issue) => {
      const path = issue.path.join(".");
      return `${path}: ${issue.message} (expected: ${(issue as any).expected ?? "n/a"}, received: ${(issue as any).received ?? "n/a"})`;
    });
    return { valid: false, errors };
  }

  const crossErrors = crossValidate(result.data);
  if (crossErrors.length > 0) {
    return { valid: false, errors: crossErrors };
  }

  return { valid: true, data: result.data };
}
