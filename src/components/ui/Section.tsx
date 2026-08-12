import type { ElementType, ReactNode } from "react";

import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export type SectionTone = "surface" | "warm" | "soft" | "muted";
export type SectionSpacing = "default" | "compact" | "loose" | "none";

const toneClasses: Record<SectionTone, string> = {
  surface: "bg-surface",
  warm: "bg-surface-warm",
  soft: "bg-brand-soft-2",
  muted: "bg-surface-muted",
};

/**
 * Section rhythm for the whole site:
 *   mobile 64–80px · tablet 80–96px · desktop 96–120px
 *
 * Alternating `tone` is what keeps the page from reading as one long white
 * scroll — sections are not all identical by design.
 */
const spacingClasses: Record<SectionSpacing, string> = {
  default: "py-16 sm:py-20 lg:py-24",
  compact: "py-12 sm:py-16 lg:py-20",
  loose: "py-20 sm:py-24 lg:py-30",
  none: "",
};

export function Section({
  as: Component = "section",
  tone = "surface",
  spacing = "default",
  id,
  className,
  containerClassName,
  containerSize = "default",
  bleed = false,
  children,
  ariaLabelledBy,
  ariaLabel,
}: {
  as?: ElementType;
  tone?: SectionTone;
  spacing?: SectionSpacing;
  id?: string;
  className?: string;
  containerClassName?: string;
  containerSize?: "default" | "narrow" | "wide";
  /** Skips the container — for sections that manage their own layout. */
  bleed?: boolean;
  children: ReactNode;
  ariaLabelledBy?: string;
  ariaLabel?: string;
}) {
  return (
    <Component
      id={id}
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabel}
      className={cn(toneClasses[tone], spacingClasses[spacing], className)}
    >
      {bleed ? (
        children
      ) : (
        <Container size={containerSize} className={containerClassName}>
          {children}
        </Container>
      )}
    </Component>
  );
}
