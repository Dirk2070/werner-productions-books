import { loadBooks } from "../src/lib/load-books.js";

const KEY = "7f3a8c2b9d4e1f5a6c8b3d2e7f1a9c4b";
const HOST = "books.werner-productions.com";
const BASE = `https://${HOST}`;
const KEY_LOCATION = `${BASE}/${KEY}.txt`;

// IndexNow ist ein geteiltes Protokoll: api.indexnow.org verteilt an alle
// teilnehmenden Engines (Bing/Seznam/Naver/…). Yandex wird zusätzlich direkt
// angestoßen, damit die Einreichung dort garantiert ankommt.
const ENDPOINTS = [
  { name: "IndexNow (Bing/Seznam/Naver)", url: "https://api.indexnow.org/IndexNow" },
  { name: "Yandex", url: "https://yandex.com/indexnow" },
];

const books = await loadBooks();

const urlList = [
  `${BASE}/`,
  `${BASE}/impressum/`,
  `${BASE}/datenschutz/`,
  `${BASE}/llms.txt`,
  ...books.map((b) => `${BASE}/${b.slug}/`),
];

const payload = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList,
});

console.log(`Submitting ${urlList.length} URLs to ${ENDPOINTS.length} endpoints…`);

let okCount = 0;

for (const endpoint of ENDPOINTS) {
  try {
    const res = await fetch(endpoint.url, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: payload,
    });
    const body = await res.text();
    const ok = res.status === 200 || res.status === 202;
    console.log(`${ok ? "✓" : "✗"} ${endpoint.name}: HTTP ${res.status} ${res.statusText}`);
    if (body) console.log(`   ${body.trim()}`);
    if (ok) okCount++;
  } catch (err) {
    console.error(`✗ ${endpoint.name}: ${err instanceof Error ? err.message : String(err)}`);
  }
}

if (okCount > 0) {
  console.log(`✓ ${okCount}/${ENDPOINTS.length} endpoints accepted ${urlList.length} URLs`);
} else {
  console.error("✗ All IndexNow submissions failed");
  process.exit(1);
}
