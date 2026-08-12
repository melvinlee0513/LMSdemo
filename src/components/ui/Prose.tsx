import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Long-form copy blocks (about narrative, subject intros, privacy notice).
 * Line length is capped for readability rather than stretched to the grid.
 */
export function Prose({
  children,
  className,
  size = "md",
}: {
  children: ReactNode;
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <div
      className={cn(
        "flex max-w-[68ch] flex-col gap-4 leading-relaxed text-ink-soft",
        size === "md" ? "text-base" : "text-base sm:text-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-line", className)} />;
}
