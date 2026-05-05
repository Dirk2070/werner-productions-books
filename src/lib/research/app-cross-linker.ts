import { normalize } from "./slug-utils";
import type { AppMatch } from "./types";

export interface AppEntry {
  id: string;
  slug: string;
  name: string;
  topics: string[];
}

// ---------------------------------------------------------------------------
// Synonym map: canonical topic name → list of text synonyms to search for
// in description haystack. Keys are app topic names (from identity.yaml).
// ---------------------------------------------------------------------------

const TOPIC_SYNONYMS: Record<string, string[]> = {
  // Shadow Integrator
  "Schattenarbeit": ["shadow work", "shadow integration", "jungian shadow", "inner shadow", "schattenarbeit"],
  "schattenarbeit": ["shadow work", "shadow integration", "jungian shadow", "inner shadow"],
  "Jung'sche Psychologie": ["jungian", "jung", "carl jung", "individuation", "archetypes", "archetype"],
  "Manipulation Detection": ["manipulation", "manipulative", "coercion", "control", "cult"],
  "manipulation detection": ["manipulation", "manipulationserkennung", "manipulierend"],
  "Selbstsabotage": ["self-sabotage", "self sabotage", "sabotaging", "selbstsabotage"],
  "selbstsabotage": ["self-sabotage", "self sabotage", "sabotaging"],
  "cult psychology": ["sekten-psychologie", "cult", "cults", "sekte", "sekten"],
  "Selbstreflexion": ["self-reflection", "self reflection", "selbstreflexion"],
  "selbstreflexion": ["self-reflection", "self reflection"],
  // PsyProfiler
  "Persönlichkeit": ["personality", "personality traits", "personality test", "persönlichkeit"],
  "persoenlichkeit": ["personality", "personality traits"],
  "Emotionale Intelligenz": ["emotional intelligence", "eq", "emotional intelligen", "emotionale intelligenz"],
  "Achtsamkeit": ["mindfulness", "mindful", "awareness", "achtsamkeit"],
  "mindfulness": ["achtsamkeit", "mindful", "meditation"],
  // InsightVUE
  "Wahrnehmung": ["perception", "perceptual", "wahrnehmung"],
  "Symbolanalyse": ["symbol", "symbolic", "symbolism", "iconography", "symbolanalyse"],
  "Realitätskonstruktion": ["reality", "simulation", "matrix", "realität"],
  // SundaMind
  "Mustererkennung": ["pattern recognition", "patterns", "muster"],
};

// ---------------------------------------------------------------------------
// Topic-based matching (original approach — used when no description text)
// ---------------------------------------------------------------------------

function synonymMatch(topic: string, appTopics: string[]): boolean {
  const normTopic = normalize(topic);
  for (const [key, synonyms] of Object.entries(TOPIC_SYNONYMS)) {
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

// ---------------------------------------------------------------------------
// Text-based matching: app-keyed keyword patterns scan haystack directly.
// Bypasses topic-normalization (identity.yaml topics are kebab-case English,
// don't normalize cleanly to free-text matches). Each app has a curated pattern
// list. Threshold: ≥2 distinct pattern hits → app included.
// ---------------------------------------------------------------------------

const APP_KEYWORD_PATTERNS: Record<string, string[]> = {
  shadow_integrator: [
    "shadow work", "shadow integration", "inner shadow", "schattenarbeit",
    "shadow self", "shadow aspect",
    "jungian", "jung", "carl jung", "individuation", "archetype",
    "self-sabotage", "selbstsabotage", "self-rejection", "self-criticism",
    "manipulation", "manipulative", "coercion", "cult ", "cults", "sekte",
    "self-reflection", "selbstreflexion",
    "inner conflict", "inner struggle", "inner work",
    "depth psychology", "tiefenpsychologie",
    "perfectionism", "perfection",
  ],
  psyprofiler: [
    "personality test", "personality trait", "persönlichkeit",
    "emotional intelligence", "emotionale intelligenz", "emotional",
    "mindfulness", "achtsamkeit", "mindful",
    "self-knowledge", "selbsterkenntnis", "self-awareness",
    "psychometric", "psychological assessment", "psychological",
    "psychology", "psyche", "psychotherapy", "psychotherapist", "psychotherapeut",
    "self-help", "selbsthilfe", "self-improvement", "personal growth",
    "self-love", "selbstliebe", "self-esteem", "self-worth", "selbstwert",
    "personal beliefs",
  ],
  insightvue: [
    "perception", "wahrnehmung",
    "symbol", "symbolic", "symbolism", "iconography", "symbolanalyse",
    "image analysis", "bildanalyse",
    "reality construction", "simulation", "matrix",
  ],
  sundamind: [
    "mindfulness", "meditation", "achtsamkeit",
    "pattern recognition", "mustererkennung",
    "habit", "gewohnheit",
  ],
  // clear_arrows: unreleased game — intentionally omitted to suppress mention matches
};

function countPatternMatches(patterns: string[], haystackLower: string): number {
  // Count distinct patterns that appear (each pattern counts at most once)
  return patterns.filter(p => haystackLower.includes(p.toLowerCase())).length;
}

// Genre-override: every Thriller/Mystery/Crime book gets psyprofiler + shadow-integrator
// regardless of haystack matches. Rationale: PsyProfiler measures personality structures
// (incl. dark-triad) and Shadow Integrator addresses shadow aspects — both are inherently
// relevant for any thriller/mystery/crime narrative.
const THRILLER_BISAC_PREFIXES = ["FIC022", "FIC031", "FIC050"]; // Mystery, Thrillers, Crime
const THRILLER_FORCE_APPS = ["shadow_integrator", "psyprofiler"];

function isThrillerLike(bisac: string[]): boolean {
  return bisac.some(code => THRILLER_BISAC_PREFIXES.some(prefix => code.startsWith(prefix)));
}

/**
 * Calculate app matches from free-text description haystack.
 * haystack = descriptions.long + goodreads forLong + book.keywords
 *
 * If bisac indicates Thriller/Mystery/Crime, force-include psyprofiler + shadow-integrator.
 */
export function calculateAppMatchesFromText(
  descriptionHaystack: string,
  apps: AppEntry[],
  bisac: string[] = []
): AppMatch[] {
  const haystackLower = descriptionHaystack.toLowerCase();
  const forceThriller = isThrillerLike(bisac);

  const matches = apps.map(app => {
    const patterns = APP_KEYWORD_PATTERNS[app.slug] ?? APP_KEYWORD_PATTERNS[app.id] ?? [];
    let overlap = patterns.length > 0
      ? countPatternMatches(patterns, haystackLower)
      : app.topics.filter(t => haystackLower.includes(t.toLowerCase())).length;

    // Genre-override boost: thriller-like books always reach the threshold for these apps
    if (forceThriller && THRILLER_FORCE_APPS.includes(app.slug)) {
      overlap = Math.max(overlap, 2);
    }

    return {
      id: app.id,
      slug: app.slug,
      name: app.name,
      overlap,
    };
  });

  return matches
    .filter(m => m.overlap >= 2)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 3);
}
