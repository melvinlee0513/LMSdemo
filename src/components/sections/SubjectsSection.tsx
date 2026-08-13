import { ArrowRight } from "lucide-react";

import { SubjectCard } from "@/components/cards/SubjectCard";
import { SubjectStack } from "@/components/sections/SubjectStack";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Centre } from "@/config/types";
import { featuredSubjects } from "@/lib/content";
import { sectionCopy } from "@/lib/section-copy";
import { cn } from "@/lib/utils";
import { subjectCardProps } from "@/lib/view-models";

/**
 * Homepage subjects preview.
 *
 * Variants:
 *   split-cards  full-width split cards that stack as you scroll (reference)
 *   grid         three compact cards per row
 *   editorial    two split cards per row
 *
 * Only `split-cards` stacks: the effect needs full-width cards in a single
 * column to read as layering rather than as clutter.
 */
export function SubjectsSection({ centre }: { centre: Centre }) {
  if (!centre.featureFlags.subjects || centre.subjects.length === 0) return null;

  const variant = centre.componentVariants.subjects;
  const subjects = featuredSubjects(centre, variant === "grid" ? 6 : 3);
  const stacked = variant === "split-cards" && centre.motion.subjectStacking;

  const copy = sectionCopy(centre, "subjects", {
    eyebrow: "Our subjects",
    heading: "What your child can study with us",
    highlight: "study with us",
    description:
      "Each subject has its own tutor, small-group classes and weekly practice that gets marked, not forgotten.",
  });

  const cards = subjects.map((subject, index) => (
    <SubjectCard
      key={subject.slug}
      {...subjectCardProps(centre, subject, index)}
      variant={variant === "grid" ? "grid" : "split"}
      className="h-full"
    />
  ));

  return (
    <Section tone="warm" ariaLabelledBy="subjects-heading">
      <SectionHeader
        eyebrow={copy.eyebrow}
        heading={copy.heading}
        highlight={copy.highlight}
        highlightAnimation={copy.highlightAnimation}
        description={copy.description}
        headingId="subjects-heading"
        align="center"
      />

      <div className="mt-10 sm:mt-12">
        {stacked ? (
          <SubjectStack items={cards} />
        ) : (
          <div
            className={cn(
              "grid gap-5",
              variant === "grid" && "sm:grid-cols-2 lg:grid-cols-3",
              variant === "editorial" && "lg:grid-cols-2",
            )}
          >
            {cards.map((card, index) => (
              <Reveal key={subjects[index]!.slug} delay={index * 70}>
                {card}
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {centre.subjects.length > subjects.length ? (
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/subjects" variant="secondary" size="lg">
            See all {centre.subjects.length} subjects
            <ArrowRight aria-hidden="true" className="size-4" />
          </ButtonLink>
        </div>
      ) : null}
    </Section>
  );
}
