import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://books.werner-productions.com",
  outDir: "./dist",
  build: {
    format: "directory",
  },
});
