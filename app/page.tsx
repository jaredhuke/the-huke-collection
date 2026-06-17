import Link from "next/link";
import Image from "next/image";
import { getArtworks } from "@/lib/artworks";
import { artistLabel, captionLine, type Artwork } from "@/lib/artwork";
import peopleData from "@/data/people.json";
import Reveal from "@/components/Reveal";
import ArtImage from "@/components/ArtImage";
import HeroSlideshow from "@/components/HeroSlideshow";
import ParallaxImage from "@/components/ParallaxImage";

type Person = { id: string; image: string; caption: string; visible: boolean; width: number; height: number; blur?: string };
const people = peopleData as Person[];

export default async function HomePage() {
  const all = await getArtworks();
  const confirmed = all.filter((a) => a.artist); // attributed works only
  const featured = confirmed.filter((a) => a.featured);

  // Key/hero image leads with the collaborations.
  const pool = [
    ...confirmed.filter((a) => a.artist === "John & Randy Huke" && a.featured),
    ...confirmed.filter((a) => a.artist === "John & Randy Huke"),
    ...featured,
    ...confirmed,
  ];
  const heroSlides: Artwork[] = [];
  const seen = new Set<string>();
  for (const a of pool) {
    if (seen.has(a.id)) continue;
    seen.add(a.id);
    heroSlides.push(a);
    if (heroSlides.length >= 5) break;
  }

  const grid = (featured.length ? featured : confirmed).slice(0, 9);
  const band =
    confirmed.find((a) => a.artist === "Randy Huke" && a.id !== "randy-01") ??
    confirmed.find((a) => !heroSlides.slice(0, 1).includes(a));
  const love = people.find((p) => p.id === "couple-hills" && p.visible) ?? people.find((p) => p.visible);
  const randyPhoto = people.find((p) => p.id === "randy-portrait" && p.visible);
  const johnPhoto = people.find((p) => p.id === "john-portrait" && p.visible);

  return (
    <>
      {/* Hero — full-screen slideshow */}
      <section className="relative flex h-[90vh] min-h-[580px] w-full items-end overflow-hidden">
        <HeroSlideshow slides={heroSlides} />
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-20 sm:px-8 sm:pb-28">
          <div className="rise-in max-w-2xl text-bg">
            <p className="text-[0.72rem] uppercase tracking-[0.3em] text-bg/70">Austin, Texas</p>
            <h1 className="mt-4 font-display text-[3.4rem] leading-[0.95] tracking-[-0.02em] text-bg sm:text-7xl lg:text-[6rem]">
              The Huke Collection
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-bg/85">
              The paintings, works on paper, and sculpture of Randy Huke and John Huke
              (1948&ndash;2016) — two Austin artists and lifelong creative partners.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/works" className="group inline-flex items-center gap-3 bg-bg px-7 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-accent hover:text-bg">
                View the Work
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link href="/about" className="group inline-flex items-center gap-3 border border-bg/50 px-7 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-bg transition-colors hover:bg-bg hover:text-ink">
                Their Story
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
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

      {/* Selected work */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <Reveal>
          <div className="flex items-end justify-between border-b border-hairline pb-5">
            <h2 className="font-display text-3xl sm:text-4xl">Selected Work</h2>
            <Link href="/works" className="link-underline text-[0.72rem] uppercase tracking-[0.2em] text-muted hover:text-ink">View all</Link>
          </div>
        </Reveal>
        <div className="mt-8 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {grid.map((a, i) => (
            <Reveal key={a.id} delay={(i % 3) * 90} className="mb-6 break-inside-avoid">
              <FeaturedCard a={a} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Dramatic full-bleed art band */}
      {band && (
        <section className="relative mt-24 flex min-h-[88vh] items-center overflow-hidden sm:mt-32">
          <ParallaxImage src={band.image} blur={band.blur} strength={90} />
          <div className="absolute inset-0 bg-ink/45" />
          <Reveal className="relative z-10 mx-auto max-w-3xl px-6 text-center text-bg">
            <p className="font-display text-[2.2rem] leading-[1.3] tracking-[-0.01em] sm:text-6xl">
              Exuberant color. Restless invention.
              <br className="hidden sm:block" /> A shared language of marks.
            </p>
            <Link href="/works" className="group mt-10 inline-flex items-center gap-3 border border-bg/60 px-7 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-bg transition-colors hover:bg-bg hover:text-ink">
              Enter the gallery
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </Reveal>
        </section>
      )}

      {/* Their great love — parallax band */}
      {love && (
        <section className="relative flex min-h-[78vh] items-center justify-center overflow-hidden">
          <ParallaxImage src={love.image} blur={love.blur} />
          <div className="absolute inset-0 bg-ink/55" />
          <Reveal className="relative z-10 mx-auto max-w-2xl px-6 py-28 text-center text-bg">
            <p className="text-[0.72rem] uppercase tracking-[0.3em] text-bg/70">A great love</p>
            <p className="mt-5 font-display text-3xl leading-[1.4] sm:text-[2.4rem]">
              They were partners in everything — in life, in the studio, and on the page,
              trading drawings back and forth until two hands became one.
            </p>
            <Link href="/about" className="group mt-9 inline-flex items-center gap-3 border border-bg/60 px-7 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-bg transition-colors hover:bg-bg hover:text-ink">
              Read their story
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </Reveal>
        </section>
      )}

      {/* Artists teaser */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <p className="eyebrow text-center">Two artists, one studio</p>
          <h2 className="mt-3 text-center font-display text-3xl sm:text-4xl">The Artists</h2>
        </Reveal>
        <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-12">
          <ArtistTeaser
            photo={randyPhoto}
            name="Randy Huke"
            line="Painter and film set decorator — now 79 and still in the studio — whose canvases move between exuberant color and quiet, searching abstraction."
          />
          <ArtistTeaser
            photo={johnPhoto}
            name="John Huke"
            line="Artist, sculptor, printmaker, and filmmaker (1948–2016) — maker of the Lonesome Dove lithographs and a life of restless invention."
          />
        </div>
      </section>

      {/* Inquire band */}
      <section className="border-y border-hairline bg-surface">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-6 px-5 py-20 text-center sm:px-8">
          <Reveal>
            <h2 className="font-display text-3xl sm:text-[2.5rem]">Acquire a work</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              Many pieces are available to collectors. We&rsquo;re happy to share prices,
              dimensions, and details, or to help you find the right work.
            </p>
            <Link href="/inquire" className="group mt-8 inline-flex items-center gap-3 bg-ink px-7 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-bg transition-colors hover:bg-accent">
              Make an inquiry
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function FeaturedCard({ a }: { a: Artwork }) {
  return (
    <Link href={`/works/${a.id}`} className="group block">
      <ArtImage
        image={a.image}
        width={a.width}
        height={a.height}
        blur={a.blur}
        rotate={a.rotate}
        alt={`${a.title} — ${artistLabel(a.artist)}`}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="bg-surface"
        imgClassName="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
      />
      <p className="mt-3 font-display text-lg italic">{captionLine(a)}</p>
      <p className="text-[0.78rem] text-muted">{artistLabel(a.artist)}</p>
    </Link>
  );
}

function ArtistTeaser({ photo, name, line }: { photo?: Person; name: string; line: string }) {
  return (
    <Reveal className="group">
      <Link href="/about" className="block">
        {photo && (
          <div className="relative aspect-[4/5] overflow-hidden bg-surface">
            <Image
              src={photo.image}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              placeholder={photo.blur ? "blur" : "empty"}
              blurDataURL={photo.blur}
              className="object-cover object-top transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
            />
          </div>
        )}
        <h3 className="mt-5 font-display text-2xl">{name}</h3>
        <p className="mt-2 max-w-md leading-relaxed text-muted">{line}</p>
      </Link>
    </Reveal>
  );
}
