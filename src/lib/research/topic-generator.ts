import type { SectionMapping } from "./parse-section-map";

const HARDCODED_TOPICS: Record<string, string[]> = {
  "B0DNBSQXXL": ["Cult Psychology", "Manipulation Detection", "Thought Reform", "High-Control Groups", "Critical Thinking", "Social Influence", "Recovery from Coercion"],
  "B0CNPY5PJH": ["Inner Conflict", "Self-Reflection", "Shadow Work", "Personal Growth", "Emotional Resilience"],
  "B0DGRS4PQW": ["Simulation Hypothesis", "Reality Construction", "Consciousness", "Perception", "Speculative Philosophy"],
};

export function generateTopics(
  asin: string,
  sectionMapping: SectionMapping | undefined,
  aboutBullets: string[],
  titleTokens: string[]
): string[] {
  if (HARDCODED_TOPICS[asin]) {
    return HARDCODED_TOPICS[asin];
  }

  const topics = new Set<string>();

  if (sectionMapping) {
    for (const g of sectionMapping.genre) topics.add(g);
  }

  for (const token of titleTokens) {
    if (token.length > 4) topics.add(token);
  }

  for (const bullet of aboutBullets.slice(0, 3)) {
    const words = bullet.split(/\s+/).filter(w => w.length > 4);
    if (words.length > 0) topics.add(words.slice(0, 2).join(" "));
  }

  return [...topics].slice(0, 8);
}

export function extractTitleTokens(title: string): string[] {
  const stopwords = new Set(["the", "and", "for", "from", "with", "your", "how", "ein", "eine", "der", "die", "das", "und", "von", "zur", "zum"]);
  return title
    .split(/[\s:,—–-]+/)
    .map(w => w.replace(/[^a-zA-ZäöüÄÖÜß]/g, ""))
    .filter(w => w.length > 3 && !stopwords.has(w.toLowerCase()))
    .map(w => w.charAt(0).toUpperCase() + w.slice(1));
}
