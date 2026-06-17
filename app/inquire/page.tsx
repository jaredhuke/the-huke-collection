import type { Metadata } from "next";
import Image from "next/image";
import InquiryForm from "@/components/InquiryForm";
import { getArtworks } from "@/lib/artworks";
import { artistLabel, captionLine } from "@/lib/artwork";

export const metadata: Metadata = {
  title: "Inquire",
  description:
    "Inquire about acquiring a work by Randy Huke or John Huke — request prices, dimensions, and availability, or arrange a viewing.",
  alternates: { canonical: "/inquire" },
};

export default async function InquirePage() {
  const artworks = await getArtworks();
  const panel =
    artworks.find((a) => a.featured && a.medium === "Painting") ??
    artworks.find((a) => a.featured) ??
    artworks[0];

  return (
    <div className="flex min-h-[calc(100vh-81px)] flex-col lg:flex-row">
      {/* Left — art panel */}
      {panel && (
        <div className="relative hidden lg:block lg:w-[48%] xl:w-[52%]">
          <Image
            src={panel.image}
            alt={`${captionLine(panel)} — ${artistLabel(panel.artist)}`}
            fill
            priority
            sizes="52vw"
            placeholder={panel.blur ? "blur" : "empty"}
            blurDataURL={panel.blur}
            className="object-cover"
            style={panel.rotate ? { transform: `rotate(${panel.rotate}deg)` } : undefined}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-10 xl:p-14">
            <p className="font-display text-[1.6rem] italic leading-snug text-bg xl:text-[2rem]">
              Original works by two Austin artists — available for private acquisition.
            </p>
            <p className="mt-5 text-[0.7rem] uppercase tracking-[0.22em] text-bg/50">
              Austin, Texas · Est. 1970s
            </p>
          </div>
        </div>
      )}

      {/* Right — form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-16 sm:px-10 lg:px-16 lg:py-20 xl:px-20">
        <div className="mx-auto w-full max-w-lg">
          <p className="eyebrow">Inquiries &amp; Acquisitions</p>
          <h1 className="mt-4 font-display text-5xl leading-tight sm:text-6xl">Inquire</h1>
          <p className="mt-5 leading-relaxed text-muted">
            Whether you&rsquo;re interested in acquiring a work, requesting prices, or
            arranging a viewing — we&rsquo;d love to hear from you. Messages go straight
            to the family.
          </p>
          <div className="mt-10">
            <InquiryForm />
          </div>
        </div>
      </div>
    </div>
  );
}
