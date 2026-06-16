"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Full-bleed background image with a real scroll-parallax (works on every device,
 * unlike background-attachment: fixed). Place inside a `relative overflow-hidden`
 * section, with a scrim + content layered above at z-10.
 */
export default function ParallaxImage({
  src,
  alt = "",
  blur,
  priority = false,
  strength = 60,
}: {
  src: string;
  alt?: string;
  blur?: string;
  priority?: boolean;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progress = (r.top + r.height / 2 - vh / 2) / vh; // ~ -1 .. 1
      setOffset(Math.max(-1, Math.min(1, progress)) * strength);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [strength]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-x-0 -top-[12%] h-[124%]"
        style={{ transform: `translateY(${offset}px)` }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          placeholder={blur ? "blur" : "empty"}
          blurDataURL={blur}
          className="object-cover"
        />
      </div>
    </div>
  );
}
