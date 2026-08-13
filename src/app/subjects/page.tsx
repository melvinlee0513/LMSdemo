import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SubjectExplorer } from "@/components/explore/SubjectExplorer";
import { PageHeader } from "@/components/layout/PageHeader";
import { TrialCtaSection } from "@/components/sections/CtaSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { subjectCategoriesInUse } from "@/lib/content";
import { buildMetadata, pageDescription } from "@/lib/seo";
import { getCentre } from "@/lib/site";
import { breadcrumbSchema, structuredDataEnabled } from "@/lib/structured-data";
import { listToSentence } from "@/lib/utils";
import { subjectCardProps } from "@/lib/view-models";

export function generateMetadata(): Metadata {
  const centre = getCentre();
  const names = centre.subjects.map((subject) => subject.name);
  const where = centre.identity.city ? ` in ${centre.identity.city}` : "";

  return buildMetadata({
    title: "Subjects & Tuition Programmes",
    description: pageDescription(
      "subjects",
      `Tuition${where} in ${listToSentence(names)}. Small groups, named tutors and weekly marked practice for every subject ${centre.identity.name} teaches.`,
    ),
    path: "/subjects",
    noindex: !centre.featureFlags.subjects || centre.subjects.length === 0,
  });
}

export default function SubjectsPage() {
  const centre = getCentre();
  if (!centre.featureFlags.subjects) notFound();

  const cards = centre.subjects.map((subject) => subjectCardProps(centre, subject));
  const where = centre.identity.city ? ` in ${centre.identity.city}` : "";

  return (
    <>
      <PageHeader
        eyebrow="Our subjects"
        title={`What your child can study${where}`}
        highlight="can study"
        highlightAnimation="drop"
        description="Each subject runs as a capped small group with its own tutor. Open one to see what's covered, who teaches it and when the classes run."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Subjects", path: "/subjects" },
        ]}
        actions={
          centre.featureFlags.timetable ? (
            <ButtonLink href="/timetable" variant="secondary">
              See the weekly timetable
            </ButtonLink>
          ) : null
        }
      />

      <Section tone="surface">
        <SubjectExplorer
          cards={cards}
          categories={subjectCategoriesInUse(centre)}
          stacked={centre.motion.subjectStacking}
        />
      </Section>

      <TrialCtaSection centre={centre} />

      {structuredDataEnabled() ? (
        <JsonLd
          data={breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Subjects", path: "/subjects" },
          ])}
        />
      ) : null}
    </>
  );
}
