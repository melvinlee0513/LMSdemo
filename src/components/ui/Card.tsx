import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The low-level card primitive every content card is built on.
 * Content-specific cards live in `src/components/cards/`.
 */
export function Card({
  as: Component = "div",
  children,
  className,
  tone = "surface",
  radius = "lg",
  padding = "md",
  interactive = false,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  tone?: "surface" | "warm" | "soft" | "muted";
  radius?: "md" | "lg";
  padding?: "none" | "sm" | "md" | "lg";
  /** Adds the few-pixel hover lift used for linked cards. */
  interactive?: boolean;
}) {
  return (
    <Component
      className={cn(
        // `relative` is not decoration. Content cards make their whole surface
        // clickable with a stretched `after:absolute after:inset-0` link, and
        // without a positioned ancestor that overlay resolves against the
        // initial containing block — an invisible link covering the page.
        "relative border shadow-soft",
        radius === "lg" ? "rounded-3xl" : "rounded-2xl",
        tone === "surface" && "border-line bg-surface",
        tone === "warm" && "border-line-warm bg-surface-warm",
        tone === "soft" && "border-line-warm bg-brand-soft-2",
        tone === "muted" && "border-line bg-surface-muted",
        padding === "sm" && "p-4 sm:p-5",
        padding === "md" && "p-5 sm:p-6",
        padding === "lg" && "p-6 sm:p-8",
        interactive &&
          "transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-line-warm hover:shadow-lift",
        className,
      )}
    >
      {children}
    </Component>
  );
}
