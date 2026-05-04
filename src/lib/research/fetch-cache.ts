import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from "fs";
import { resolve } from "path";

const CACHE_DIR = resolve(process.cwd(), ".cache/research");

export async function fetchWithCache(
  url: string,
  cacheKey: string,
  ttlMs: number
): Promise<string> {
  mkdirSync(CACHE_DIR, { recursive: true });
  const cachePath = resolve(CACHE_DIR, cacheKey);

  if (existsSync(cachePath)) {
    const age = Date.now() - statSync(cachePath).mtimeMs;
    if (age < ttlMs) {
      return readFileSync(cachePath, "utf-8");
    }
  }

  const resp = await fetch(url, {
    headers: { "User-Agent": "WernerProductionsResearch/1.0" },
  });
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status} for ${url}`);
  }
  const body = await resp.text();
  writeFileSync(cachePath, body);
  return body;
}
