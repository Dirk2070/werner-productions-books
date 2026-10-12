// Sichtbare Warnung je gescheiterter IndexNow-Stelle (Dirk, 2026-10-12).
// Ändert NICHT, ob der Lauf rot endet – das entscheidet weiter das aufrufende Skript.
// Je Stelle eine Konsolenzeile "WARNUNG: <Stelle> nicht erreicht"; in GitHub Actions zusätzlich
// eine Annotation, damit der Ausfall am Lauf steht und nicht nur im Protokoll.

export type Gescheitert = { stelle: string; grund?: string };

export function warnzeilen(
  gescheitert: Gescheitert[],
  umgebung: Record<string, string | undefined> = process.env,
): string[] {
  const zeilen: string[] = [];
  for (const { stelle, grund } of gescheitert) {
    const text = `${stelle} nicht erreicht${grund ? ` (${grund})` : ""}`;
    zeilen.push(`WARNUNG: ${text}`);
    if (umgebung.GITHUB_ACTIONS) zeilen.push(`::warning title=IndexNow::${text}`);
  }
  return zeilen;
}
