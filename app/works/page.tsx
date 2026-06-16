import type { Metadata } from "next";
import { getArtworks } from "@/lib/artworks";
import WorksGallery from "@/components/WorksGallery";

export const metadata: Metadata = {
  title: "Works",
  description:
    "Browse paintings, works on paper, and sculpture by Randy Huke and John Huke. Filter by artist and medium; select a work for details and availability.",
  alternates: { canonical: "/works" },
};

export default async function WorksPage() {
  const artworks = await getArtworks();
  return (
    <div className="mx-auto max-w-[1400px] px-5 pt-12 sm:px-8 sm:pt-16">
      <header className="max-w-2xl">
        <p className="eyebrow">The Collection</p>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">Works</h1>
        <p className="mt-5 leading-relaxed text-muted">
          Paintings, works on paper, and sculpture by Randy and John Huke. Select a
          work to view details, dimensions, and availability.
        </p>
      </header>
      <div className="mt-10 pb-10">
        <WorksGallery artworks={artworks} />
      </div>
    </div>
  );
}
