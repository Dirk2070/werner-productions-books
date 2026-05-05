import { readFileSync } from "fs";
import { resolve } from "path";
import { parse as parseYaml } from "yaml";
import { booksFileSchema, type Book } from "./books-schema.js";

export type { Book };

export async function loadBooks(): Promise<Book[]> {
  const yamlPath = resolve(process.cwd(), "books.yaml");
  const raw = readFileSync(yamlPath, "utf-8");
  const parsed = parseYaml(raw);
  const result = booksFileSchema.safeParse(parsed);
  if (!result.success) {
    const errors = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
    throw new Error(`books.yaml validation failed:\n${errors.join("\n")}`);
  }
  return result.data.books;
}
