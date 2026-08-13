import { ArrowRight } from "lucide-react";

import { TutorCard } from "@/components/cards/TutorCard";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Centre } from "@/config/types";
import { featuredTutors, subjectsForTutor } from "@/lib/content";
import { sectionCopy } from "@/lib/section-copy";
import { whatsappHref } from "@/lib/whatsapp";

/**
 * Homepage tutors preview.
 * Desktop 4 columns · tablet 2 · mobile 1.
 */
export function TutorsSection({ centre }: { centre: Centre }) {
  if (!centre.featureFlags.tutors || centre.tutors.length === 0) return null;

  const tutors = featuredTutors(centre, 4);
  const whatsapp = centre.featureFlags.whatsapp ? centre.whatsapp : undefined;

  const copy = sectionCopy(centre, "tutors", {
    eyebrow: "Our tutors",
    heading: "Know exactly who's teaching your child",
    highlight: "who's teaching your child",
    description:
      "No rotating pool of part-timers. Each subject has a named tutor who stays with the group for the year.",
  });

  return (
    <Section tone="warm" ariaLabelledBy="tutors-heading">
      <SectionHeader
        eyebrow={copy.eyebrow}
        heading={copy.heading}
        highlight={copy.highlight}
        highlightAnimation={copy.highlightAnimation}
        description={copy.description}
        headingId="tutors-heading"
        align="left"
        action={
          <ButtonLink href="/tutors" variant="secondary">
            Meet all tutors
            <ArrowRight aria-hidden="true" className="size-4" />
          </ButtonLink>
        }
      />

      <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
        {tutors.map((tutor, index) => (
          <Reveal key={tutor.slug} delay={index * 70} className="h-full">
            <TutorCard
              tutor={tutor}
              subjects={subjectsForTutor(centre, tutor)}
              variant={centre.componentVariants.tutors}
              className="h-full"
              whatsappHref={whatsappHref(whatsapp, "tutor", {
                centre: centre.identity.name,
                tutor: tutor.name,
              })}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
