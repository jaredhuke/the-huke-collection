// Processes the raw Huke art photos into web-optimized images + a manifest.
// - Reads from the iCloud "Huke Art" source folders (one level above /site)
// - Skips Finder duplicates ("* 2.jpg") and the "archive" tree
// - Resizes (longest side <= 1800px) and re-encodes JPEG via macOS `sips`
// - Writes optimized files to public/artworks and a manifest to data/manifest.json
//
// Run from the /site directory:  node scripts/process-images.mjs

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const SRC = "/Users/jared.huke/Library/Mobile Documents/com~apple~CloudDocs/Code/Huke Art";
const SITE = path.resolve(import.meta.dirname, "..");
const OUT_IMG = path.join(SITE, "public", "artworks");
const OUT_ABOUT = path.join(SITE, "public", "about");
const OUT_DATA = path.join(SITE, "data");

const MAX_DIM = 1800;
const QUALITY = 70;

const IMG_RE = /\.(jpe?g|png)$/i;
const DUPE_RE = /\s2\.[^.]+$/i; // macOS "filename 2.jpg" copies
const isImage = (n) => IMG_RE.test(n) && !DUPE_RE.test(n) && !n.startsWith(".");

// group config: source dir, attribution, and slug prefix
const GROUPS = [
  // Premium studio scans (top-level CRW_*.jpg). Attribution unknown -> "" (shown as The Huke Collection).
  { id: "selected", dir: SRC, artist: "", medium: "Painting", featured: true,
    filter: (n) => /^CRW_.*\.jpg$/i.test(n) },
  { id: "randy",          dir: path.join(SRC, "Huke Art 2017/Randy Huke"),            artist: "Randy Huke",        medium: "Painting" },
  { id: "john-painting",  dir: path.join(SRC, "Huke Art 2017/John Huke/Paintings"),   artist: "John Huke",         medium: "Painting" },
  { id: "john-sculpture", dir: path.join(SRC, "Huke Art 2017/John Huke/Sculpture"),   artist: "John Huke",         medium: "Sculpture" },
  { id: "collab",         dir: path.join(SRC, "Huke Art 2017/Collbaorative"),         artist: "John & Randy Huke", medium: "Works on Paper", featured: true },
];

fs.mkdirSync(OUT_IMG, { recursive: true });
fs.mkdirSync(OUT_ABOUT, { recursive: true });
fs.mkdirSync(OUT_DATA, { recursive: true });

function sipsResize(input, output) {
  execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", String(QUALITY),
    "-Z", String(MAX_DIM), input, "--out", output], { stdio: "ignore" });
}
function dimensions(file) {
  const out = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", file], { encoding: "utf8" });
  const w = +(out.match(/pixelWidth:\s*(\d+)/)?.[1] ?? 0);
  const h = +(out.match(/pixelHeight:\s*(\d+)/)?.[1] ?? 0);
  return { w, h };
}

const manifest = [];
for (const g of GROUPS) {
  let files;
  try { files = fs.readdirSync(g.dir); } catch { console.warn("skip missing", g.dir); continue; }
  files = files
    .filter((n) => isImage(n) && (g.filter ? g.filter(n) : true))
    .filter((n) => fs.statSync(path.join(g.dir, n)).isFile())
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  files.forEach((name, i) => {
    const n = String(i + 1).padStart(2, "0");
    const slug = `${g.id}-${n}`;
    const outName = `${slug}.jpg`;
    const inPath = path.join(g.dir, name);
    const outPath = path.join(OUT_IMG, outName);
    try {
      sipsResize(inPath, outPath);
      const { w, h } = dimensions(outPath);
      manifest.push({
        id: slug,
        group: g.id,
        artist: g.artist,
        medium: g.medium,
        featured: !!g.featured,
        image: `/artworks/${outName}`,
        width: w,
        height: h,
        source: path.relative(SRC, inPath),
      });
      process.stdout.write(`✓ ${outName} (${w}x${h})\n`);
    } catch (e) {
      console.error("✗ failed", inPath, e.message);
    }
  });
}

// About-page portrait of John (vintage b&w bowler-hat photo)
const portraitSrc = path.join(SRC, "Huke Art 2017/15781566_10154007821641813_155109745238511107_n.jpg");
if (fs.existsSync(portraitSrc)) {
  try {
    execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "78",
      "-Z", "1400", portraitSrc, "--out", path.join(OUT_ABOUT, "john-huke-portrait.jpg")], { stdio: "ignore" });
    console.log("✓ about/john-huke-portrait.jpg");
  } catch (e) { console.error("portrait failed", e.message); }
}

fs.writeFileSync(path.join(OUT_DATA, "manifest.json"), JSON.stringify(manifest, null, 2));
const byGroup = manifest.reduce((a, m) => ((a[m.group] = (a[m.group] || 0) + 1), a), {});
console.log(`\nManifest: ${manifest.length} works`, byGroup);
