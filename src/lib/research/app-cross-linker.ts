import { normalize } from "./slug-utils";
import type { AppMatch } from "./types";

export interface AppEntry {
  id: string;
  slug: string;
  name: string;
  topics: string[];
}

const SYNONYM_MAP: Record<string, string[]> = {
  "schattenarbeit": ["shadow work", "inner work"],
  "manipulation detection": ["manipulation", "manipulationserkennung"],
  "selbstsabotage": ["self-sabotage"],
  "mindfulness": ["achtsamkeit"],
  "cult psychology": ["sekten-psychologie"],
  "selbstreflexion": ["self-reflection"],
  "persoenlichkeit": ["personality"],
};

function synonymMatch(topic: string, appTopics: string[]): boolean {
  const normTopic = normalize(topic);
  for (const [key, synonyms] of Object.entries(SYNONYM_MAP)) {
    const allForms = [key, ...synonyms].map(normalize);
    if (allForms.includes(normTopic)) {
      return appTopics.some(at => allForms.includes(normalize(at)));
    }
  }
  return false;
}

export function calculateAppMatches(
  bookTopics: string[],
  apps: AppEntry[]
): AppMatch[] {
  return apps
    .map(app => ({
      id: app.id,
      slug: app.slug,
      name: app.name,
      overlap: bookTopics.filter(t =>
        app.topics.some(at => normalize(at) === normalize(t)) ||
        synonymMatch(t, app.topics)
      ).length,
    }))
    .filter(m => m.overlap >= 2)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 3);
}
