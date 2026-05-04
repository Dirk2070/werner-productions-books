import { resolve } from "path";
import { watch } from "fs";
import { generateBookPages } from "../src/lib/generate-pages";
import { generateIndices } from "../src/lib/generate-indices";
import { validateBooksYaml } from "../src/lib/books-schema";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const watchMode = args.includes("--watch");
const slugFilter = args.find((a) => !a.startsWith("--"));

const rootDir = resolve(import.meta.dir, "..");
const booksYamlPath = resolve(rootDir, "books.yaml");
const outputDir = rootDir;

function timestamp(): string {
  return new Date().toLocaleTimeString("de-DE", { hour12: false });
}

function runGenerate(filterSlug?: string): boolean {
  try {
    const results = generateBookPages({
      booksYamlPath,
      outputDir,
      slugFilter: filterSlug,
      dryRun,
    });

    const changed = results.filter((r) => r.changed);
    const unchanged = results.filter((r) => !r.changed);

    for (const r of results) {
      if (r.changed) {
        const sizeStr = r.size ? ` (${(r.size / 1024).toFixed(1)}KB)` : "";
        console.log(`→ generated ${r.slug}/index.html${sizeStr}`);
      } else {
        console.log(`→ ${r.slug}/index.html (no change)`);
      }
    }

    console.log(
      `\n${results.length} books processed, ${changed.length} changed, ${unchanged.length} unchanged${dryRun ? " (dry-run)" : ""}`
    );

    // Generate indices (llms.txt + sitemap.txt) on full runs
    if (!filterSlug) {
      const indexResults = generateIndices({ booksYamlPath, outputDir, dryRun });
      for (const r of indexResults) {
        if (r.changed) {
          const sizeStr = r.size ? ` (${(r.size / 1024).toFixed(1)}KB)` : "";
          console.log(`→ generated ${r.file}${sizeStr}`);
        } else {
          console.log(`→ ${r.file} (no change)`);
        }
      }
    }

    return true;
  } catch (e) {
    console.error((e as Error).message);
    return false;
  }
}

// --- Selective build: find affected slugs ---
function findAffectedSlugs(changedSlug: string): string[] {
  const validation = validateBooksYaml(booksYamlPath);
  if (!validation.valid) return [];

  const { books } = validation.data;
  const affected = new Set<string>([changedSlug]);

  // Find books that reference the changed slug via cross-refs
  for (const book of books) {
    if (
      book.workTranslation.includes(changedSlug) ||
      book.translationOfWork.includes(changedSlug) ||
      book.relatedBooks.includes(changedSlug)
    ) {
      affected.add(book.slug);
    }
  }

  return [...affected];
}

// --- Watch mode ---
if (watchMode) {
  console.log(`[${timestamp()}] Watch mode started. Monitoring books.yaml...`);

  // Initial full build
  runGenerate();
  console.log(`[${timestamp()}] watching for changes...`);

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  watch(booksYamlPath, () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      console.log(`\n[${timestamp()}] books.yaml changed`);

      // Validate first
      console.log(`[${timestamp()}] validating ...`);
      const validation = validateBooksYaml(booksYamlPath);
      if (!validation.valid) {
        console.error(`[${timestamp()}] ✗ validation failed:`);
        validation.errors.forEach((e) => console.error(`  ${e}`));
        console.log(`[${timestamp()}] watching for changes...`);
        return;
      }
      console.log(`[${timestamp()}] ✓ valid`);

      // Full generate (selective build handled by hash-based idempotency)
      console.log(`[${timestamp()}] generating...`);
      const ok = runGenerate();
      if (ok) {
        console.log(`[${timestamp()}] ✓ done`);
      } else {
        console.log(`[${timestamp()}] ✗ generation failed`);
      }
      console.log(`[${timestamp()}] watching for changes...`);
    }, 300); // 300ms debounce
  });
} else {
  // Single run
  const ok = runGenerate(slugFilter);
  if (!ok) process.exit(1);
}
