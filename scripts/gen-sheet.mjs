// Builds the Google Sheet seed CSV (one row per artwork) from the manifest.
// Writes data/artworks.csv (committed, human-readable) and prints base64 to stdout
// for uploading via the Drive API.
//   node scripts/gen-sheet.mjs

import fs from "node:fs";
import path from "node:path";

const SITE = path.resolve(import.meta.dirname, "..");
const manifest = JSON.parse(
  fs.readFileSync(path.join(SITE, "data", "manifest.json"), "utf8")
);

const FEATURED = new Set([
  "selected-01", "selected-14", "selected-27", "selected-20",
  "collab-01", "collab-14", "randy-01", "john-sculpture-01",
]);

const HEADERS = [
  "id", "title", "artist", "year", "medium", "dimensions",
  "price", "status", "visible", "featured", "rotate", "series", "image", "description",
];

const esc = (v) => {
  const s = v == null ? "" : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const rows = manifest.map((m) => [
  m.id,
  "Untitled",
  m.artist,
  "",
  m.medium,
  "",
  "",
  "Available",
  "TRUE",
  FEATURED.has(m.id) ? "TRUE" : "FALSE",
  "0",
  m.group === "collab" ? "Visual Conversations" : "",
  path.basename(m.image),
  "",
]);

const csv = [HEADERS, ...rows].map((r) => r.map(esc).join(",")).join("\r\n");
fs.writeFileSync(path.join(SITE, "data", "artworks.csv"), csv);

const b64 = Buffer.from(csv, "utf8").toString("base64");
console.error(`rows: ${rows.length}, csv bytes: ${csv.length}, b64 bytes: ${b64.length}`);
process.stdout.write(b64);
