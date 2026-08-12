import { ArrowRight } from "lucide-react";

import { ClassCard } from "@/components/cards/ClassCard";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Centre } from "@/config/types";
import { sortClasses } from "@/lib/content";
import { sectionCopy } from "@/lib/section-copy";
import { classCardProps } from "@/lib/view-models";

/**
 * Homepage classes preview — the answer to "what can my child actually join,
 * and when?". Shows three sessions and links to the full list.
 */
export function ClassesSection({ centre }: { centre: Centre }) {
  if (!centre.featureFlags.classes || centre.classes.length === 0) return null;

  const classes = sortClasses(centre.classes).slice(0, 3);

  const copy = sectionCopy(centre, "classes", {
    eyebrow: "Weekly classes",
    heading: "Classes your child can join this term",
    highlight: "join this term",
    description:
      "Every class has a named tutor, a fixed weekly slot and a capped group size. Book a trial to sit in on a real session first.",
  });

  return (
    <Section tone="surface" ariaLabelledBy="classes-heading">
      <SectionHeader
        eyebrow={copy.eyebrow}
        heading={copy.heading}
        highlight={copy.highlight}
        description={copy.description}
        headingId="classes-heading"
        align="left"
        action={
          <ButtonLink href="/classes" variant="secondary">
            All {centre.classes.length} classes
            <ArrowRight aria-hidden="true" className="size-4" />
          </ButtonLink>
        }
      />

      <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((klass, index) => (
          <Reveal key={klass.slug} delay={index * 70} className="h-full">
            <ClassCard {...classCardProps(centre, klass)} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
