# The Huke Collection

A modern gallery website for the work of **Randy Huke** and **John Huke** (1948–2016) —
paintings, works on paper, and sculpture. Built to look beautiful, load fast, rank well,
share well on social, and be effortless to update.

**Live:** https://the-huke-collection.vercel.app · Next.js + Tailwind on Vercel.

---

## ✨ The control panel — your Google Sheet

The whole gallery is driven by **one Google Sheet** — no code, no redeploys. Edits go
live in about **60 seconds**.

### Create the sheet (in your own Google account)
1. In **jaredhuke@gmail.com**, go to Google Sheets → **Blank**.
2. **File → Import → Upload** → choose `data/artworks.csv` (download it from this repo) →
   **Replace spreadsheet** → Import. All 114 works appear, pre-filled.
3. **Share → General access → “Anyone with the link → Viewer.”**
4. Copy the sheet id from its URL (`docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`).
5. In Vercel → Project → **Settings → Environment Variables**, add
   `HUKE_SHEET_ID` = your id → redeploy. Done — the site now reads your sheet.

> Until then the site shows its built-in catalog, so it always works.

### Add the drop-downs (one-time, 2 min)
Select the column, then **Data → Data validation → Add rule → Dropdown**:
- **visible** → `TRUE`, `FALSE`
- **status** → `Available`, `Sold`, `Reserved`, `NFS`
- **artist** → `Randy Huke`, `John Huke`, `John & Randy Huke`
- **rotate** → `0`, `90`, `180`, `270`

### What each column does
| Column | Controls |
|---|---|
| `id` | Internal id — **don’t change** (links the row to its image). |
| `title` | The work’s title. Many are *Untitled* — that’s fine. |
| `artist` | `Randy Huke`, `John Huke`, `John & Randy Huke`, or blank. Drives the Artist filter. |
| `year` | Year made (optional). |
| `medium` | `Painting`, `Works on Paper`, `Sculpture`, etc. Drives the Medium filter. |
| `dimensions` | e.g. `24 × 36 in`. |
| `price` | `2400` → shows **$2,400**. Any text shows as-is. Blank → **“Price on request.”** |
| `status` | `Available` / `Sold` / `Reserved` / `NFS`. `Sold` shows a badge + hides the inquire button. |
| `visible` | **`TRUE` shows it, `FALSE` hides it** — your on/off switch. |
| `featured` | `TRUE` to feature on the homepage. |
| `rotate` | `0` / `90` / `180` / `270` — fixes a sideways or upside-down photo. |
| `series` | Optional grouping (era / body of work). Becomes a filter. The collaborations seed as **Visual Conversations**. |
| `image` | Image filename (e.g. `randy-01.jpg`) **or** a full `https://…` image URL. |
| `description` | Optional paragraph shown on the work’s page. |

Reorder works by dragging sheet rows; the site follows that order.

---

## 🖼 Adding more paintings

**Easiest (no code):** add a new row in the sheet, fill in the columns, and put a public
image URL in `image` (e.g. a Google-Drive image set to “anyone with link,” or any image
host). Give it a unique `id`.

**Best quality (optimized + blur-up):** drop the photo into the source folders and, from
`site/`, run:
```bash
node scripts/process-images.mjs   # resize + organize into public/artworks
node scripts/gen-blur.mjs         # blur-up placeholders
node scripts/gen-sheet.mjs        # refresh data/artworks.csv
```
Commit & push — Vercel redeploys. Or just send the photos to Jared to add.

---

## 📨 Contact form (bot-safe)

The Inquire page submits to a serverless route that emails **rhuke@me.com** — the address
lives only on the server, never in the page, and the form has a honeypot + time-trap so
bots can’t harvest or spam it. The email includes the **artwork image** so you know which
(often *Untitled*) piece someone means.

> **One-time activation:** the first real submission triggers a confirmation email from
> FormSubmit to rhuke@me.com — click the link once to turn on delivery.

---

## 📷 Personal photos

The About-page photos of Randy & John live in `data/people.json`. Set `"visible": false`
on any you want to hide. (Ask Jared, or edit and push.)

## 🔗 Sharing

Every work has its own page (`/works/<id>`) with its own preview image, so links posted
to **Facebook** and **Pinterest** show the artwork. Share buttons are on each work page and
in the lightbox.

---

## 🛠 Local development
```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Tech
Next.js 16 (App Router) · TypeScript · Tailwind v4 · `next/image` (AVIF/WebP + blur-up) ·
Google Sheets CMS · JSON-LD, sitemap, per-work Open Graph · parallax + Ken Burns hero.

*Built with care for the Huke family. All works © the artists and their estate.*
