import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getArtworks } from "@/lib/artworks";
import peopleData from "@/data/people.json";
import Reveal from "@/components/Reveal";
import ParallaxImage from "@/components/ParallaxImage";

export const metadata: Metadata = {
  title: "The Artists",
  description:
    "Randy Huke (now 79) and John Huke (1948–2016) — two Austin artists, lifelong partners, and rare collaborators. Painters, a sculptor and printmaker, filmmakers, and makers of the drawings they called Visual Conversations.",
  alternates: { canonical: "/about" },
};

type Person = { id: string; image: string; caption: string; visible: boolean; width: number; height: number; blur?: string };
const people = (peopleData as Person[]).filter((p) => p.visible);
const photo = (id: string) => people.find((p) => p.id === id);

const EXHIBITIONS = [
  { v: "Austin Museum of Art (Laguna Gloria)", c: "Austin, Texas" },
  { v: "Mary Ryan Gallery", c: "New York" },
  { v: "The Rodin Gallery", c: "St. Louis" },
  { v: "“The Life & Art of John Huke,” Hotel Ella", c: "Austin, 2017" },
  { v: "Lonesome Dove lithographs", c: "from the set of the 1989 production" },
];

const RANDY_FILMS = [
  { y: "1998", t: "The Faculty" },
  { y: "2000", t: "Miss Congeniality" },
  { y: "2003", t: "The Texas Chainsaw Massacre" },
  { y: "2006", t: "Idiocracy" },
  { y: "2006", t: "The Texas Chainsaw Massacre: The Beginning" },
  { y: "2007", t: "The Hitcher" },
  { y: "2009", t: "Friday the 13th" },
  { y: "2013", t: "2 Guns" },
  { y: "2014", t: "The Leftovers" },
];
const JOHN_FILMS = [
  { y: "1989", t: "Lonesome Dove" },
  { y: "1991", t: "Point Break" },
  { y: "1991", t: "Wild Texas Wind" },
  { y: "1993", t: "Body Snatchers" },
  { y: "1993", t: "The Beverly Hillbillies" },
  { y: "1994", t: "On Promised Land" },
  { y: "1994", t: "Without Consent" },
  { y: "1995", t: "Empire Records" },
  { y: "1997", t: "Lewis & Clark & George" },
  { y: "2000", t: "Picnic" },
  { y: "2005", t: "Drop Dead Sexy" },
  { y: "2017", t: "Being Rose" },
];

export default async function AboutPage() {
  const all = await getArtworks();
  const collabWork = all.find((a) => a.artist === "John & Randy Huke");

  const hero = photo("couple-young");
  const randyPhoto = photo("randy-portrait");
  const johnPhoto = photo("john-portrait");
  const lovePhoto = photo("couple-roses");

  return (
    <div>
      {/* Parallax hero */}
      <section className="relative flex min-h-[78vh] items-end overflow-hidden">
        {hero && <ParallaxImage src={hero.image} blur={hero.blur} priority />}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/40" />
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-16 sm:px-8 sm:pb-24">
          <div className="rise-in max-w-2xl text-bg">
            <p className="text-[0.72rem] uppercase tracking-[0.3em] text-bg/70">The Artists</p>
            <h1 className="mt-4 font-display text-[2.8rem] leading-[1.02] tracking-[-0.02em] sm:text-6xl">
              Randy &amp; John Huke
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-bg/85">
              For more than four decades, Randy Huke and her husband John Huke
              (1948&ndash;2016) made art side by side in Austin, Texas — two distinct
              painters, lifelong partners, and rare collaborators.
            </p>
          </div>
        </div>
      </section>

      {/* A great love */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-28">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="eyebrow">A great love &amp; a rare collaboration</p>
            <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              Two hands, one conversation
            </h2>
            <div className="mt-6 space-y-4 leading-relaxed text-muted">
              <p>
                Randy and John met young and stayed in love for a lifetime — married
                forty-six years, raising a family while building two distinct bodies of
                work in the same studio. Theirs was the rarest kind of artistic
                partnership: two strong, separate visions that could meet on a single
                sheet of paper without either one disappearing.
              </p>
              <p>
                They called those shared pieces <em>Visual Conversations</em>. One would
                begin a drawing, then they would trade — answering, layering, and
                pushing each other&rsquo;s marks until the work was finished by two hands
                at once. It is hard to do. They made it look like love.
              </p>
            </div>
          </Reveal>
          {lovePhoto && (
            <Reveal delay={80}>
              <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                <Image src={lovePhoto.image} alt="Randy and John Huke" fill sizes="(max-width:768px) 100vw, 45vw" placeholder={lovePhoto.blur ? "blur" : "empty"} blurDataURL={lovePhoto.blur} className="object-cover" />
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Randy */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
          <Reveal>
            {randyPhoto && (
              <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                <Image src={randyPhoto.image} alt="Randy Huke" fill sizes="(max-width:768px) 100vw, 45vw" placeholder={randyPhoto.blur ? "blur" : "empty"} blurDataURL={randyPhoto.blur} className="object-cover object-top" />
              </div>
            )}
          </Reveal>
          <Reveal delay={80}>
            <p className="eyebrow">Painter · b. 1947</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">Randy Huke</h2>
            <div className="mt-6 space-y-4 leading-relaxed text-muted">
              <p>
                Randy Huke is an Austin painter — now 79 and still in the studio — whose
                work moves fluidly between exuberant color and quiet, searching
                abstraction. Across canvases, drawings, and works on paper, she builds
                images that feel at once spontaneous and deeply considered: gestural
                fields, floating organic forms, and passages of luminous, unexpected
                color.
              </p>
              <p>
                Alongside her studio practice, Randy spent a career in film as a set
                decorator and art director, shaping the look of features including{" "}
                <em>The Faculty</em>, <em>Idiocracy</em>, <em>Miss Congeniality</em>, and{" "}
                <em>2 Guns</em>. The painter&rsquo;s eye and the production designer&rsquo;s
                command of space, color, and texture run through everything she makes.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* John */}
      <section className="mx-auto mt-20 max-w-[1400px] px-5 sm:mt-28 sm:px-8">
        <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
          <Reveal delay={80} className="md:order-2">
            {johnPhoto && (
              <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                <Image src={johnPhoto.image} alt="John Huke" fill sizes="(max-width:768px) 100vw, 45vw" placeholder={johnPhoto.blur ? "blur" : "empty"} blurDataURL={johnPhoto.blur} className="object-cover" />
              </div>
            )}
          </Reveal>
          <Reveal className="md:order-1">
            <p className="eyebrow">Artist · Sculptor · Filmmaker · 1948&ndash;2016</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">John Huke</h2>
            <div className="mt-6 space-y-4 leading-relaxed text-muted">
              <p>
                John Campbell Huke (1948&ndash;2016) was an Austin artist, sculptor,
                printmaker, and filmmaker whose work brimmed with warmth, wit, and
                restless invention. He earned a BFA from the University of Texas at
                Austin — where he edited the storied campus humor magazine{" "}
                <em>The Texas Ranger</em> — and an MFA from the University of Oklahoma.
              </p>
              <p>
                A conscientious objector and draft counselor during the Vietnam War,
                John carried an independent spirit into everything he did: he built a
                geodesic dome, taught film at Texas State University, and worked for
                decades as a production designer and art director, with credits
                including <em>Lonesome Dove</em>, <em>Point Break</em>,{" "}
                <em>Empire Records</em>, and <em>The Beverly Hillbillies</em>. From the
                set of <em>Lonesome Dove</em> he made a celebrated series of lithographs.
                His paintings, prints, and sculpture were exhibited at the Austin Museum
                of Art and the Mary Ryan Gallery in New York.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Visual Conversations */}
      <section className="mt-24 border-y border-hairline bg-surface sm:mt-32">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-20 sm:px-8 md:grid-cols-2 md:items-center md:gap-16">
          <Reveal>
            <p className="eyebrow">The collaboration</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">Visual Conversations</h2>
            <p className="mt-6 leading-relaxed text-muted">
              Their collaborative drawings have been exhibited at the Austin Museum of
              Art (Laguna Gloria), the Mary Ryan Gallery in New York, and the Rodin
              Gallery in St. Louis — two artists finishing a single work, together.
            </p>
            <Link href="/works?series=Visual+Conversations" className="link-underline mt-6 inline-block text-[0.72rem] uppercase tracking-[0.2em] text-muted hover:text-ink">
              See the collaborations →
            </Link>
          </Reveal>
          {collabWork && (
            <Reveal delay={80}>
              <div className="relative aspect-[5/4] overflow-hidden bg-bg">
                <Image src={collabWork.image} alt="Collaborative drawing by Randy and John Huke" fill sizes="(max-width:768px) 100vw, 45vw" placeholder={collabWork.blur ? "blur" : "empty"} blurDataURL={collabWork.blur} className="object-contain" />
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Photographs */}
      {people.filter((p) => p.id.startsWith("couple")).length > 0 && (
        <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8">
          <Reveal>
            <h2 className="font-display text-3xl">Randy &amp; John</h2>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {people.filter((p) => p.id.startsWith("couple")).map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                  <Image src={p.image} alt={p.caption} fill sizes="(max-width:768px) 100vw, 33vw" placeholder={p.blur ? "blur" : "empty"} blurDataURL={p.blur} className="object-cover" />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Exhibitions + Film */}
      <section className="mx-auto max-w-[1400px] px-5 pb-24 sm:px-8 sm:pb-28">
        <div className="grid gap-16 md:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-3xl">Selected Exhibitions</h2>
            <ul className="mt-7 divide-y divide-hairline">
              {EXHIBITIONS.map((e) => (
                <li key={e.v} className="flex flex-col gap-1 py-4 sm:flex-row sm:justify-between sm:gap-6">
                  <span className="text-ink">{e.v}</span>
                  <span className="text-sm text-faint">{e.c}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-display text-3xl">Filmography</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Beyond the studio, Randy and John spent decades in film — Randy as a set
              decorator and art director, John as a production designer and art director
              — shaping the look of features shot in Texas and beyond.
            </p>
            <div className="mt-7 space-y-8">
              <FilmCol who="Randy Huke — Set Decorator / Art Director" films={RANDY_FILMS} />
              <FilmCol who="John Huke — Production Designer / Art Director" films={JOHN_FILMS} />
            </div>
          </Reveal>
        </div>

        <div className="mt-16 text-center">
          <Link href="/works" className="group inline-flex items-center gap-3 border border-ink px-7 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-bg">
            Explore the Works
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

function FilmCol({ who, films }: { who: string; films: { y: string; t: string }[] }) {
  return (
    <div>
      <p className="text-[0.7rem] uppercase tracking-[0.2em] text-faint">{who}</p>
      <ul className="mt-3 divide-y divide-hairline">
        {films.map((f) => (
          <li key={f.y + f.t} className="flex items-baseline justify-between gap-6 py-2.5">
            <span className="text-ink">{f.t}</span>
            <span className="text-sm tabular-nums text-faint">{f.y}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
