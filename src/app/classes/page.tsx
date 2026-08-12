import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClassExplorer } from "@/components/explore/ClassExplorer";
import { PageHeader } from "@/components/layout/PageHeader";
import { TrialCtaSection } from "@/components/sections/CtaSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { sortClasses } from "@/lib/content";
import { buildMetadata, pageDescription } from "@/lib/seo";
import { getCentre } from "@/lib/site";
import { breadcrumbSchema, structuredDataEnabled } from "@/lib/structured-data";
import { listToSentence } from "@/lib/utils";
import {
  classCardProps,
  levelOptions,
  locationOptions,
  subjectOptions,
} from "@/lib/view-models";

export function generateMetadata(): Metadata {
  const centre = getCentre();
  const levels = [...new Set(centre.classes.map((klass) => klass.level))];
  const where = centre.identity.city ? ` in ${centre.identity.city}` : "";

  return buildMetadata({
    title: "Class Schedule & Enrolment",
    description: pageDescription(
      "classes",
      `Every weekly class running at ${centre.identity.name}${where} — ${listToSentence(levels)}. Filter by form, subject, branch and day, then book a trial session.`,
    ),
    path: "/classes",
    noindex: !centre.featureFlags.classes || centre.classes.length === 0,
  });
}

export default function ClassesPage() {
  const centre = getCentre();
  if (!centre.featureFlags.classes) notFound();

  const cards = sortClasses(centre.classes).map((klass) => classCardProps(centre, klass));

  return (
    <>
      <PageHeader
        eyebrow="Weekly classes"
        title="Every class you can enrol into"
        highlight="enrol into"
        description="A class is a real weekly session with a named tutor, a fixed time and a capped group. Filter to find the ones that fit your child's form and your family's schedule."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Classes", path: "/classes" },
        ]}
        actions={
          centre.featureFlags.timetable ? (
            <ButtonLink href="/timetable" variant="secondary">
              View as a weekly timetable
            </ButtonLink>
          ) : null
        }
      />

      <Section tone="surface">
        <ClassExplorer
          cards={cards}
          levels={levelOptions(centre)}
          subjects={subjectOptions(centre)}
          locations={locationOptions(centre)}
        />
      </Section>

      <TrialCtaSection centre={centre} />

      {structuredDataEnabled() ? (
        <JsonLd
          data={breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Classes", path: "/classes" },
          ])}
        />
      ) : null}
    </>
  );
}
