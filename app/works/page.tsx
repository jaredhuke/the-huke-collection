import type { Metadata } from "next";
import { getArtworks } from "@/lib/artworks";
import WorksGallery from "@/components/WorksGallery";
import ParallaxImage from "@/components/ParallaxImage";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Browse paintings, works on paper, and sculpture by Randy Huke and John Huke. Filter by artist, medium, and series; select a piece for details and availability.",
  alternates: { canonical: "/works" },
};

export default async function WorksPage() {
  const artworks = await getArtworks();
  const heroArt =
    artworks.find((a) => a.id === "randy-01") ??
    artworks.find((a) => a.artist) ??
    artworks[0];

  return (
    <div>
      {heroArt && (
        <section className="relative flex h-[58vh] min-h-[400px] w-full items-end overflow-hidden">
          <ParallaxImage src={heroArt.image} blur={heroArt.blur} priority strength={70} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-ink/30" />
          <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-12 sm:px-8 sm:pb-16">
            <p className="rise-in text-[0.72rem] uppercase tracking-[0.3em] text-bg/70">
              The Collection
            </p>
            <h1 className="rise-in mt-3 font-display text-6xl tracking-[-0.02em] text-bg sm:text-8xl">
              Work
            </h1>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <p className="mt-10 max-w-2xl leading-relaxed text-muted">
          Four decades of Austin studio practice — paintings, works on paper, and
          sculpture. Each piece available for private acquisition; select any work to
          inquire.
        </p>
        <div className="mt-6 pb-10">
          <WorksGallery artworks={artworks} />
        </div>
      </div>
    </div>
  );
}
