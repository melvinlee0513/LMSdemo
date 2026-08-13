import { CTAGroup } from "@/components/cards/CTAGroup";
import { Section } from "@/components/ui/Section";
import type {
  Centre,
  CtaSection as CtaSectionConfig,
  HighlightAnimation,
} from "@/config/types";
import { whatsappHref } from "@/lib/whatsapp";

/**
 * Conversion block. Used for both the trial CTA mid-page and the final CTA at
 * the end — same component, different configured content.
 */
export function CtaSection({
  centre,
  cta,
  tone = "surface",
  variant,
  highlightAnimation = "none",
}: {
  centre: Centre;
  cta?: CtaSectionConfig;
  tone?: "surface" | "warm" | "soft" | "muted";
  variant?: "boxed" | "banner";
  highlightAnimation?: HighlightAnimation;
}) {
  if (!cta) return null;

  const whatsapp = centre.featureFlags.whatsapp ? centre.whatsapp : undefined;

  return (
    <Section tone={tone} spacing="compact">
      <CTAGroup
        cta={cta}
        variant={variant ?? centre.componentVariants.cta}
        highlightAnimation={highlightAnimation}
        whatsappHref={whatsappHref(whatsapp, "general", {
          centre: centre.identity.name,
        })}
      />
    </Section>
  );
}

export function TrialCtaSection({ centre }: { centre: Centre }) {
  if (!centre.featureFlags.trialRegistration) return null;
  return <CtaSection centre={centre} cta={centre.trialCta} tone="surface" />;
}

/** The closing block is its own screen, so its heading earns the drop reveal. */
export function FinalCtaSection({ centre }: { centre: Centre }) {
  return (
    <CtaSection
      centre={centre}
      cta={centre.finalCta}
      tone="surface"
      highlightAnimation="drop"
    />
  );
}
