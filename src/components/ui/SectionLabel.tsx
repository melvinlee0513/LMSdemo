import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The small blush "eyebrow" pill that opens most sections.
 *
 * It carries the site's only ambient motion outside the hero: a slow breathe
 * on the pill and a matching pulse on the dot. The amplitude is deliberately
 * below the threshold of conscious attention — enough to keep the page from
 * feeling like a static document, not enough to compete with content.
 *
 * The animation names come from `--anim-breathe` / `--anim-dot`, which
 * <CentreTheme /> sets to `none` when a centre disables breathing eyebrows.
 */
export function SectionLabel({
  children,
  className,
  tone = "soft",
  /** Offsets the breathe cycle so multiple labels never pulse in unison. */
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  tone?: "soft" | "outline" | "inverse";
  delay?: number;
}) {
  const style = { "--breathe-delay": `${delay}s` } as CSSProperties;

  return (
    <span
      style={style}
      className={cn(
        "breathe inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide uppercase",
        tone === "soft" && "bg-brand-soft text-brand",
        tone === "outline" && "border border-line-warm bg-surface text-brand",
        tone === "inverse" && "bg-white/10 text-white",
        className,
      )}
    >
      <span aria-hidden="true" className="breathe-dot size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
