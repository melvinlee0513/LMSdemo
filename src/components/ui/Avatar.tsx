import Image from "next/image";

import type { CentreImage } from "@/config/types";
import { cn } from "@/lib/utils";

/**
 * Small circular portrait. Falls back to initials when a centre has not
 * supplied an image — better than a broken frame or a stock photo.
 */
export function Avatar({
  image,
  name,
  size = 48,
  className,
}: {
  image?: CentreImage;
  name: string;
  size?: number;
  className?: string;
}) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  if (!image) {
    return (
      <span
        aria-hidden="true"
        style={{ width: size, height: size }}
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand",
          className,
        )}
      >
        {initials}
      </span>
    );
  }

  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={size}
      height={size}
      sizes={`${size}px`}
      className={cn(
        "shrink-0 rounded-full border border-line-warm object-cover",
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
}
