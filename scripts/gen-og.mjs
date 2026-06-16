// Builds a 1200x630 Open Graph / social share image at public/og.jpg.
// Run:  node scripts/gen-og.mjs

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SITE = path.resolve(import.meta.dirname, "..");
const hero = path.join(SITE, "public", "artworks", "selected-14.jpg");
const out = path.join(SITE, "public", "og.jpg");

const W = 1200, H = 630, ART_W = 560;

const art = await sharp(fs.existsSync(hero) ? hero : path.join(SITE, "public", "artworks", "selected-01.jpg"))
  .resize(ART_W, H, { fit: "cover", position: "attention" })
  .toBuffer();

const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W - ART_W}" height="${H}" fill="#f5f2ec"/>
  <text x="70" y="150" font-family="Georgia, 'Times New Roman', serif" font-size="21" letter-spacing="7" fill="#a39c8b">THE HUKE COLLECTION</text>
  <text x="66" y="262" font-family="Georgia, 'Times New Roman', serif" font-size="76" fill="#1c1a16">Randy &amp; John</text>
  <text x="66" y="346" font-family="Georgia, 'Times New Roman', serif" font-size="76" fill="#1c1a16">Huke</text>
  <text x="70" y="420" font-family="Georgia, 'Times New Roman', serif" font-size="25" fill="#6f6a60">Paintings &#183; Works on Paper &#183; Sculpture</text>
  <line x1="70" y1="470" x2="180" y2="470" stroke="#8a3b2c" stroke-width="2"/>
  <text x="70" y="520" font-family="Georgia, 'Times New Roman', serif" font-size="19" letter-spacing="3" fill="#a39c8b">AUSTIN, TEXAS &#183; 1948&#8211;2016</text>
</svg>`;

await sharp({ create: { width: W, height: H, channels: 3, background: "#f5f2ec" } })
  .composite([
    { input: art, left: W - ART_W, top: 0 },
    { input: Buffer.from(svg), left: 0, top: 0 },
  ])
  .jpeg({ quality: 88 })
  .toFile(out);

console.log("Wrote", path.relative(SITE, out));
