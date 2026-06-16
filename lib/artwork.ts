// Pure types + helpers — safe to import into client components (no data/manifest).

export type Artwork = {
  id: string;
  title: string;
  artist: string; // "Randy Huke" | "John Huke" | "John & Randy Huke" | ""
  year: string;
  medium: string; // Painting | Works on Paper | Sculpture | ...
  dimensions: string;
  price: string; // free text; "" => "Price on request"
  status: string; // Available | Sold | Reserved | NFS | ""
  visible: boolean;
  featured: boolean;
  image: string;
  width: number;
  height: number;
  description: string;
  blur?: string;
  rotate?: number; // 0 | 90 | 180 | 270 — corrects a sideways/upside-down photo
  series?: string; // optional grouping by era / body of work
};

export const ARTIST_ORDER = ["Randy Huke", "John Huke", "John & Randy Huke"];

/** Normalize any rotation value to 0/90/180/270. */
export function normRotate(r: number | undefined): 0 | 90 | 180 | 270 {
  const n = (((Math.round((r || 0) / 90) * 90) % 360) + 360) % 360;
  return n as 0 | 90 | 180 | 270;
}

export function artistLabel(a: string): string {
  return a && a.trim() ? a.trim() : "The Huke Collection";
}

export function resolveImage(src: string): string {
  if (!src) return "";
  if (/^https?:\/\//i.test(src) || src.startsWith("/")) return src;
  return `/artworks/${src}`;
}

export function isSold(a: Artwork): boolean {
  return (a.status || "").trim().toLowerCase() === "sold";
}

/** Short availability/price line shown under a work. */
export function statusLabel(a: Artwork): string {
  const s = (a.status || "").trim().toLowerCase();
  if (s === "sold") return "Sold";
  if (s === "reserved") return "Reserved";
  if (s === "nfs" || s.includes("not for sale")) return "Not for sale";
  const p = (a.price || "").trim();
  if (!p) return "Price on request";
  return /^[\d][\d.,]*$/.test(p) ? `$${p}` : p;
}

/** A single human-readable caption line, e.g. "Untitled, 1998". */
export function captionLine(a: Artwork): string {
  return a.year ? `${a.title}, ${a.year}` : a.title;
}

export function boolFrom(v: string | undefined, def: boolean): boolean {
  if (v === undefined || v === null || String(v).trim() === "") return def;
  const s = String(v).trim().toLowerCase();
  if (["false", "no", "0", "hidden", "hide", "off", "n"].includes(s)) return false;
  if (["true", "yes", "1", "visible", "show", "on", "y"].includes(s)) return true;
  return def;
}
