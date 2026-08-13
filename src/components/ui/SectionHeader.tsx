import type { ReactNode } from "react";

import { AnimatedHeading } from "@/components/ui/DropRevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { HighlightAnimation } from "@/config/types";
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
 * sentence rather than three disconnected strings, and `highlightAnimation`
 * decides whether that fragment drops in when the section is reached.
 */
export function SectionHeader({
  eyebrow,
  heading,
  highlight,
  highlightAnimation = "none",
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
  highlightAnimation?: HighlightAnimation;
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
          "flex max-w-2xl flex-col gap-4",
          align === "center" ? "items-center" : "items-start",
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
            "text-3xl leading-[1.15] font-bold sm:text-4xl lg:text-[2.6rem]",
            tone === "dark" ? "text-white" : "text-ink",
          )}
        >
          <HighlightedHeading
            heading={heading}
            highlight={highlight}
            highlightAnimation={highlightAnimation}
            tone={tone}
          />
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

export function HighlightedHeading({
  heading,
  highlight,
  highlightAnimation = "none",
  tone = "light",
}: {
  heading: string;
  highlight?: string;
  highlightAnimation?: HighlightAnimation;
  tone?: "light" | "dark";
}) {
  return (
    <AnimatedHeading
      heading={heading}
      highlight={highlight}
      animation={highlightAnimation}
      highlightClassName={tone === "dark" ? "text-white" : "text-gradient-brand"}
    />
  );
}
