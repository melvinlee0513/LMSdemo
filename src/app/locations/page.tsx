import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LocationCard } from "@/components/cards/LocationCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { FinalCtaSection } from "@/components/sections/CtaSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { classesForLocation, subjectsForLocation } from "@/lib/content";
import { buildMetadata, pageDescription } from "@/lib/seo";
import { getCentre } from "@/lib/site";
import {
  breadcrumbSchema,
  localBusinessSchema,
  structuredDataEnabled,
} from "@/lib/structured-data";
import { listToSentence } from "@/lib/utils";
import { whatsappHref } from "@/lib/whatsapp";

export function generateMetadata(): Metadata {
  const centre = getCentre();
  const cities = [...new Set(centre.locations.map((location) => location.city))];

  return buildMetadata({
    title: centre.locations.length > 1 ? "Our Branches" : "Find Us",
    description: pageDescription(
      "locations",
      `Where to find ${centre.identity.name}: ${listToSentence(cities)}. Addresses, opening hours and the subjects taught at each branch.`,
    ),
    path: "/locations",
    noindex: !centre.featureFlags.locations || centre.locations.length === 0,
  });
}

export default function LocationsPage() {
  const centre = getCentre();
  if (!centre.featureFlags.locations) notFound();

  const whatsapp = centre.featureFlags.whatsapp ? centre.whatsapp : undefined;
  const cities = [...new Set(centre.locations.map((location) => location.city))];
  const multiple = centre.locations.length > 1;

  return (
    <>
      <PageHeader
        eyebrow={multiple ? "Our branches" : "Find us"}
        title={multiple ? "Different locations. One teaching standard." : "Easy to find. Easy to get started."}
        highlight={multiple ? "One teaching standard." : "Easy to get started."}
        highlightAnimation="drop"
        description={
          multiple
            ? `Choose the branch that works best for your family — ${listToSentence(cities)}.`
            : `Our address, opening hours and the classes running in ${listToSentence(cities)}.`
        }
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
        ]}
      />

      <Section tone="surface">
        <ul className="grid gap-5 lg:grid-cols-2">
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

      <FinalCtaSection centre={centre} />

      {structuredDataEnabled() ? (
        <>
          <JsonLd
            data={breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Locations", path: "/locations" },
            ])}
          />
          {centre.locations.map((location) => (
            <JsonLd key={location.slug} data={localBusinessSchema(location)} />
          ))}
        </>
      ) : null}
    </>
  );
}
