import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The small blush "eyebrow" pill that opens most sections.
 */
export function SectionLabel({
  children,
  className,
  tone = "soft",
}: {
  children: ReactNode;
  className?: string;
  tone?: "soft" | "outline" | "inverse";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide uppercase",
        tone === "soft" && "bg-brand-soft text-brand",
        tone === "outline" && "border border-line-warm bg-surface text-brand",
        tone === "inverse" && "bg-white/10 text-white",
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
