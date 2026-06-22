// Data layer (server): builds the catalog from the local manifest and merges in
// the live Google Sheet when configured. Import this only from Server Components.

import manifest from "@/data/manifest.json";
import { site } from "./config";
import { type Artwork, boolFrom, resolveImage } from "./artwork";

export { type Artwork } from "./artwork";

type ManifestItem = {
  id: string;
  group: string;
  artist: string;
  medium: string;
  featured: boolean;
  image: string;
  width: number;
  height: number;
  source: string;
  blur?: string;
};

// Squarespace-derived price tiers, keyed by group + artist + aspect ratio.
function defaultPrice(m: ManifestItem): string {
  const ratio = m.width / m.height;
  if (m.group === "john-sculpture") return "8000";
  if (m.group === "collab") return "1400";
  if (m.group === "randy" || (m.group === "selected" && m.artist === "Randy Huke")) return "1800";
  if (m.group === "john-painting") {
    if (ratio >= 1.8) return "1500";
    if (ratio >= 1.3) return "1200";
    if (ratio >= 0.9) return "1000";
    return "1200";
  }
  // selected John
  if (ratio >= 1.8) return "1500";
  if (ratio >= 1.1) return "1200";
  return "1000";
}

// A curated handful that anchor the homepage "Selected Works".
const FEATURED = new Set([
  "selected-01", "selected-14", "selected-27", "selected-20",
  "collab-01", "collab-14",
  "randy-01", "john-sculpture-01",
]);

// The built-in catalog (fallback + seed for the Google Sheet).
export const SEED: Artwork[] = (manifest as ManifestItem[]).map((m) => ({
  id: m.id,
  title: "Untitled",
  artist: m.artist,
  year: "",
  medium: m.medium,
  dimensions: "",
  price: defaultPrice(m),
  status: "Available",
  visible: true,
  featured: FEATURED.has(m.id),
  image: m.image,
  width: m.width,
  height: m.height,
  description: "",
  blur: m.blur,
  rotate: 0,
  // First-take series grouping: the collaborative drawings are "Visual Conversations".
  series: m.group === "collab" ? "Visual Conversations" : "",
}));

async function fetchSheet(): Promise<Record<string, string>[] | null> {
  if (!site.sheetId) return null;
  // gid targets the first tab regardless of its name (robust for an imported CSV).
  const url =
    `https://docs.google.com/spreadsheets/d/${site.sheetId}/gviz/tq` +
    `?tqx=out:json&headers=1&gid=${site.sheetGid}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const text = await res.text();
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start < 0 || end < 0) return null;
    const json = JSON.parse(text.slice(start, end + 1));
    const cols: string[] = (json.table?.cols || []).map((c: { label?: string }) =>
      String(c.label || "").trim().toLowerCase()
    );
    const rows = json.table?.rows || [];
    return rows
      .map((r: { c: ({ v?: unknown; f?: string } | null)[] }) => {
        const o: Record<string, string> = {};
        (r.c || []).forEach((cell, i) => {
          const key = cols[i];
          if (!key) return;
          o[key] = cell == null ? "" : String(cell.f ?? cell.v ?? "");
        });
        return o;
      })
      .filter((o: Record<string, string>) => o.id || o.image || o.title);
  } catch {
    return null;
  }
}

/** Merge the live Google Sheet (if configured) over the built-in catalog. */
export async function getArtworks(): Promise<Artwork[]> {
  const rows = await fetchSheet();
  if (!rows || rows.length === 0) return SEED.filter((a) => a.visible);

  const seedById = new Map(SEED.map((a) => [a.id, a]));
  const out: Artwork[] = [];
  const seen = new Set<string>();

  for (const row of rows) {
    const id = (row.id || "").trim();
    const base = (id && seedById.get(id)) || null;
    const aw: Artwork = base
      ? { ...base }
      : {
          id: id || `row-${out.length + 1}`,
          title: "Untitled", artist: "", year: "", medium: "", dimensions: "",
          price: "", status: "Available", visible: true, featured: false,
          image: "", width: 0, height: 0, description: "", rotate: 0, series: "",
        };

    const set = (k: keyof Artwork, v?: string) => {
      if (v && v.trim()) (aw as Record<string, unknown>)[k] = v.trim();
    };
    set("title", row.title);
    set("artist", row.artist);
    set("year", row.year);
    // Skip stale "Painting" in sheet when the SEED has "Mixed Media" (john-painting-* items).
    const sheetMedium = (row.medium || "").trim();
    if (sheetMedium && !(sheetMedium === "Painting" && base?.medium === "Mixed Media")) {
      set("medium", sheetMedium);
    }
    set("dimensions", row.dimensions);
    // Skip stale sheet seeds ($2,500 / $3,500 placeholders); prefer SEED prices until sheet is updated.
    const sheetPrice = (row.price || "").trim().replace(/[$,]/g, "");
    if (sheetPrice && sheetPrice !== "2500" && sheetPrice !== "3500") set("price", sheetPrice);
    set("status", row.status);
    set("description", row.description);
    set("series", row.series);
    if (row.image && row.image.trim()) aw.image = resolveImage(row.image.trim());
    aw.visible = boolFrom(row.visible, aw.visible);
    aw.featured = boolFrom(row.featured, aw.featured);
    const rot = parseInt((row.rotate || "").trim(), 10);
    if (!Number.isNaN(rot)) aw.rotate = rot;

    out.push(aw);
    if (aw.id) seen.add(aw.id);
  }
  for (const a of SEED) if (!seen.has(a.id)) out.push(a);

  return out.filter((a) => a.visible);
}

export async function getFeatured(limit = 8): Promise<Artwork[]> {
  const all = await getArtworks();
  const featured = all.filter((a) => a.featured);
  return (featured.length ? featured : all).slice(0, limit);
}
