import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getArtworks } from "@/lib/artworks";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "The Artists",
  description:
    "Randy Huke and John Huke (1948–2016) — two Austin artists and lifelong creative partners. Painters, a sculptor and printmaker, filmmakers, and makers of the collaborative drawings they called Visual Conversations.",
  alternates: { canonical: "/about" },
};

const EXHIBITIONS = [
  { v: "Austin Museum of Art (Laguna Gloria)", c: "Austin, Texas" },
  { v: "Mary Ryan Gallery", c: "New York" },
  { v: "The Rodin Gallery", c: "St. Louis" },
  { v: "“The Life & Art of John Huke,” Hotel Ella", c: "Austin, 2017" },
  { v: "Lonesome Dove lithographs", c: "from the set of the 1989 production" },
];

export default async function AboutPage() {
  const all = await getArtworks();
  const randyWork =
    all.find((a) => a.artist === "Randy Huke") ?? all.find((a) => a.medium === "Painting");
  const collabWork = all.find((a) => a.artist === "John & Randy Huke");

  return (
    <div>
      {/* Intro */}
      <section className="mx-auto max-w-[1400px] px-5 pt-12 sm:px-8 sm:pt-20">
        <p className="eyebrow">The Artists</p>
        <h1 className="mt-5 max-w-4xl font-display text-[2.6rem] leading-[1.05] tracking-[-0.02em] sm:text-6xl">
          Randy &amp; John Huke
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted">
          For more than four decades, Randy Huke and her husband John Huke
          (1948&ndash;2016) made art side by side in Austin, Texas — two distinct
          painters with a shared language of color and mark-making, and a lifelong
          habit of collaboration.
        </p>
      </section>

      {/* Randy */}
      <section className="mx-auto mt-20 max-w-[1400px] px-5 sm:mt-28 sm:px-8">
        <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
          <Reveal>
            {randyWork && (
              <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                <Image
                  src={randyWork.image}
                  alt={`Painting by Randy Huke`}
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  placeholder={randyWork.blur ? "blur" : "empty"}
                  blurDataURL={randyWork.blur}
                  className="object-cover"
                />
              </div>
            )}
          </Reveal>
          <Reveal delay={80}>
            <p className="eyebrow">Painter</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">Randy Huke</h2>
            <div className="mt-6 space-y-4 leading-relaxed text-muted">
              <p>
                Randy Huke is an Austin painter whose work moves fluidly between
                exuberant color and quiet, searching abstraction. Across canvases,
                drawings, and works on paper, she builds images that feel at once
                spontaneous and deeply considered — gestural fields, floating organic
                forms, and passages of luminous, unexpected color.
              </p>
              <p>
                Alongside her studio practice, Randy has spent a career in film as a
                set decorator and art director, shaping the look of features
                including <em>The Faculty</em>, <em>Idiocracy</em>,{" "}
                <em>Miss Congeniality</em>, and <em>2 Guns</em>. The painter&rsquo;s eye
                and the production designer&rsquo;s command of space, color, and
                texture run through everything she makes.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* John */}
      <section className="mx-auto mt-20 max-w-[1400px] px-5 sm:mt-28 sm:px-8">
        <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
          <Reveal delay={80} className="md:order-2">
            <div className="relative aspect-[4/5] overflow-hidden bg-surface">
              <Image
                src="/about/john-huke-portrait.jpg"
                alt="Portrait of artist John Huke"
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal className="md:order-1">
            <p className="eyebrow">Artist &middot; Sculptor &middot; Filmmaker &middot; 1948&ndash;2016</p>
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
                set of <em>Lonesome Dove</em> he made a celebrated series of
                lithographs. His paintings, prints, and sculpture were exhibited at the
                Austin Museum of Art and the Mary Ryan Gallery in New York.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Visual Conversations */}
      <section className="mt-24 border-y border-hairline bg-surface sm:mt-32">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-20 sm:px-8 md:grid-cols-2 md:items-center md:gap-16">
          <Reveal>
            <p className="eyebrow">Collaboration</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">Visual Conversations</h2>
            <div className="mt-6 space-y-4 leading-relaxed text-muted">
              <p>
                Married for forty-six years, Randy and John were lifelong creative
                partners. Their collaborative drawings — which they called{" "}
                <em>Visual Conversations</em> — began as a dialogue on paper: one would
                start a drawing, then they would trade sheets, each answering and
                building on the other&rsquo;s marks until the work was finished by two
                hands at once.
              </p>
              <p>
                These collaborations have been exhibited at the Austin Museum of Art
                (Laguna Gloria), the Mary Ryan Gallery in New York, and the Rodin
                Gallery in St. Louis.
              </p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            {collabWork && (
              <div className="relative aspect-[5/4] overflow-hidden bg-bg">
                <Image
                  src={collabWork.image}
                  alt="Collaborative drawing by Randy and John Huke"
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  placeholder={collabWork.blur ? "blur" : "empty"}
                  blurDataURL={collabWork.blur}
                  className="object-contain"
                />
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* Exhibitions + Film */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-28">
        <div className="grid gap-16 md:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-3xl">Selected Exhibitions &amp; Recognition</h2>
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
            <h2 className="font-display text-3xl">Film &amp; Screen</h2>
            <div className="mt-7 space-y-6">
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.2em] text-faint">
                  Randy Huke — Set Decorator / Art Director
                </p>
                <p className="mt-2 leading-relaxed text-muted">
                  The Faculty · Idiocracy · Miss Congeniality · 2 Guns · The Leftovers
                </p>
              </div>
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.2em] text-faint">
                  John Huke — Production Designer / Art Director
                </p>
                <p className="mt-2 leading-relaxed text-muted">
                  Lonesome Dove · Point Break · Empire Records · The Beverly Hillbillies
                  · Body Snatchers
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/works"
            className="inline-flex items-center border border-ink px-7 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-bg"
          >
            Explore the Works
          </Link>
        </div>
      </section>
    </div>
  );
}
