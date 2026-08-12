import Image from "next/image";
import Link from "next/link";

import type { Identity } from "@/config/types";
import { cn } from "@/lib/utils";

/**
 * The centre wordmark, always linking home.
 *
 * Two lockups, chosen by `identity.logoLockup`:
 *   image          a single logo file that already contains the centre name
 *   mark-and-name  a square mark plus the name set in the brand typeface,
 *                  which stays crisp at every size and re-themes with the site
 *
 * Marked `priority` because it appears in the header on every page.
 */
export function Logo({
  identity,
  className,
  invert = false,
}: {
  identity: Identity;
  className?: string;
  invert?: boolean;
}) {
  const lockup = identity.logoLockup;
  const src = lockup === "mark-and-name" ? (identity.logoMark ?? identity.logo) : identity.logo;

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex min-h-11 items-center gap-2.5 rounded-xl transition-opacity duration-200 hover:opacity-85",
        className,
      )}
      aria-label={`${identity.name} — home`}
    >
      <Image
        src={src}
        alt=""
        width={lockup === "mark-and-name" ? 40 : 168}
        height={40}
        priority
        className={cn(
          "w-auto",
          lockup === "mark-and-name" ? "size-9 sm:size-10" : "h-9 sm:h-10",
          invert && lockup === "image" && "brightness-0 invert",
        )}
      />

      {lockup === "mark-and-name" ? (
        <span
          aria-hidden="true"
          className={cn(
            "text-[1.0625rem] leading-tight font-extrabold tracking-tight sm:text-lg",
            invert ? "text-white" : "text-ink",
          )}
        >
          {identity.shortName ?? identity.name}
        </span>
      ) : null}

      <span className="sr-only">{identity.name}</span>
    </Link>
  );
}
