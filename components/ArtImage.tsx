import Image from "next/image";
import { normRotate } from "@/lib/artwork";

/**
 * Renders an artwork image with optional rotation (0/90/180/270) controlled from
 * the Google Sheet's `rotate` column. Uses container-query units so 90°/270°
 * rotations fill their box without distortion or cropping.
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
  const swapped = rot === 90 || rot === 270;
  const w = width || 1200;
  const h = height || 900;
  const displayAspect = swapped ? h / w : w / h;

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: displayAspect, containerType: "size" }}
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: swapped ? "100cqh" : "100%",
          height: swapped ? "100cqw" : "100%",
          transform: `translate(-50%, -50%) rotate(${rot}deg)`,
        }}
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
