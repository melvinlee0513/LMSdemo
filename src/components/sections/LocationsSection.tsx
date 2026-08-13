import { LocationCard } from "@/components/cards/LocationCard";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Centre } from "@/config/types";
import { classesForLocation, subjectsForLocation } from "@/lib/content";
import { sectionCopy } from "@/lib/section-copy";
import { whatsappHref } from "@/lib/whatsapp";

/**
 * Branch section, and the site's canonical NAP block.
 *
 * The copy is chosen by how many locations the centre actually has — talking
 * about "branches" and "different locations" when there is one address reads
 * as a centre pretending to be bigger than it is.
 */
export function LocationsSection({ centre }: { centre: Centre }) {
  if (!centre.featureFlags.locations || centre.locations.length === 0) return null;

  const whatsapp = centre.featureFlags.whatsapp ? centre.whatsapp : undefined;
  const multiple = centre.locations.length > 1;

  const copy = sectionCopy(
    centre,
    "locations",
    multiple
      ? {
          eyebrow: "Our branches",
          heading: "Different locations. One teaching standard.",
          highlight: "One teaching standard.",
          highlightAnimation: "drop",
          description: "Choose the branch that works best for your family.",
        }
      : {
          eyebrow: "Find us",
          heading: "Easy to find. Easy to get started.",
          highlight: "Easy to get started.",
          highlightAnimation: "drop",
          description: "Our location, opening hours and the classes running here.",
        },
  );

  return (
    <Section tone="warm" ariaLabelledBy="locations-heading">
      <SectionHeader
        eyebrow={copy.eyebrow}
        heading={copy.heading}
        highlight={copy.highlight}
        highlightAnimation={copy.highlightAnimation}
        description={copy.description}
        headingId="locations-heading"
      />

      <ul className="mt-10 grid gap-5 sm:mt-12 lg:grid-cols-2">
        {centre.locations.map((location, index) => (
          <Reveal as="li" key={location.slug} delay={index * 70} className="h-full">
            <LocationCard
              location={location}
              centreName={centre.identity.shortName ?? centre.identity.name}
              subjectNames={subjectsForLocation(centre, location).map(
                (subject) => subject.shortName ?? subject.name,
              )}
              classCount={
                centre.featureFlags.classes
                  ? classesForLocation(centre, location.slug).length
                  : undefined
              }
              href={
                centre.featureFlags.locationDetailPages
                  ? `/locations/${location.slug}`
                  : undefined
              }
              whatsappHref={whatsappHref(whatsapp, "location", {
                centre: centre.identity.name,
                branch: location.name,
              })}
            />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
