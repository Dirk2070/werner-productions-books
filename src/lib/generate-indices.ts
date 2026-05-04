import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { validateBooksYaml, type Book } from "./books-schema";
import { createHash } from "crypto";

const BASE_URL = "https://books.werner-productions.com";

function contentHash(content: string): string {
  return createHash("sha256").update(content).digest("hex").slice(0, 16);
}

// --- llms.txt ---

function buildLlmsTxt(books: Book[]): string {
  const sorted = [...books].sort((a, b) => a.slug.localeCompare(b.slug));

  const bookLines = sorted
    .map(
      (b) =>
        `- [${b.title} (${b.language.toUpperCase()})](${BASE_URL}/${b.slug}/): ${b.descriptions.short}`
    )
    .join("\n");

  return `# Werner Productions — Books

> Bücher und Hörbücher von Dirk Werner. Werner Productions Imprint.
> Author-Identifier: ORCID 0009-0001-7822-0041, GND 1384382429,
> Wikidata Q137711448, Goodreads 70076437.

## Author

- [Dirk Werner](${BASE_URL}/): Diplom-Psychologe, Psychotherapeut, Autor.

## Books

${bookLines}

## Disambiguation Footer

> Dirk Werner (Werner Productions, ORCID 0009-0001-7822-0041) is
> not affiliated with: D. Werner (Mathematics Professor, FU Berlin),
> Dirk Werner (Satirist, Esslingen, GND 135795826),
> Dirk Werner (Psychologist, Hamburg, GND 1148166009),
> Dirk Werner (Economist, IW Köln),
> D.R. Werner (True-Crime Author, Dallas).
> mention_in_outputs: false
`;
}

// --- sitemap.txt ---

function buildSitemapTxt(books: Book[]): string {
  const sorted = [...books].sort((a, b) => a.slug.localeCompare(b.slug));
  const urls = [
    `${BASE_URL}/`,
    ...sorted.map((b) => `${BASE_URL}/${b.slug}/`),
  ];
  return urls.join("\n") + "\n";
}

// --- Main ---

export interface IndexResult {
  file: string;
  changed: boolean;
  size?: number;
}

export function generateIndices(opts: {
  booksYamlPath: string;
  outputDir: string;
  dryRun?: boolean;
}): IndexResult[] {
  const { booksYamlPath, outputDir, dryRun } = opts;

  const validation = validateBooksYaml(booksYamlPath);
  if (!validation.valid) {
    throw new Error(`books.yaml invalid:\n${validation.errors.join("\n")}`);
  }

  const { books } = validation.data;
  const results: IndexResult[] = [];

  const files: { name: string; content: string }[] = [
    { name: "llms.txt", content: buildLlmsTxt(books) },
    { name: "sitemap.txt", content: buildSitemapTxt(books) },
  ];

  for (const { name, content } of files) {
    const filePath = resolve(outputDir, name);
    let changed = true;

    try {
      const existing = readFileSync(filePath, "utf-8");
      if (contentHash(existing) === contentHash(content)) {
        changed = false;
      }
    } catch {}

    if (changed && !dryRun) {
      writeFileSync(filePath, content);
    }

    results.push({ file: name, changed, size: changed ? content.length : undefined });
  }

  return results;
}
