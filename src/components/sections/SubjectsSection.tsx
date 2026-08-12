import { ArrowRight } from "lucide-react";

import { SubjectCard } from "@/components/cards/SubjectCard";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Centre } from "@/config/types";
import { classesForSubject, featuredSubjects, tutorsForSubject } from "@/lib/content";
import { sectionCopy } from "@/lib/section-copy";
import { cn } from "@/lib/utils";
import { whatsappHref } from "@/lib/whatsapp";

/**
 * Homepage subjects preview.
 *
 * Variants:
 *   split-cards  full-width split cards, one per row (the reference design)
 *   grid         three compact cards per row
 *   editorial    two split cards per row
 */
export function SubjectsSection({ centre }: { centre: Centre }) {
  if (!centre.featureFlags.subjects || centre.subjects.length === 0) return null;

  const variant = centre.componentVariants.subjects;
  const subjects = featuredSubjects(centre, variant === "grid" ? 6 : 3);
  const whatsapp = centre.featureFlags.whatsapp ? centre.whatsapp : undefined;

  const copy = sectionCopy(centre, "subjects", {
    eyebrow: "Our subjects",
    heading: `Subjects we teach at ${centre.identity.name}`,
    highlight: "Subjects we teach",
    description:
      "Each subject runs as a small group with its own tutor, weekly marked practice and a clear plan for the year.",
  });

  return (
    <Section tone="warm" ariaLabelledBy="subjects-heading">
      <SectionHeader
        eyebrow={copy.eyebrow}
        heading={copy.heading}
        highlight={copy.highlight}
        description={copy.description}
        headingId="subjects-heading"
        align="center"
      />

      <div
        className={cn(
          "mt-10 grid gap-5 sm:mt-12",
          variant === "grid" && "sm:grid-cols-2 lg:grid-cols-3",
          variant === "editorial" && "lg:grid-cols-2",
        )}
      >
        {subjects.map((subject, index) => (
          <Reveal key={subject.slug} delay={index * 70}>
            <SubjectCard
              subject={subject}
              variant={variant === "grid" ? "grid" : "split"}
              index={index}
              className="h-full"
              tutorCount={tutorsForSubject(centre, subject.slug).length}
              classCount={classesForSubject(centre, subject.slug).length}
              href={
                centre.featureFlags.subjectDetailPages
                  ? `/subjects/${subject.slug}`
                  : undefined
              }
              whatsappHref={whatsappHref(whatsapp, "subject", {
                centre: centre.identity.name,
                subject: subject.name,
              })}
            />
          </Reveal>
        ))}
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
