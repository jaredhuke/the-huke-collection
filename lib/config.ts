// Central site configuration. Safe to edit by hand.
export const site = {
  name: "The Huke Collection",
  shortName: "Huke",
  tagline: "Paintings, works on paper & sculpture by Randy and John Huke",
  description:
    "The Huke Collection presents the paintings, works on paper, and sculpture of Randy Huke and her husband John Huke (1948–2016) — two Austin artists whose lyrical, color-driven work spans decades of independent and collaborative practice.",
  location: "Austin, Texas",
  // Where inquiries are sent. Change to the gallery/estate contact address.
  email: "jared.huke@daitodesign.com",
  // Production URL (updated after first Vercel deploy).
  url: "https://thehukecollection.vercel.app",

  // Google Sheet "control panel". When set (here or via the HUKE_SHEET_ID env var),
  // the live site reads titles, prices, sold status, and visibility from the sheet
  // and refreshes within ~60 seconds. Leave blank to use the built-in catalog.
  // NOTE: the sheet must be shared "Anyone with the link → Viewer" for the site to read it.
  sheetId: process.env.HUKE_SHEET_ID || "1qtO0BaMbj8tDx9ZRHWkMN9ASIns-cWboTSSS9LLF0wc",
  // The data must live in the FIRST tab (gid 0).
  sheetGid: "0",
} as const;
