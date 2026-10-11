import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { readFileSync } from "node:fs";
import { parse as parseYaml } from "yaml";

const SITE = "https://books.werner-productions.com";

// lastmod nur aus belegten Daten: `dateModified` je Buch aus books.yaml.
// Die Startseite listet alle Buecher, sie bekommt das juengste Datum.
// Impressum und Datenschutz tragen kein Aenderungsdatum -> kein lastmod.
const books = parseYaml(readFileSync("./books.yaml", "utf-8")).books;
const lastmodBySlug = new Map(books.map((b) => [b.slug, b.dateModified]));
const newest = [...lastmodBySlug.values()].sort().at(-1);

export default defineConfig({
  site: SITE,
  outDir: "./dist",
  build: {
    format: "directory",
  },
  integrations: [
    sitemap({
      serialize(item) {
        const path = item.url.slice(SITE.length).replace(/^\/|\/$/g, "");
        const lastmod = path === "" ? newest : lastmodBySlug.get(path);
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
  ],
});
