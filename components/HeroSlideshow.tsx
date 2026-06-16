"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Artwork } from "@/lib/artwork";

/** Full-bleed crossfading slideshow with a slow Ken Burns zoom on the active slide. */
export default function HeroSlideshow({
  slides,
  intervalMs = 5200,
}: {
  slides: Artwork[];
  intervalMs?: number;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setActive((p) => (p + 1) % slides.length), intervalMs);
    return () => clearInterval(t);
  }, [slides.length, intervalMs]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink">
      {slides.map((s, idx) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-[1600ms] ease-in-out ${
            idx === active ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={idx === active ? undefined : true}
        >
          <Image
            src={s.image}
            alt=""
            fill
            priority={idx === 0}
            sizes="100vw"
            placeholder={s.blur ? "blur" : "empty"}
            blurDataURL={s.blur}
            className={`object-cover ${idx === active ? "kenburns" : ""}`}
          />
        </div>
      ))}
      {/* Legibility scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/40" />

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(idx)}
              aria-label={`Show slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === active ? "w-7 bg-bg" : "w-1.5 bg-bg/50 hover:bg-bg/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
