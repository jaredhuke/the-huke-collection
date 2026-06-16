import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArtworks } from "@/lib/artworks";
import { artistLabel, captionLine, isSold, statusLabel } from "@/lib/artwork";
import { site } from "@/lib/config";
import ArtImage from "@/components/ArtImage";
import ShareButtons from "@/components/ShareButtons";

export async function generateStaticParams() {
  const all = await getArtworks();
  return all.map((a) => ({ id: a.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const all = await getArtworks();
  const a = all.find((x) => x.id === id);
  if (!a) return { title: "Work not found" };
  const t = `${captionLine(a)} — ${artistLabel(a.artist)}`;
  const desc =
    a.description ||
    `${a.medium || "Work"} by ${artistLabel(a.artist)}${a.year ? `, ${a.year}` : ""}. ${statusLabel(a)}. The Huke Collection, Austin, Texas.`;
  return {
    title: captionLine(a),
    description: desc,
    alternates: { canonical: `/works/${a.id}` },
    openGraph: {
      title: t,
      description: desc,
      url: `${site.url}/works/${a.id}`,
      images: [{ url: a.image, width: a.width || 1200, height: a.height || 900, alt: t }],
    },
    twitter: { card: "summary_large_image", title: t, description: desc, images: [a.image] },
  };
}

export default async function WorkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const all = await getArtworks();
  const a = all.find((x) => x.id === id);
  if (!a) notFound();

  const more = all
    .filter((x) => x.id !== a.id && (x.artist === a.artist || (a.series && x.series === a.series)))
    .slice(0, 6);

  const shareUrl = `${site.url}/works/${a.id}`;
  const shareImg = `${site.url}${a.image}`;
  const inquireHref = `/inquire?work=${encodeURIComponent(
    `${captionLine(a)} — ${artistLabel(a.artist)}`
  )}&img=${encodeURIComponent(a.image)}`;

  return (
    <article className="mx-auto max-w-[1400px] px-5 pt-10 sm:px-8 sm:pt-14">
      <Link
        href="/works"
        className="link-underline text-[0.72rem] uppercase tracking-[0.2em] text-muted hover:text-ink"
      >
        ← All works
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div className="bg-surface p-3 shadow-[0_30px_70px_-50px_rgba(0,0,0,0.5)] sm:p-5">
          <ArtImage
            image={a.image}
            width={a.width}
            height={a.height}
            blur={a.blur}
            rotate={a.rotate}
            alt={`${a.title} — ${artistLabel(a.artist)}`}
            sizes="(max-width: 1024px) 100vw, 60vw"
            fit="contain"
            priority
          />
        </div>

        <div className="lg:pt-4">
          <p className="text-[0.7rem] uppercase tracking-[0.24em] text-faint">
            {artistLabel(a.artist)}
          </p>
          <h1 className="mt-3 font-display text-4xl italic leading-tight sm:text-5xl">
            {a.title}
          </h1>

          <dl className="mt-8 space-y-3 text-sm text-muted">
            {a.year && <Row label="Year" value={a.year} />}
            {a.medium && <Row label="Medium" value={a.medium} />}
            {a.dimensions && <Row label="Dimensions" value={a.dimensions} />}
            {a.series && <Row label="Series" value={a.series} />}
            <Row label="Availability" value={statusLabel(a)} />
          </dl>

          {a.description && (
            <p className="mt-7 leading-relaxed text-muted">{a.description}</p>
          )}

          {!isSold(a) && (
            <Link
              href={inquireHref}
              className="group mt-9 inline-flex items-center gap-3 bg-ink px-8 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-bg transition-colors hover:bg-accent"
            >
              Inquire about this work
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          )}

          <div className="mt-9 border-t border-hairline pt-6">
            <ShareButtons url={shareUrl} image={shareImg} title={`${captionLine(a)} — ${artistLabel(a.artist)}, The Huke Collection`} />
          </div>
        </div>
      </div>

      {more.length > 0 && (
        <section className="mt-24">
          <h2 className="border-b border-hairline pb-4 font-display text-2xl">More works</h2>
          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {more.map((m) => (
              <Link key={m.id} href={`/works/${m.id}`} className="group block">
                <ArtImage
                  image={m.image}
                  width={m.width}
                  height={m.height}
                  blur={m.blur}
                  rotate={m.rotate}
                  alt={`${m.title} — ${artistLabel(m.artist)}`}
                  sizes="(max-width: 640px) 50vw, 16vw"
                  className="bg-surface"
                  imgClassName="transition-transform duration-700 group-hover:scale-105"
                />
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 border-b border-hairline pb-3">
      <dt className="text-[0.7rem] uppercase tracking-[0.16em] text-faint">{label}</dt>
      <dd className="text-right text-ink">{value}</dd>
    </div>
  );
}
