import { readFileSync, writeFileSync, copyFileSync, existsSync } from "fs";
import { resolve } from "path";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import { bookSchema, validateBooksYaml } from "../src/lib/books-schema";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const autoMode = args.includes("--auto");
const coworkPath = args.find((a) => !a.startsWith("--"));

if (!coworkPath) {
  console.error("Usage: bun scripts/merge-cowork-output.ts <cowork-output.md> [--dry-run|--auto]");
  process.exit(1);
}

const rootDir = resolve(import.meta.dir, "..");
const booksYamlPath = resolve(rootDir, "books.yaml");
const backupPath = booksYamlPath + ".bak";
const logPath = resolve(rootDir, ".generator-merge.log");

// --- Extract YAML snippet from Cowork markdown ---
function extractYamlSnippet(markdown: string): string | null {
  const match = markdown.match(/```yaml\s*\n([\s\S]*?)```/);
  return match ? match[1] : null;
}

// --- Extract "Nicht gefunden" section ---
function extractMissing(markdown: string): string[] {
  const match = markdown.match(/##\s*Nicht gefunden\s*\n([\s\S]*?)(?=\n##|\n---|\n$)/);
  if (!match) return [];
  return match[1]
    .split("\n")
    .map((l) => l.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
}

// --- Diff two objects field by field ---
function fieldDiff(existing: any, incoming: any): { field: string; old: any; new: any }[] {
  const diffs: { field: string; old: any; new: any }[] = [];
  for (const key of Object.keys(incoming)) {
    const oldVal = JSON.stringify(existing[key]);
    const newVal = JSON.stringify(incoming[key]);
    if (oldVal !== newVal) {
      diffs.push({ field: key, old: existing[key], new: incoming[key] });
    }
  }
  return diffs;
}

// --- Log entry ---
function appendLog(entry: string) {
  const timestamp = new Date().toISOString().slice(0, 16).replace("T", " ");
  const line = `${timestamp} ${entry}\n`;
  try {
    const existing = existsSync(logPath) ? readFileSync(logPath, "utf-8") : "";
    writeFileSync(logPath, existing + line);
  } catch {}
}

// --- Main ---
function main() {
  // 1. Read cowork output
  if (!existsSync(resolve(coworkPath!))) {
    console.error(`✗ File not found: ${coworkPath}`);
    process.exit(1);
  }
  const markdown = readFileSync(resolve(coworkPath!), "utf-8");

  // 2. Extract YAML snippet
  const yamlSnippet = extractYamlSnippet(markdown);
  if (!yamlSnippet) {
    console.error("✗ No ```yaml``` block found in cowork output");
    process.exit(1);
  }

  // 3. Parse snippet
  let snippetData: any;
  try {
    snippetData = parseYaml(yamlSnippet);
  } catch (e) {
    console.error(`✗ YAML parse error in snippet: ${(e as Error).message}`);
    process.exit(1);
  }

  // Handle both { books: [...] } and bare book object
  const incomingBooks: any[] = snippetData.books
    ? snippetData.books
    : [snippetData];

  // 4. Validate each incoming book against schema
  const schemaErrors: string[] = [];
  for (const book of incomingBooks) {
    const result = bookSchema.safeParse(book);
    if (!result.success) {
      for (const issue of result.error.issues) {
        schemaErrors.push(`${book.slug || "unknown"}: ${issue.path.join(".")}: ${issue.message}`);
      }
    }
  }

  if (schemaErrors.length > 0) {
    console.error("✗ Schema validation failed for incoming snippet:\n");
    schemaErrors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }

  // 5. Show missing fields from cowork
  const missing = extractMissing(markdown);
  if (missing.length > 0) {
    console.log("⚠ Cowork reported these fields as not found:");
    missing.forEach((m) => console.log(`  - ${m}`));
    console.log("");
  }

  // 6. Load existing books.yaml
  const existingRaw = readFileSync(booksYamlPath, "utf-8");
  const existingData = parseYaml(existingRaw) as { books: any[] };
  const existingSlugs = new Map(existingData.books.map((b: any) => [b.slug, b]));

  // 7. Conflict detection + merge plan
  let hasConflict = false;
  const mergeActions: { type: "add" | "update"; slug: string; diffs?: any[] }[] = [];

  for (const book of incomingBooks) {
    const existing = existingSlugs.get(book.slug);
    if (!existing) {
      mergeActions.push({ type: "add", slug: book.slug });
      console.log(`+ ${book.slug}: new entry`);
    } else {
      const diffs = fieldDiff(existing, book);
      if (diffs.length === 0) {
        console.log(`= ${book.slug}: no changes`);
      } else {
        hasConflict = true;
        mergeActions.push({ type: "update", slug: book.slug, diffs });
        console.log(`~ ${book.slug}: ${diffs.length} field(s) differ:`);
        for (const d of diffs) {
          console.log(`    ${d.field}:`);
          console.log(`      existing: ${JSON.stringify(d.old)?.slice(0, 80)}`);
          console.log(`      incoming: ${JSON.stringify(d.new)?.slice(0, 80)}`);
        }
      }
    }
  }

  // 8. Dry-run stops here
  if (dryRun) {
    console.log("\n(dry-run — no files modified)");
    return;
  }

  // 9. Auto mode: abort on conflict
  if (hasConflict && autoMode) {
    console.error("\n✗ Conflicts detected. Use --interactive or resolve manually.");
    process.exit(1);
  }

  if (mergeActions.length === 0 || mergeActions.every((a) => a.type !== "add" && !a.diffs?.length)) {
    console.log("\n✓ Nothing to merge.");
    return;
  }

  // 10. Backup
  copyFileSync(booksYamlPath, backupPath);

  // 11. Apply merge
  for (const action of mergeActions) {
    const incoming = incomingBooks.find((b) => b.slug === action.slug)!;
    if (action.type === "add") {
      existingData.books.push(incoming);
    } else if (action.type === "update" && action.diffs && action.diffs.length > 0) {
      const idx = existingData.books.findIndex((b: any) => b.slug === action.slug);
      if (idx >= 0) {
        // Merge: incoming fields overwrite existing
        existingData.books[idx] = { ...existingData.books[idx], ...incoming };
      }
    }
  }

  // 12. Write merged books.yaml
  const mergedYaml = stringifyYaml(existingData, { lineWidth: 0 });
  writeFileSync(booksYamlPath, mergedYaml);

  // 13. Post-merge validation
  const postValidation = validateBooksYaml(booksYamlPath);
  if (!postValidation.valid) {
    console.error("\n✗ Post-merge validation FAILED — rolling back:");
    postValidation.errors.forEach((e) => console.error(`  ${e}`));
    copyFileSync(backupPath, booksYamlPath);
    console.log("✓ Rolled back to backup.");
    appendLog(`ROLLBACK: ${coworkPath} — post-merge validation failed`);
    process.exit(1);
  }

  // 14. Log
  const adds = mergeActions.filter((a) => a.type === "add").length;
  const updates = mergeActions.filter((a) => a.type === "update" && a.diffs?.length).length;
  const logEntry = `merged: ${incomingBooks.map((b) => b.slug).join(", ")} (from ${coworkPath}) — added ${adds}, updated ${updates}`;
  appendLog(logEntry);

  console.log(`\n✓ Merge complete. ${adds} added, ${updates} updated.`);
  console.log(`  Backup: ${backupPath}`);
  console.log(`  Log: ${logPath}`);
}

main();
