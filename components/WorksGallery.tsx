"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type Artwork,
  ARTIST_ORDER,
  artistLabel,
  captionLine,
  isSold,
  normRotate,
  statusLabel,
} from "@/lib/artwork";
import { site } from "@/lib/config";
import ArtImage from "@/components/ArtImage";
import ShareButtons from "@/components/ShareButtons";

const MEDIUM_ORDER = ["Painting", "Works on Paper", "Sculpture"];

type Block =
  | { kind: "grid"; cols: 2 | 3; items: Artwork[] }
  | { kind: "spot"; item: Artwork; flip: boolean };

/** Break the list into a varied editorial rhythm: alternating 2-up / 3-up masonry
 *  chapters with full-width spotlight features between them. */
function buildBlocks(items: Artwork[]): Block[] {
  const blocks: Block[] = [];
  let i = 0;
  let cycle = 0;
  while (i < items.length) {
    const dense = cycle % 2 === 1;
    const chunk = dense ? 12 : 8;
    blocks.push({ kind: "grid", cols: dense ? 3 : 2, items: items.slice(i, i + chunk) });
    i += chunk;
    if (i < items.length - 1) {
      blocks.push({ kind: "spot", item: items[i], flip: cycle % 2 === 1 });
      i += 1;
    }
    cycle++;
  }
  return blocks;
}

export default function WorksGallery({ artworks }: { artworks: Artwork[] }) {
  const [artist, setArtist] = useState("All");
  const [medium, setMedium] = useState("All");
  const [series, setSeries] = useState("All");
  const [activeId, setActiveId] = useState<string | null>(null);

  const artists = useMemo(() => {
    const present = new Set(artworks.map((a) => a.artist).filter(Boolean));
    return ["All", ...ARTIST_ORDER.filter((a) => present.has(a))];
  }, [artworks]);

  const mediums = useMemo(() => {
    const present = Array.from(new Set(artworks.map((a) => a.medium).filter(Boolean)));
    present.sort((a, b) => (MEDIUM_ORDER.indexOf(a) + 1 || 99) - (MEDIUM_ORDER.indexOf(b) + 1 || 99));
    return ["All", ...present];
  }, [artworks]);

  const seriesList = useMemo(() => {
    const present = Array.from(new Set(artworks.map((a) => (a.series || "").trim()).filter(Boolean)));
    present.sort();
    return present.length ? ["All", ...present] : [];
  }, [artworks]);

  const filtered = useMemo(
    () =>
      artworks.filter(
        (a) =>
          (artist === "All" || a.artist === artist) &&
          (medium === "All" || a.medium === medium) &&
          (series === "All" || (a.series || "").trim() === series)
      ),
    [artworks, artist, medium, series]
  );

  const blocks = useMemo(() => buildBlocks(filtered), [filtered]);

  useEffect(() => setActiveId(null), [artist, medium, series]);

  const index = activeId == null ? -1 : filtered.findIndex((a) => a.id === activeId);
  const active = index < 0 ? null : filtered[index];
  const close = useCallback(() => setActiveId(null), []);
  const go = useCallback(
    (dir: number) =>
      setActiveId((cur) => {
        if (cur == null) return cur;
        const ix = filtered.findIndex((a) => a.id === cur);
        if (ix < 0) return cur;
        return filtered[(ix + dir + filtered.length) % filtered.length].id;
      }),
    [filtered]
  );

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, go]);

  const Chip = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-[0.72rem] uppercase tracking-[0.14em] transition-colors ${
        selected ? "border-ink bg-ink text-bg" : "border-hairline text-muted hover:border-ink hover:text-ink"
      }`}
    >
      {label}
    </button>
  );

  const FilterRow = ({ label, items, value, set }: { label: string; items: string[]; value: string; set: (v: string) => void }) => (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 hidden w-16 text-[0.7rem] uppercase tracking-[0.2em] text-faint sm:inline">{label}</span>
      {items.map((it) => (
        <Chip key={it} label={it} selected={value === it} onClick={() => set(it)} />
      ))}
    </div>
  );

  return (
    <div>
      <div className="flex flex-col gap-4 border-y border-hairline py-5">
        <FilterRow label="Artist" items={artists} value={artist} set={setArtist} />
        {mediums.length > 2 && <FilterRow label="Medium" items={mediums} value={medium} set={setMedium} />}
        {seriesList.length > 0 && <FilterRow label="Series" items={seriesList} value={series} set={setSeries} />}
      </div>

      <p className="mt-5 text-[0.72rem] uppercase tracking-[0.2em] text-faint">
        {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
      </p>

      <div className="mt-8 space-y-14 sm:space-y-24">
        {blocks.map((b, bi) =>
          b.kind === "grid" ? (
            <div
              key={bi}
              className={`columns-1 gap-6 sm:columns-2 sm:gap-8 ${b.cols === 3 ? "lg:columns-3" : "lg:columns-2"}`}
            >
              {b.items.map((a, j) => (
                <GalleryCard
                  key={a.id}
                  a={a}
                  priority={bi === 0 && j < 4}
                  onOpen={() => setActiveId(a.id)}
                />
              ))}
            </div>
          ) : (
            <Spotlight key={bi} a={b.item} flip={b.flip} onOpen={() => setActiveId(b.item.id)} />
          )
        )}
      </div>

      {filtered.length === 0 && <p className="py-24 text-center text-muted">No works match this selection.</p>}

      {active && (
        <div
          className="lb-fade fixed inset-0 z-[60] flex flex-col bg-ink/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${captionLine(active)} by ${artistLabel(active.artist)}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="flex shrink-0 items-center justify-between px-5 py-4 text-bg/70 sm:px-8">
            <span className="text-[0.72rem] uppercase tracking-[0.2em]">
              {index + 1} / {filtered.length}
            </span>
            <button
              type="button"
              onClick={close}
              className="-mr-2 flex items-center gap-2 p-2 text-[0.72rem] uppercase tracking-[0.2em] transition-colors hover:text-bg"
            >
              Close <span className="text-lg leading-none">&times;</span>
            </button>
          </div>

          <div
            className="flex flex-1 flex-col overflow-hidden lg:flex-row"
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="relative flex-1 cursor-zoom-out px-4 pb-4 lg:px-10 lg:pb-10"
            >
              <span className="relative block h-full min-h-[42vh] w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={active.image}
                  alt={`${active.title} — ${artistLabel(active.artist)}`}
                  className="absolute inset-0 h-full w-full object-contain"
                  style={{ transform: `rotate(${normRotate(active.rotate)}deg)` }}
                />
              </span>
            </button>

            <aside
              className="shrink-0 overflow-y-auto border-t border-bg/10 bg-ink px-6 py-7 text-bg lg:w-[360px] lg:border-l lg:border-t-0 lg:px-9 lg:py-12"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-[0.7rem] uppercase tracking-[0.24em] text-bg/45">{artistLabel(active.artist)}</p>
              <h2 className="mt-3 font-display text-3xl italic leading-tight">{active.title}</h2>

              <dl className="mt-7 space-y-3 text-sm text-bg/75">
                {active.year && <Row label="Year" value={active.year} />}
                {active.medium && <Row label="Medium" value={active.medium} />}
                {active.dimensions && <Row label="Dimensions" value={active.dimensions} />}
                {active.series && <Row label="Series" value={active.series} />}
                <Row label="Availability" value={statusLabel(active)} />
                <Row label="Ref" value={`#${active.id}`} />
              </dl>

              {active.description && <p className="mt-7 text-sm leading-relaxed text-bg/70">{active.description}</p>}

              <div className="mt-8 flex flex-col gap-4">
                {!isSold(active) && (
                  <Link
                    href={`/inquire?work=${encodeURIComponent(`${captionLine(active)} — ${artistLabel(active.artist)}`)}&img=${encodeURIComponent(active.image)}`}
                    className="inline-flex items-center justify-center border border-bg/40 px-6 py-3 text-[0.72rem] uppercase tracking-[0.2em] transition-colors hover:bg-bg hover:text-ink"
                  >
                    Inquire about this work
                  </Link>
                )}
                <Link href={`/works/${active.id}`} className="link-underline w-fit text-[0.72rem] uppercase tracking-[0.2em] text-bg/70 hover:text-bg">
                  Open full page ↗
                </Link>
                <div className="border-t border-bg/10 pt-4">
                  <ShareButtons
                    url={`${site.url}/works/${active.id}`}
                    image={`${site.url}${active.image}`}
                    title={`${captionLine(active)} — ${artistLabel(active.artist)}, The Huke Collection`}
                  />
                </div>
              </div>
            </aside>
          </div>

          {filtered.length > 1 && (
            <>
              <NavArrow side="left" onClick={(e) => { e.stopPropagation(); go(-1); }} />
              <NavArrow side="right" onClick={(e) => { e.stopPropagation(); go(1); }} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function GalleryCard({ a, onOpen, priority = false }: { a: Artwork; onOpen: () => void; priority?: boolean }) {
  return (
    <button
      onClick={onOpen}
      className="group mb-6 block w-full break-inside-avoid text-left sm:mb-8"
      aria-label={`View ${captionLine(a)} by ${artistLabel(a.artist)}`}
    >
      <div className="relative overflow-hidden">
        <ArtImage
          image={a.image}
          width={a.width}
          height={a.height}
          blur={a.blur}
          rotate={a.rotate}
          priority={priority}
          alt={`${a.title} — ${artistLabel(a.artist)}${a.medium ? `, ${a.medium}` : ""}`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="bg-surface"
          imgClassName="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.035]"
        />
        {isSold(a) && (
          <span className="absolute left-0 top-4 z-10 bg-accent px-3 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-white">
            Sold
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="font-display text-lg italic leading-snug">{captionLine(a)}</p>
        <p className="mt-0.5 text-[0.78rem] text-muted">
          {artistLabel(a.artist)}
          {a.medium ? ` · ${a.medium}` : ""}
        </p>
        {(isSold(a) || (a.price && a.price.trim())) && (
          <p className="mt-0.5 text-[0.78rem] text-faint">{statusLabel(a)}</p>
        )}
        <p className="mt-1 text-[0.65rem] tabular-nums tracking-[0.08em] text-faint/60">#{a.id}</p>
      </div>
    </button>
  );
}

function Spotlight({ a, flip, onOpen }: { a: Artwork; flip: boolean; onOpen: () => void }) {
  return (
    <section className="-mx-5 border-y border-hairline bg-surface px-5 py-12 sm:-mx-8 sm:px-8 sm:py-16">
      <div className="grid items-center gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        <button
          type="button"
          onClick={onOpen}
          aria-label={`View ${captionLine(a)} by ${artistLabel(a.artist)}`}
          className={`group block ${flip ? "lg:order-2" : ""}`}
        >
          <ArtImage
            image={a.image}
            width={a.width}
            height={a.height}
            blur={a.blur}
            rotate={a.rotate}
            alt={`${a.title} — ${artistLabel(a.artist)}`}
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="bg-bg"
            imgClassName="transition-transform duration-[1.4s] ease-out group-hover:scale-[1.03]"
          />
        </button>
        <div className={flip ? "lg:order-1" : ""}>
          <p className="eyebrow">
            {artistLabel(a.artist)}
            {a.medium ? ` · ${a.medium}` : ""}
          </p>
          <h3 className="mt-3 font-display text-4xl italic leading-tight sm:text-5xl">{captionLine(a)}</h3>
          {a.description && <p className="mt-5 max-w-md leading-relaxed text-muted">{a.description}</p>}
          <p className="mt-5 text-sm text-faint">{statusLabel(a)}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onOpen}
              className="group inline-flex items-center gap-3 bg-ink px-7 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-bg transition-colors hover:bg-accent"
            >
              View work
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
            <Link
              href={`/works/${a.id}`}
              className="link-underline inline-flex items-center py-4 text-[0.72rem] uppercase tracking-[0.2em] text-muted hover:text-ink"
            >
              Full page ↗
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 border-b border-bg/10 pb-3">
      <dt className="text-[0.7rem] uppercase tracking-[0.16em] text-bg/40">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}

function NavArrow({ side, onClick }: { side: "left" | "right"; onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous work" : "Next work"}
      className={`absolute top-1/2 hidden -translate-y-1/2 text-3xl text-bg/50 transition-colors hover:text-bg lg:block ${side === "left" ? "left-3" : "right-3"}`}
    >
      {side === "left" ? "‹" : "›"}
    </button>
  );
}
