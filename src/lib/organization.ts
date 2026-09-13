/**
 * Der Verlagsknoten — eine Definition, von allen Graphen benutzt.
 *
 * Anlass (2026-09-13): `ORG_ID` war in `generate-book-jsonld.ts` und in
 * `generate-pages.ts` jeweils eigen definiert und wurde als `publisher`
 * verwiesen — den Knoten selbst legte keine der beiden Dateien an. 31
 * Buchseiten nannten einen Herausgeber, den keine Seite beschrieb.
 *
 * ⚠️ Die Konstante liegt hier und **nur** hier. Zwei Stellen mit derselben
 * @id laufen auseinander, und ein Verweis, dessen Ziel in einer anderen Datei
 * steht, ist genau die Bauart, die diesen Fehler erzeugt hat.
 *
 * Der Knoten wird **in jeden Graphen eingesetzt, der ihn verweist** — nicht
 * einmal zentral auf der Startseite. Grund: eine Antwortmaschine, die eine
 * einzelne Buchseite liest, löst keine @id auf, die nur auf einer anderen
 * Seite definiert ist. Seitenlokal ist die Auflösung garantiert.
 */

const BASE_URL = "https://books.werner-productions.com";

export const ORG_ID = `${BASE_URL}/#org-werner-productions`;

/**
 * Nur belegte Felder.
 *
 * `name` und `description` folgen dem llms.txt-Wortlaut („Werner Productions
 * Imprint“, `generate-indices.ts:26`), `url` dem Hub, `founder` dem
 * Autorenknoten der Startseite. **Keine Rechtsform, keine Adresse, kein
 * Gründungsdatum** — das Impressum nennt Füssen für die Praxis, nicht für den
 * Verlag, und ein plausibler Wert gäbe sich hier als belegter aus.
 */
export function organizationNode() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Werner Productions",
    description:
      "Imprint für Bücher und Hörbücher von Dirk Werner, zweisprachig (DE + EN).",
    url: "https://werner-productions.com/",
    founder: { "@id": `${BASE_URL}/#author` },
    publishingPrinciples: `${BASE_URL}/impressum/`,
  };
}
