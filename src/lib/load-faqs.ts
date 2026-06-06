import { readFileSync } from "fs";
import { resolve } from "path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Schema — mirrors Asset-YAMLs/assets/faqs.yaml (Phase A spec)
// ---------------------------------------------------------------------------

const hubFaqSchema = z.object({
  id: z.string().min(1),
  q_de: z.string().min(1),
  q_en: z.string().min(1),
  a_short_de: z.string().min(1),
  a_long_de: z.string().min(1),
  a_short_en: z.string().min(1),
  a_long_en: z.string().min(1),
});

export type HubFaq = z.infer<typeof hubFaqSchema>;

const faqsFileSchema = z.object({
  hub_faqs: z.array(hubFaqSchema),
  books_faqs: z.array(z.unknown()).default([]),
});

// ---------------------------------------------------------------------------
// Loader
// ---------------------------------------------------------------------------

export function loadFaqs(): HubFaq[] {
  const yamlPath = resolve(process.cwd(), "data/faqs.yaml");
  const raw = readFileSync(yamlPath, "utf-8");
  const parsed = parseYaml(raw);
  const result = faqsFileSchema.safeParse(parsed);
  if (!result.success) {
    const errors = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
    throw new Error(`data/faqs.yaml validation failed:\n${errors.join("\n")}`);
  }

  const faqs = result.data.hub_faqs;

  // Validate id uniqueness
  const ids = faqs.map((f) => f.id);
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) {
      throw new Error(`data/faqs.yaml: duplicate FAQ id "${id}"`);
    }
    seen.add(id);
  }

  return faqs;
}
