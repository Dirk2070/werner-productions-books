import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://books.werner-productions.com",
  outDir: "./dist",
  build: {
    format: "directory",
  },
  integrations: [sitemap()],
});
