// Central site configuration. Safe to edit by hand.
export const site = {
  name: "The Huke Collection",
  shortName: "Huke",
  tagline: "Paintings, works on paper & sculpture by Randy and John Huke",
  description:
    "The Huke Collection presents the paintings, works on paper, and sculpture of Randy Huke and John Huke (1948–2016) — two Austin artists whose lyrical, color-driven work spans decades of independent and collaborative practice.",
  location: "Austin, Texas",
  // Production URL (update to a custom domain if/when you add one).
  url: "https://the-huke-collection.vercel.app",

  // Google Sheet "control panel". Set the HUKE_SHEET_ID env var (in Vercel) to your
  // sheet's id and the live site reads titles, prices, sold status, rotation, and
  // visibility from it, refreshing within ~60s. Blank → built-in catalog.
  // The sheet must be shared "Anyone with the link → Viewer", data in the first tab.
  sheetId: process.env.HUKE_SHEET_ID || "1STSHn4wq50gnzcKm9BZoXTli7_WPJLR3bWeqKxL7fkI",
  sheetGid: "0",
} as const;

// Inquiry destination lives server-side only (see app/api/inquire/route.ts),
// so it never appears in the browser/page source.
