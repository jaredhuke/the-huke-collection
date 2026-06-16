# The Huke Collection

A modern gallery website for the work of **Randy Huke** and **John Huke** (1948–2016) —
paintings, works on paper, and sculpture. Built to look beautiful, load fast, rank well,
and be effortless to update.

Live site: _set after first deploy_ · Built with Next.js + Tailwind, hosted on Vercel.

---

## ✨ Updating the site — the Google Sheet

You control the whole gallery from **one Google Sheet** — no code, no redeploys.
Edits appear on the live site within about **60 seconds**.

**Your sheet:** [The Huke Collection — Artworks](https://docs.google.com/spreadsheets/d/1qtO0BaMbj8tDx9ZRHWkMN9ASIns-cWboTSSS9LLF0wc/edit)

### ⚠️ One-time setup (required to make the sheet live)
The sheet must be readable by the website. Open the sheet → **Share** →
under **General access** choose **“Anyone with the link” → Viewer** → Done.
(Until you do this, the site shows its built-in catalog — it still works perfectly.)

### What each column does
| Column | What it controls |
|---|---|
| `id` | Internal id — **don’t change** (links the row to its image). |
| `title` | The work’s title (e.g. *Untitled*, *Blue Field*). |
| `artist` | `Randy Huke`, `John Huke`, `John & Randy Huke`, or blank. Drives the Artist filter. |
| `year` | Year made (optional). |
| `medium` | `Painting`, `Works on Paper`, `Sculpture`, etc. Drives the Medium filter. |
| `dimensions` | e.g. `24 × 36 in`. |
| `price` | A number like `2400` shows as **$2,400**. Any text shows as-is. Blank → **“Price on request.”** |
| `status` | `Available`, `Sold`, `Reserved`, or `NFS`. `Sold` shows a **Sold** badge and hides the inquire button. |
| `visible` | `TRUE` to show the work, `FALSE` to hide it. **This is your on/off switch.** |
| `featured` | `TRUE` to feature it on the homepage “Selected Works.” |
| `image` | Image filename (e.g. `randy-01.jpg`). You can also paste a full `https://…` image URL. |
| `description` | Optional paragraph shown in the work’s detail view. |

### Common tasks
- **Hide a painting:** set `visible` to `FALSE`.
- **Mark one sold:** set `status` to `Sold`.
- **Set a price:** type a number in `price` (e.g. `1800`).
- **Reorder works:** drag the sheet rows up/down — the site follows that order.
- **Feature on homepage:** set `featured` to `TRUE` (keep it to ~6–9 for a clean look).

---

## 🖼 Adding new artwork

1. Add the new photo(s) somewhere under the source folders the build reads
   (see `scripts/process-images.mjs` for the exact paths).
2. From `site/`, regenerate the optimized images, placeholders, and sheet seed:
   ```bash
   node scripts/process-images.mjs   # resize + organize into public/artworks
   node scripts/gen-blur.mjs         # tiny blur-up placeholders
   node scripts/gen-sheet.mjs        # refresh data/artworks.csv
   ```
3. Commit and push — Vercel redeploys automatically. Add titles/prices in the sheet.

> Prefer not to touch code? You can also just paste a public image URL into the sheet’s
> `image` column for a new row.

---

## 🛠 Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## 🚀 Deploying

Hosted on **Vercel**. Pushing to the `main` branch on GitHub triggers a new deploy.

Optional environment variable (otherwise the ID baked into `lib/config.ts` is used):

| Variable | Value |
|---|---|
| `HUKE_SHEET_ID` | `1qtO0BaMbj8tDx9ZRHWkMN9ASIns-cWboTSSS9LLF0wc` |

After your first deploy, update `url` in `lib/config.ts` to your real domain so SEO,
sitemap, and social-share previews point at the right place.

---

## Tech

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · `next/image` (AVIF/WebP,
blur-up placeholders) · Google Sheets as a live CMS · JSON-LD, sitemap & Open Graph for SEO.

*Built with care for the Huke family. All works © the artists and their estate.*
