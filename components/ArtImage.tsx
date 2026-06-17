import Image from "next/image";
import { normRotate } from "@/lib/artwork";

/**
 * Renders an artwork image. The common case (no rotation, or 180°) uses a plain
 * intrinsic next/image so lazy-loading works reliably inside CSS multi-column
 * layouts. Only true 90°/270° rotations use the container-query box-swap.
 */
export default function ArtImage({
  image,
  width,
  height,
  blur,
  rotate,
  alt,
  sizes,
  className = "",
  imgClassName = "",
  fit = "cover",
  priority = false,
}: {
  image: string;
  width: number;
  height: number;
  blur?: string;
  rotate?: number;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  fit?: "cover" | "contain";
  priority?: boolean;
}) {
  const rot = normRotate(rotate);
  const w = width || 1200;
  const h = height || 900;

  // Sideways photos need the rotated box; everything else uses the simple path.
  if (rot === 90 || rot === 270) {
    return (
      <div
        className={`relative w-full overflow-hidden ${className}`}
        style={{ aspectRatio: h / w, containerType: "size" }}
      >
        <div
          className="absolute left-1/2 top-1/2"
          style={{ width: "100cqh", height: "100cqw", transform: `translate(-50%, -50%) rotate(${rot}deg)` }}
        >
          <Image
            src={image}
            alt={alt}
            fill
            sizes={sizes}
            placeholder={blur ? "blur" : "empty"}
            blurDataURL={blur}
            priority={priority}
            className={imgClassName}
            style={{ objectFit: fit }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <Image
        src={image}
        alt={alt}
        width={w}
        height={h}
        sizes={sizes}
        placeholder={blur ? "blur" : "empty"}
        blurDataURL={blur}
        priority={priority}
        className={`h-auto w-full ${imgClassName}`}
        style={rot === 180 ? { transform: "rotate(180deg)" } : undefined}
      />
    </div>
  );
}
