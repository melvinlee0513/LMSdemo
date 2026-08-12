import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StatCard } from "@/components/cards/StatCard";
import { TutorCard } from "@/components/cards/TutorCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { FinalCtaSection } from "@/components/sections/CtaSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { subjectsForTutor } from "@/lib/content";
import { buildMetadata, pageDescription } from "@/lib/seo";
import { getCentre } from "@/lib/site";
import { breadcrumbSchema, structuredDataEnabled } from "@/lib/structured-data";
import { listToSentence } from "@/lib/utils";
import { whatsappHref } from "@/lib/whatsapp";

export function generateMetadata(): Metadata {
  const centre = getCentre();
  const subjects = centre.subjects.map((subject) => subject.name);

  return buildMetadata({
    title: "Meet Our Tutors",
    description: pageDescription(
      "tutors",
      `The tutors who teach ${listToSentence(subjects)} at ${centre.identity.name}. Every subject has a named tutor who stays with the group for the year.`,
    ),
    path: "/tutors",
    noindex: !centre.featureFlags.tutors || centre.tutors.length === 0,
  });
}

export default function TutorsPage() {
  const centre = getCentre();
  if (!centre.featureFlags.tutors) notFound();

  const whatsapp = centre.featureFlags.whatsapp ? centre.whatsapp : undefined;

  return (
    <>
      <PageHeader
        eyebrow="Our tutors"
        title="The people who will teach your child"
        highlight="teach your child"
        description="Small groups only work when the tutor is good. These are the people who will be in the room — what they teach, and how long they have been doing it."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Tutors", path: "/tutors" },
        ]}
      />

      {centre.stats.length > 0 ? (
        <Section tone="surface" spacing="compact" ariaLabel="Teaching team at a glance">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {centre.stats.map((stat) => (
              <StatCard key={stat.label} stat={stat} className="h-full" />
            ))}
          </div>
        </Section>
      ) : null}

      <Section tone="warm" ariaLabelledBy="tutor-list-heading">
        <SectionHeader
          eyebrow="Teaching team"
          heading={`${centre.tutors.length} tutors across ${centre.subjects.length} subjects`}
          highlight={`${centre.subjects.length} subjects`}
          headingId="tutor-list-heading"
          align="left"
        />

        <ul className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
          {centre.tutors.map((tutor, index) => (
            <Reveal as="li" key={tutor.slug} delay={index * 60} className="h-full">
              <TutorCard
                tutor={tutor}
                subjects={subjectsForTutor(centre, tutor)}
                variant={centre.componentVariants.tutors}
                className="h-full"
                imagePriority={index < 2}
                whatsappHref={whatsappHref(whatsapp, "tutor", {
                  centre: centre.identity.name,
                  tutor: tutor.name,
                })}
              />
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Expertise detail — the substance behind the cards */}
      <Section tone="surface" ariaLabelledBy="tutor-detail-heading">
        <SectionHeader
          eyebrow="In more detail"
          heading="What each tutor specialises in"
          highlight="specialises in"
          headingId="tutor-detail-heading"
          align="left"
        />

        <ul className="mt-10 grid gap-5 sm:mt-12 lg:grid-cols-2">
          {centre.tutors.map((tutor) => (
            <li key={tutor.slug} className="h-full">
              <Card as="article" padding="md" className="flex h-full flex-col gap-3">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-lg font-bold text-ink">{tutor.name}</h3>
                  {tutor.role ? (
                    <span className="text-sm text-ink-muted">{tutor.role}</span>
                  ) : null}
                </div>

                <p className="text-sm leading-relaxed text-ink-soft">{tutor.bio}</p>

                <div className="flex flex-wrap gap-1.5">
                  {tutor.expertise.map((item) => (
                    <Pill key={item} tone="neutral" size="sm">
                      {item}
                    </Pill>
                  ))}
                </div>

                {tutor.qualifications?.length ? (
                  <p className="mt-auto border-t border-line pt-3 text-xs text-ink-muted">
                    <span className="font-semibold text-ink-soft">Qualifications:</span>{" "}
                    {tutor.qualifications.join(" · ")}
                  </p>
                ) : null}
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <FinalCtaSection centre={centre} />

      {structuredDataEnabled() ? (
        <JsonLd
          data={breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Tutors", path: "/tutors" },
          ])}
        />
      ) : null}
    </>
  );
}
