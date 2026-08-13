import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/PageHeader";
import { TrialCtaSection } from "@/components/sections/CtaSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { TimetableBoard } from "@/components/timetable/TimetableBoard";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { buildMetadata, pageDescription } from "@/lib/seo";
import { getCentre } from "@/lib/site";
import { breadcrumbSchema, structuredDataEnabled } from "@/lib/structured-data";
import { listToSentence } from "@/lib/utils";
import {
  levelOptions,
  locationOptions,
  subjectOptions,
  timetableEntries,
} from "@/lib/view-models";

export function generateMetadata(): Metadata {
  const centre = getCentre();
  const levels = [...new Set(centre.classes.map((klass) => klass.level))];

  return buildMetadata({
    title: "Tuition Class Timetable",
    description: pageDescription(
      "timetable",
      `The full weekly timetable at ${centre.identity.name} for ${listToSentence(levels)}. Filter by form, subject and branch to find a session that fits.`,
    ),
    path: "/timetable",
    noindex: !centre.featureFlags.timetable || centre.classes.length === 0,
  });
}

export default function TimetablePage() {
  const centre = getCentre();
  if (!centre.featureFlags.timetable) notFound();

  const branches = centre.locations.length;

  return (
    <>
      <PageHeader
        eyebrow="Weekly timetable"
        title="Find a class that fits your week"
        highlight="fits your week"
        highlightAnimation="drop"
        description={
          branches > 1
            ? "Filter by form, subject and branch to see exactly when each class runs. On a phone, pick a day and read it as a list."
            : "Filter by form and subject to see exactly when each class runs. On a phone, pick a day and read it as a list."
        }
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Timetable", path: "/timetable" },
        ]}
        actions={
          centre.featureFlags.classes ? (
            <ButtonLink href="/classes" variant="secondary">
              See classes with full details
            </ButtonLink>
          ) : null
        }
      />

      <Section tone="surface" containerSize="wide">
        <TimetableBoard
          entries={timetableEntries(centre)}
          levels={levelOptions(centre)}
          subjects={subjectOptions(centre)}
          locations={locationOptions(centre)}
          layout="responsive"
        />
      </Section>

      <TrialCtaSection centre={centre} />

      {structuredDataEnabled() ? (
        <JsonLd
          data={breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Timetable", path: "/timetable" },
          ])}
        />
      ) : null}
    </>
  );
}
