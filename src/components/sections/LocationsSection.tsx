import { LocationCard } from "@/components/cards/LocationCard";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Centre } from "@/config/types";
import { subjectsForLocation } from "@/lib/content";
import { sectionCopy } from "@/lib/section-copy";
import { whatsappHref } from "@/lib/whatsapp";

/**
 * Branch section. Also the site's canonical NAP block — name, address and
 * phone rendered identically here and on the locations pages, which is what
 * local search actually rewards.
 */
export function LocationsSection({ centre }: { centre: Centre }) {
  if (!centre.featureFlags.locations || centre.locations.length === 0) return null;

  const whatsapp = centre.featureFlags.whatsapp ? centre.whatsapp : undefined;
  const area = centre.identity.city ? ` in ${centre.identity.city}` : "";

  const copy = sectionCopy(centre, "locations", {
    eyebrow: centre.locations.length > 1 ? "Our branches" : "Where to find us",
    heading:
      centre.locations.length > 1
        ? `Two branches, one teaching standard`
        : `Where to find us${area}`,
    highlight: centre.locations.length > 1 ? "one teaching standard" : undefined,
    description:
      "Drop in during opening hours, or message us first and we will tell you which branch runs the class you need.",
  });

  return (
    <Section tone="warm" ariaLabelledBy="locations-heading">
      <SectionHeader
        eyebrow={copy.eyebrow}
        heading={copy.heading}
        highlight={copy.highlight}
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
