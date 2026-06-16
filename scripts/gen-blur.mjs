// Generates tiny base64 blur-up placeholders (LQIP) for every optimized artwork
// using sharp (bundled with Next), and writes them into data/manifest.json.
// Run after process-images.mjs:  node scripts/gen-blur.mjs

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SITE = path.resolve(import.meta.dirname, "..");
const manifestPath = path.join(SITE, "data", "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

let ok = 0;
for (const m of manifest) {
  const src = path.join(SITE, "public", m.image);
  try {
    const buf = await sharp(src)
      .resize(16, null, { fit: "inside" })
      .webp({ quality: 28, effort: 6 })
      .toBuffer();
    m.blur = `data:image/webp;base64,${buf.toString("base64")}`;
    ok++;
  } catch (e) {
    console.error("blur failed", m.id, e.message);
    delete m.blur;
  }
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
const avg = Math.round(
  manifest.reduce((a, m) => a + (m.blur?.length || 0), 0) / manifest.length
);
console.log(`Added blur placeholders to ${ok}/${manifest.length} items.`);
console.log(`Average blur length: ${avg} chars`);
