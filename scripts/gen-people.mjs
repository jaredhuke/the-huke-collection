// Processes personal/portrait photos for the About page: auto-orients (EXIF),
// resizes, writes to public/about, and emits data/people.json with dims + blur.
//   node scripts/gen-people.mjs

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SITE = path.resolve(import.meta.dirname, "..");
const SRC_ROOT = "/Users/jared.huke/Library/Mobile Documents/com~apple~CloudDocs/Code/Huke Art";
const OUT = path.join(SITE, "public", "about");
fs.mkdirSync(OUT, { recursive: true });

const PHOTOS_LIB = "/Users/jared.huke/Pictures/Photos Library.photoslibrary/originals";
// id, source path, caption, default visibility
const ITEMS = [
  { id: "randy-portrait", src: `${PHOTOS_LIB}/A/A1A1BBBC-59AB-4D22-B7C3-E8EDE3DC1C8A.jpeg`, caption: "Randy Huke", visible: true },
  { id: "john-portrait", src: path.join(SRC_ROOT, "Huke Art 2017/15781566_10154007821641813_155109745238511107_n.jpg"), caption: "John Huke", visible: true },
  { id: "john-portrait-2", src: `${PHOTOS_LIB}/D/D1DDABFD-815A-4FF7-BCD9-219C6FB5B6D5.jpeg`, caption: "John Huke", visible: true },
  { id: "couple-table", src: "/tmp/hukephotos/about_given.jpg", caption: "Randy & John Huke", visible: true },
  { id: "couple-hills", src: "/tmp/hukephotos/recent_62BF8376-DF4F-44D9-A31E-36D36DE9C424_1_201_a.jpg", caption: "Randy & John Huke", visible: true },
  { id: "couple-roses", src: path.join(SRC_ROOT, "Huke Art 2017/IMG_2280.jpg"), caption: "Randy & John Huke", visible: true },
];

const out = [];
for (const it of ITEMS) {
  if (!fs.existsSync(it.src)) { console.warn("missing", it.src); continue; }
  const file = `${it.id}.jpg`;
  const dest = path.join(OUT, file);
  const meta = await sharp(it.src)
    .rotate() // auto-orient from EXIF
    .resize(1700, 1700, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 74, mozjpeg: true })
    .toFile(dest);
  const blurBuf = await sharp(it.src).rotate().resize(16, null, { fit: "inside" }).webp({ quality: 28 }).toBuffer();
  out.push({
    id: it.id,
    image: `/about/${file}`,
    caption: it.caption,
    visible: it.visible,
    width: meta.width,
    height: meta.height,
    blur: `data:image/webp;base64,${blurBuf.toString("base64")}`,
  });
  console.log(`✓ ${file} ${meta.width}x${meta.height}`);
}

fs.writeFileSync(path.join(SITE, "data", "people.json"), JSON.stringify(out, null, 2));
console.log(`Wrote data/people.json (${out.length} photos)`);
