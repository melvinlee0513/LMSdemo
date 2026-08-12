import type { ReactNode } from "react";

import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/utils";

/**
 * The repeated section-opening pattern:
 *
 *   [ Our Subjects ]
 *   Master Your SPM Subjects
 *                ^ highlighted fragment
 *   Supporting description explaining the section.
 *
 * `highlight` is matched inside `heading` so centres write one natural
 * sentence rather than three disconnected strings.
 */
export function SectionHeader({
  eyebrow,
  heading,
  highlight,
  description,
  align = "center",
  headingId,
  level: Heading = "h2",
  className,
  action,
  tone = "light",
}: {
  eyebrow?: string;
  heading: string;
  highlight?: string;
  description?: string;
  align?: "center" | "left";
  headingId?: string;
  level?: "h1" | "h2" | "h3";
  className?: string;
  action?: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        align === "left" && "items-start text-left",
        Boolean(action) && "lg:flex-row lg:items-end lg:justify-between lg:gap-10",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-4",
          align === "center" ? "items-center" : "items-start",
          align === "center" ? "max-w-2xl" : "max-w-2xl",
        )}
      >
        {eyebrow ? (
          <SectionLabel tone={tone === "dark" ? "inverse" : "soft"}>
            {eyebrow}
          </SectionLabel>
        ) : null}

        <Heading
          id={headingId}
          className={cn(
            "text-3xl leading-[1.15] font-bold sm:text-4xl lg:text-[2.75rem]",
            tone === "dark" ? "text-white" : "text-ink",
          )}
        >
          <HighlightedHeading heading={heading} highlight={highlight} />
        </Heading>

        {description ? (
          <p
            className={cn(
              "text-base leading-relaxed sm:text-lg",
              tone === "dark" ? "text-white/70" : "text-ink-soft",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/**
 * Splits a heading around its highlighted fragment. If the fragment is not
 * found the heading renders unchanged — a configuration typo degrades to
 * plain text rather than breaking the page.
 */
export function HighlightedHeading({
  heading,
  highlight,
}: {
  heading: string;
  highlight?: string;
}) {
  if (!highlight) return <>{heading}</>;

  const index = heading.indexOf(highlight);
  if (index === -1) return <>{heading}</>;

  return (
    <>
      {heading.slice(0, index)}
      <span className="text-gradient-brand">{highlight}</span>
      {heading.slice(index + highlight.length)}
    </>
  );
}
