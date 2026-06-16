import Image from "next/image";
import Link from "next/link";
import { getArtworks, getFeatured } from "@/lib/artworks";
import { artistLabel, captionLine, type Artwork } from "@/lib/artwork";
import Reveal from "@/components/Reveal";

export default async function HomePage() {
  const [all, featured] = await Promise.all([getArtworks(), getFeatured(9)]);
  const byId = (id: string) => all.find((a) => a.id === id);
  const hero = byId("selected-14") ?? featured[0] ?? all[0];
  const randyWork = all.find((a) => a.artist === "Randy Huke") ?? byId("randy-01");
  const johnWork =
    all.find((a) => a.artist === "John Huke" && a.medium === "Sculpture") ??
    all.find((a) => a.artist === "John Huke");

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-[1400px] px-5 pt-12 sm:px-8 sm:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <p className="eyebrow">Austin, Texas</p>
            <h1 className="mt-5 font-display text-[3.2rem] leading-[0.98] tracking-[-0.02em] sm:text-7xl lg:text-[5.4rem]">
              The Huke
              <br />
              Collection
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-muted">
              Paintings, works on paper, and sculpture by{" "}
              <span className="text-ink">Randy Huke</span> and{" "}
              <span className="text-ink">John Huke</span>{" "}
              (1948&ndash;2016) — two Austin artists and lifelong creative
              partners.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/works"
                className="inline-flex items-center bg-ink px-7 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-bg transition-colors hover:bg-accent"
              >
                View the Works
              </Link>
              <Link
                href="/about"
                className="link-underline inline-flex items-center py-4 text-[0.72rem] uppercase tracking-[0.2em] text-muted hover:text-ink"
              >
                Meet the Artists
              </Link>
            </div>
          </div>

          {hero && (
            <div className="relative">
              <div className="bg-surface p-3 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.45)] sm:p-4">
                <Image
                  src={hero.image}
                  alt={`${hero.title} — ${artistLabel(hero.artist)}`}
                  width={hero.width || 1400}
                  height={hero.height || 1100}
                  sizes="(max-width: 1024px) 100vw, 52vw"
                  placeholder={hero.blur ? "blur" : "empty"}
                  blurDataURL={hero.blur}
                  priority
                  className="h-auto w-full"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Statement */}
      <section className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8 sm:py-32">
        <Reveal>
          <p className="font-display text-2xl leading-[1.5] tracking-[-0.01em] text-ink sm:text-[2rem]">
            For more than four decades, Randy and John Huke made art side by side —
            exuberant color, restless invention, and a shared language of marks. This
            is their collection, gathered in one place.
          </p>
        </Reveal>
      </section>

      {/* Selected works */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <Reveal>
          <div className="flex items-end justify-between border-b border-hairline pb-5">
            <h2 className="font-display text-3xl sm:text-4xl">Selected Works</h2>
            <Link
              href="/works"
              className="link-underline text-[0.72rem] uppercase tracking-[0.2em] text-muted hover:text-ink"
            >
              View all
            </Link>
          </div>
        </Reveal>

        <div className="mt-8 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {featured.map((a, i) => (
            <Reveal key={a.id} delay={(i % 3) * 90} className="mb-6 break-inside-avoid">
              <FeaturedCard a={a} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* The artists */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <p className="eyebrow text-center">Two artists, one studio</p>
          <h2 className="mt-3 text-center font-display text-3xl sm:text-4xl">The Artists</h2>
        </Reveal>
        <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-12">
          <ArtistTeaser
            work={randyWork}
            name="Randy Huke"
            line="Painter and film set decorator whose canvases move between exuberant color and quiet, searching abstraction."
          />
          <ArtistTeaser
            work={johnWork}
            name="John Huke"
            line="Artist, sculptor, printmaker, and filmmaker (1948–2016) — maker of the Lonesome Dove lithographs and a life of restless invention."
          />
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/about"
            className="inline-flex items-center border border-ink px-7 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-bg"
          >
            Read their story
          </Link>
        </div>
      </section>

      {/* Inquire band */}
      <section className="border-y border-hairline bg-surface">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-6 px-5 py-20 text-center sm:px-8">
          <Reveal>
            <h2 className="font-display text-3xl sm:text-[2.5rem]">Acquire a work</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              Many pieces are available to collectors. We&rsquo;re happy to share
              prices, dimensions, and details, or to help you find the right work.
            </p>
            <Link
              href="/inquire"
              className="mt-8 inline-flex items-center bg-ink px-7 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-bg transition-colors hover:bg-accent"
            >
              Make an inquiry
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function FeaturedCard({ a }: { a: Artwork }) {
  return (
    <Link href="/works" className="group block">
      <div className="overflow-hidden bg-surface">
        <Image
          src={a.image}
          alt={`${a.title} — ${artistLabel(a.artist)}`}
          width={a.width || 1200}
          height={a.height || 900}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          placeholder={a.blur ? "blur" : "empty"}
          blurDataURL={a.blur}
          className="h-auto w-full transition-transform duration-[1.2s] ease-out group-hover:scale-[1.035]"
        />
      </div>
      <p className="mt-3 font-display text-lg italic">{captionLine(a)}</p>
      <p className="text-[0.78rem] text-muted">{artistLabel(a.artist)}</p>
    </Link>
  );
}

function ArtistTeaser({
  work,
  name,
  line,
}: {
  work?: Artwork;
  name: string;
  line: string;
}) {
  return (
    <Reveal className="group">
      <Link href="/about" className="block">
        {work && (
          <div className="overflow-hidden bg-surface">
            <Image
              src={work.image}
              alt={`Work by ${name}`}
              width={work.width || 1200}
              height={work.height || 900}
              sizes="(max-width: 768px) 100vw, 45vw"
              placeholder={work.blur ? "blur" : "empty"}
              blurDataURL={work.blur}
              className="h-[340px] w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04] sm:h-[420px]"
            />
          </div>
        )}
        <h3 className="mt-5 font-display text-2xl">{name}</h3>
        <p className="mt-2 max-w-md leading-relaxed text-muted">{line}</p>
      </Link>
    </Reveal>
  );
}
