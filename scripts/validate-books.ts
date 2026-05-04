import { resolve } from "path";
import { validateBooksYaml } from "../src/lib/books-schema";

const yamlPath = resolve(import.meta.dir, "..", "books.yaml");
const result = validateBooksYaml(yamlPath);

if (result.valid) {
  const count = result.data.books.length;
  const slugs = result.data.books.map((b) => b.slug).join(", ");
  console.log(`✓ books.yaml valid (${count} ${count === 1 ? "entry" : "entries"}: ${slugs})`);
  process.exit(0);
} else {
  console.error("✗ books.yaml validation failed:\n");
  for (const err of result.errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}
