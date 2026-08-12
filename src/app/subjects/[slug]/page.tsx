import { CheckCircle2, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ClassCard } from "@/components/cards/ClassCard";
import { TutorCard } from "@/components/cards/TutorCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { ParentLeadSection } from "@/components/sections/ParentLeadSection";
import { TrialCtaSection } from "@/components/sections/CtaSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Prose } from "@/components/ui/Prose";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SUBJECT_CATEGORY_LABELS } from "@/config/constants";
import {
  classesForSubject,
  findSubject,
  isSubjectIndexable,
  subjectsForTutor,
  tutorsForSubject,
} from "@/lib/content";
import { buildMetadata, subjectPageTitle } from "@/lib/seo";
import { getCentre } from "@/lib/site";
import {
  breadcrumbSchema,
  faqSchema,
  structuredDataEnabled,
} from "@/lib/structured-data";
import { listToSentence } from "@/lib/utils";
import { classCardProps } from "@/lib/view-models";
import { whatsappHref } from "@/lib/whatsapp";

type Params = { slug: string };

/** Statically generates one page per subject when detail pages are enabled. */
export function generateStaticParams(): Params[] {
  const centre = getCentre();
  if (!centre.featureFlags.subjectDetailPages) return [];
  return centre.subjects.map((subject) => ({ slug: subject.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const centre = getCentre();
  const { slug } = await params;
  const subject = findSubject(centre, slug);

  if (!subject) return buildMetadata({ title: "Subject not found", description: "", path: `/subjects/${slug}`, noindex: true });

  return buildMetadata({
    title: subjectPageTitle(centre, subject),
    description: subject.detail?.intro ?? subject.summary,
    path: `/subjects/${subject.slug}`,
    // Subjects without unique detail content stay available to visitors but
    // are never indexed — thin pages hurt the whole domain.
    noindex: !isSubjectIndexable(centre, subject),
  });
}

export default async function SubjectPage({ params }: { params: Promise<Params> }) {
  const centre = getCentre();
  if (!centre.featureFlags.subjectDetailPages) notFound();

  const { slug } = await params;
  const subject = findSubject(centre, slug);
  if (!subject) notFound();

  const classes = centre.featureFlags.classes ? classesForSubject(centre, subject.slug) : [];
  const tutors = centre.featureFlags.tutors ? tutorsForSubject(centre, subject.slug) : [];
  const whatsapp = centre.featureFlags.whatsapp ? centre.whatsapp : undefined;
  const askHref = whatsappHref(whatsapp, "subject", {
    centre: centre.identity.name,
    subject: subject.name,
  });

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Subjects", path: "/subjects" },
    { name: subject.name, path: `/subjects/${subject.slug}` },
  ];

  return (
    <>
      <PageHeader
        eyebrow={SUBJECT_CATEGORY_LABELS[subject.category]}
        title={`${subject.name} tuition`}
        highlight={subject.name}
        description={subject.summary}
        breadcrumbs={crumbs}
        actions={
          <>
            {centre.featureFlags.trialRegistration ? (
              <ButtonLink href={`/trial?subject=${subject.slug}`} size="lg">
                Book a trial class
              </ButtonLink>
            ) : null}
            {askHref ? (
              <ButtonLink href={askHref} external variant="secondary" size="lg">
                <MessageCircle aria-hidden="true" className="size-4" />
                Ask about {subject.shortName ?? subject.name}
              </ButtonLink>
            ) : null}
          </>
        }
        aside={
          subject.image ? (
            <Image
              src={subject.image.src}
              alt=""
              width={subject.image.width}
              height={subject.image.height}
              sizes="(max-width: 1024px) 60vw, 420px"
              priority
              className="mx-auto w-full max-w-sm rounded-3xl bg-brand-soft-2 p-8"
            />
          ) : null
        }
      />

      {/* Levels + intro */}
      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-ink">Levels taught:</span>
              {subject.levels.map((level) => (
                <Pill key={level} tone="brand" size="sm">
                  {level}
                </Pill>
              ))}
            </div>

            <Prose size="lg">
              <p>{subject.detail?.intro ?? subject.summary}</p>
            </Prose>
          </div>

          {subject.detail?.outcomes.length ? (
            <Card tone="warm" padding="lg" className="h-fit">
              <h2 className="text-lg font-bold text-ink">
                What students will be able to do
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {subject.detail.outcomes.map((outcome) => (
                  <li key={outcome} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 size-4.5 shrink-0 text-brand"
                    />
                    {outcome}
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
        </div>
      </Section>

      {/* Teaching approach */}
      {subject.detail?.approach.length ? (
        <Section tone="warm" ariaLabelledBy="approach-heading">
          <SectionHeader
            eyebrow="How we teach it"
            heading={`Our approach to ${subject.name}`}
            highlight={subject.name}
            headingId="approach-heading"
            align="left"
          />
          <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-3">
            {subject.detail.approach.map((item, index) => (
              <Card key={item.title} padding="md" className="h-full">
                <span
                  aria-hidden="true"
                  className="text-sm font-extrabold text-brand/40 tabular-nums"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-lg font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Related classes */}
      {classes.length > 0 ? (
        <Section tone="surface" ariaLabelledBy="subject-classes-heading">
          <SectionHeader
            eyebrow="Weekly classes"
            heading={`${subject.name} classes you can join`}
            highlight="you can join"
            description={`Currently running for ${listToSentence(
              [...new Set(classes.map((klass) => klass.level))],
            )}.`}
            headingId="subject-classes-heading"
            align="left"
          />
          <ul className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-2 lg:grid-cols-3">
            {classes.map((klass) => (
              <li key={klass.slug} className="h-full">
                <ClassCard {...classCardProps(centre, klass)} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* Tutors who teach it */}
      {tutors.length > 0 ? (
        <Section tone="warm" ariaLabelledBy="subject-tutors-heading">
          <SectionHeader
            eyebrow="Who teaches it"
            heading={`Tutors for ${subject.name}`}
            highlight={subject.name}
            headingId="subject-tutors-heading"
            align="left"
          />
          <ul className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
            {tutors.map((tutor) => (
              <li key={tutor.slug} className="h-full">
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
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* FAQs */}
      {subject.detail?.faqs?.length ? (
        <Section tone="surface" containerSize="narrow" ariaLabelledBy="subject-faq-heading">
          <SectionHeader
            eyebrow="Common questions"
            heading={`${subject.name} — questions parents ask`}
            highlight="questions parents ask"
            headingId="subject-faq-heading"
            align="left"
          />
          <dl className="mt-8 flex flex-col gap-4">
            {subject.detail.faqs.map((faq) => (
              <Card key={faq.question} padding="md" tone="warm">
                <dt className="font-bold text-ink">{faq.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-soft">{faq.answer}</dd>
              </Card>
            ))}
          </dl>
        </Section>
      ) : null}

      <ParentLeadSection centre={centre} defaultSubject={subject.slug} />
      <TrialCtaSection centre={centre} />

      {structuredDataEnabled() ? (
        <>
          <JsonLd data={breadcrumbSchema(crumbs)} />
          {subject.detail?.faqs?.length ? (
            <JsonLd data={faqSchema(subject.detail.faqs)} />
          ) : null}
        </>
      ) : null}
    </>
  );
}
