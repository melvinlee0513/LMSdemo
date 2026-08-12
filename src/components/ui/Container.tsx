import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The shared measure for the whole site: 1280px with responsive gutters.
 * Nothing should set its own max-width — use this so every section lines up.
 */
export function Container({
  as: Component = "div",
  className,
  children,
  size = "default",
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  size?: "default" | "narrow" | "wide";
}) {
  return (
    <Component
      className={cn(
        "mx-auto w-full px-5 sm:px-6 lg:px-8",
        size === "default" && "max-w-[1280px]",
        size === "narrow" && "max-w-[840px]",
        size === "wide" && "max-w-[1440px]",
        className,
      )}
    >
      {children}
    </Component>
  );
}
