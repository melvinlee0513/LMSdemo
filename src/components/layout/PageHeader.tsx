import type { ReactNode } from "react";

import { Breadcrumbs, type Crumb } from "@/components/seo/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { HighlightedHeading } from "@/components/ui/SectionHeader";
import type { HighlightAnimation } from "@/config/types";
import { cn } from "@/lib/utils";

/**
 * The standard top of every inner page: breadcrumbs, one H1, a supporting
 * paragraph and optional actions. Consistent placement means the page's
 * subject is always the first thing announced.
 */
export function PageHeader({
  eyebrow,
  title,
  highlight,
  highlightAnimation = "none",
  description,
  breadcrumbs,
  actions,
  aside,
  className,
}: {
  eyebrow?: string;
  title: string;
  highlight?: string;
  /** Page titles animate only where the page is a deliberate landing moment. */
  highlightAnimation?: HighlightAnimation;
  description?: string;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden bg-surface-warm", className)}>
      <div
        aria-hidden="true"
        className="surface-glow pointer-events-none absolute inset-x-0 top-0 h-72"
      />

      <Container className="relative pt-8 pb-12 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20">
        {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} className="mb-6" /> : null}

        <div
          className={cn(
            "flex flex-col gap-6",
            Boolean(aside) &&
              "lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center lg:gap-14",
          )}
        >
          <div className="flex max-w-3xl flex-col gap-4">
            {eyebrow ? <SectionLabel className="self-start">{eyebrow}</SectionLabel> : null}

            <h1 className="text-[2.125rem] leading-[1.1] font-extrabold text-ink sm:text-5xl lg:text-[3.25rem]">
              <HighlightedHeading
                heading={title}
                highlight={highlight}
                highlightAnimation={highlightAnimation}
              />
            </h1>

            {description ? (
              <p className="max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
                {description}
              </p>
            ) : null}

            {actions ? (
              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                {actions}
              </div>
            ) : null}
          </div>

          {aside}
        </div>
      </Container>
    </section>
  );
}
