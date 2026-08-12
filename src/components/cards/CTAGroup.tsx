import { Check, MessageCircle } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { HighlightedHeading } from "@/components/ui/SectionHeader";
import type { CtaSection } from "@/config/types";
import { cn } from "@/lib/utils";

export type CTAGroupProps = {
  cta: CtaSection;
  whatsappHref?: string;
  variant?: "boxed" | "banner";
  className?: string;
};

/**
 * End-of-page conversion block.
 *
 *   boxed   white/warm card, warm border, soft orange glow (the default)
 *   banner  full-width brand gradient — use at most once per page
 */
export function CTAGroup({
  cta,
  whatsappHref,
  variant = "boxed",
  className,
}: CTAGroupProps) {
  const dark = variant === "banner";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] px-6 py-10 text-center sm:px-10 sm:py-14",
        dark
          ? "gradient-brand text-white"
          : "border border-line-warm bg-surface-warm shadow-soft",
        className,
      )}
    >
      {!dark ? (
        <div
          aria-hidden="true"
          className="surface-glow pointer-events-none absolute inset-0"
        />
      ) : null}

      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5">
        {cta.eyebrow ? (
          <SectionLabel tone={dark ? "inverse" : "soft"}>{cta.eyebrow}</SectionLabel>
        ) : null}

        <h2
          className={cn(
            "text-3xl leading-[1.15] font-bold sm:text-4xl",
            dark ? "text-white" : "text-ink",
          )}
        >
          {dark ? (
            cta.heading
          ) : (
            <HighlightedHeading heading={cta.heading} highlight={cta.highlight} />
          )}
        </h2>

        {cta.description ? (
          <p
            className={cn(
              "text-base leading-relaxed sm:text-lg",
              dark ? "text-white/85" : "text-ink-soft",
            )}
          >
            {cta.description}
          </p>
        ) : null}

        {cta.bullets?.length ? (
          <ul
            className={cn(
              "flex flex-col items-start gap-2.5 text-left sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6",
            )}
          >
            {cta.bullets.map((bullet) => (
              <li key={bullet} className="flex items-center gap-2 text-sm font-medium">
                <span
                  className={cn(
                    "inline-flex size-5 shrink-0 items-center justify-center rounded-full",
                    dark ? "bg-white/20 text-white" : "bg-brand-soft text-brand",
                  )}
                >
                  <Check aria-hidden="true" className="size-3" strokeWidth={3} />
                </span>
                <span className={dark ? "text-white/90" : "text-ink-soft"}>{bullet}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-2 flex w-full flex-col items-center gap-3 sm:w-auto">
          <ButtonLink
            href={cta.primaryCta.href}
            size="lg"
            variant={dark ? "dark" : "primary"}
            className="w-full sm:w-auto"
          >
            {cta.primaryCta.label}
          </ButtonLink>

          {cta.whatsapp && whatsappHref ? (
            <p
              className={cn(
                "flex flex-wrap items-center justify-center gap-2 text-sm",
                dark ? "text-white/80" : "text-ink-muted",
              )}
            >
              {cta.secondaryLabel ? <span>{cta.secondaryLabel}</span> : null}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 font-semibold transition-colors duration-200",
                  dark ? "text-white hover:bg-white/10" : "text-brand hover:bg-brand-soft",
                )}
              >
                <MessageCircle aria-hidden="true" className="size-4" />
                Chat on WhatsApp
              </a>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
