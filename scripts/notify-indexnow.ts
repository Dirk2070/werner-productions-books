import { loadBooks } from "../src/lib/load-books.js";

const KEY = "7f3a8c2b9d4e1f5a6c8b3d2e7f1a9c4b";
const HOST = "books.werner-productions.com";
const BASE = `https://${HOST}`;
const KEY_LOCATION = `${BASE}/${KEY}.txt`;

const books = await loadBooks();

const urlList = [
  `${BASE}/`,
  `${BASE}/impressum/`,
  `${BASE}/datenschutz/`,
  `${BASE}/llms.txt`,
  ...books.map((b) => `${BASE}/${b.slug}/`),
];

console.log(`Submitting ${urlList.length} URLs to IndexNow…`);

const res = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Host": "api.indexnow.org",
  },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  }),
});

const body = await res.text();
console.log(`IndexNow API responded ${res.status} ${res.statusText}`);
if (body) console.log(body);

if (res.status === 200 || res.status === 202) {
  console.log(`✓ IndexNow notified for ${urlList.length} URLs`);
} else {
  console.error(`✗ IndexNow submission failed`);
  process.exit(1);
}
