export function cleanTitle(raw: string): string {
  return raw
    .replace(/\s*\((English|German|Englische|Deutsche)\s+(Edition|Ausgabe)\)\s*$/i, "")
    .replace(/\s*\(English\)\s*$/i, "")
    .replace(/\s*\(Deutsch\)\s*$/i, "")
    .trim();
}
