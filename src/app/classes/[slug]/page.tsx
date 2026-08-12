import { CalendarDays, CheckCircle2, Clock, MapPin, MessageCircle, User } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { ClassCard } from "@/components/cards/ClassCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { TrialCtaSection } from "@/components/sections/CtaSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Prose } from "@/components/ui/Prose";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  CLASS_AVAILABILITY_LABELS,
  CLASS_MODE_LABELS,
} from "@/config/constants";
import {
  classesForSubject,
  findClass,
  findLocation,
  findSubject,
  findTutor,
} from "@/lib/content";
import { buildMetadata, classPageTitle } from "@/lib/seo";
import { getCentre } from "@/lib/site";
import { breadcrumbSchema, structuredDataEnabled } from "@/lib/structured-data";
import { dayLabel, formatDuration, formatTime } from "@/lib/utils";
import { classCardProps } from "@/lib/view-models";
import { whatsappHref } from "@/lib/whatsapp";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  const centre = getCentre();
  if (!centre.featureFlags.classDetailPages) return [];
  return centre.classes.map((klass) => ({ slug: klass.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const centre = getCentre();
  const { slug } = await params;
  const klass = findClass(centre, slug);

  if (!klass) {
    return buildMetadata({
      title: "Class not found",
      description: "",
      path: `/classes/${slug}`,
      noindex: true,
    });
  }

  return buildMetadata({
    title: classPageTitle(centre, klass),
    description: `${klass.description} ${dayLabel(klass.day)}s at ${formatTime(klass.startTime)}.`,
    path: `/classes/${klass.slug}`,
    // Individual class pages are usually too similar to each other to deserve
    // indexing; a centre opts a class in explicitly.
    noindex: !klass.seoIndexable,
  });
}

export default async function ClassPage({ params }: { params: Promise<Params> }) {
  const centre = getCentre();
  if (!centre.featureFlags.classDetailPages) notFound();

  const { slug } = await params;
  const klass = findClass(centre, slug);
  if (!klass) notFound();

  const subject = findSubject(centre, klass.subject);
  const tutor = klass.tutor ? findTutor(centre, klass.tutor) : undefined;
  const location = klass.location ? findLocation(centre, klass.location) : undefined;
  const whatsapp = centre.featureFlags.whatsapp ? centre.whatsapp : undefined;

  const related = subject
    ? classesForSubject(centre, subject.slug).filter((item) => item.slug !== klass.slug)
    : [];

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Classes", path: "/classes" },
    { name: klass.title, path: `/classes/${klass.slug}` },
  ];

  const facts = [
    { icon: CalendarDays, label: "Day", value: `${dayLabel(klass.day)}s` },
    {
      icon: Clock,
      label: "Time",
      value: `${formatTime(klass.startTime)} – ${formatTime(klass.endTime)} (${formatDuration(klass.startTime, klass.endTime)})`,
    },
    ...(tutor && centre.featureFlags.tutors
      ? [{ icon: User, label: "Tutor", value: tutor.name }]
      : []),
    {
      icon: MapPin,
      label: "Where",
      value: location ? `${location.name} · ${CLASS_MODE_LABELS[klass.mode]}` : CLASS_MODE_LABELS[klass.mode],
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow={subject?.name ?? "Class"}
        title={klass.title}
        description={klass.description}
        breadcrumbs={crumbs}
        actions={
          <>
            {klass.trialAvailable && centre.featureFlags.trialRegistration ? (
              <ButtonLink href={`/trial?class=${klass.slug}`} size="lg">
                Book a trial for this class
              </ButtonLink>
            ) : centre.featureFlags.studentRegistration ? (
              <ButtonLink href="/register" size="lg">
                Register interest
              </ButtonLink>
            ) : null}

            {whatsapp ? (
              <ButtonLink
                href={
                  whatsappHref(whatsapp, "class", {
                    centre: centre.identity.name,
                    class: klass.title,
                    subject: subject?.name,
                  })!
                }
                external
                variant="secondary"
                size="lg"
              >
                <MessageCircle aria-hidden="true" className="size-4" />
                Ask about this class
              </ButtonLink>
            ) : null}
          </>
        }
      />

      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap gap-2">
              <Pill tone="brand">{klass.level}</Pill>
              {subject ? <Pill tone="outline">{subject.name}</Pill> : null}
              <Pill tone={klass.availability === "full" ? "muted" : "success"}>
                {CLASS_AVAILABILITY_LABELS[klass.availability]}
              </Pill>
            </div>

            {klass.highlights?.length ? (
              <div>
                <h2 className="text-lg font-bold text-ink">What this class includes</h2>
                <ul className="mt-4 flex flex-col gap-3">
                  {klass.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex gap-2.5 text-sm leading-relaxed text-ink-soft"
                    >
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-0.5 size-4.5 shrink-0 text-brand"
                      />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {subject ? (
              <Prose>
                <p>
                  This class follows the{" "}
                  <Link
                    href={`/subjects/${subject.slug}`}
                    className="font-semibold text-brand underline underline-offset-4"
                  >
                    {subject.name} programme
                  </Link>
                  . {subject.summary}
                </p>
              </Prose>
            ) : null}
          </div>

          <Card tone="warm" padding="lg" className="h-fit">
            <h2 className="text-lg font-bold text-ink">Class details</h2>
            <dl className="mt-4 flex flex-col gap-4">
              {facts.map((fact) => (
                <div key={fact.label} className="flex gap-3">
                  <fact.icon aria-hidden="true" className="mt-0.5 size-4.5 shrink-0 text-brand" />
                  <div>
                    <dt className="text-xs font-semibold tracking-wide text-ink-muted uppercase">
                      {fact.label}
                    </dt>
                    <dd className="text-sm font-medium text-ink">{fact.value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            {location ? (
              <address className="mt-5 border-t border-line-warm pt-4 text-sm leading-relaxed text-ink-soft">
                {location.addressLines.join(", ")}, {location.postcode} {location.city},{" "}
                {location.state}
                {centre.featureFlags.locationDetailPages ? (
                  <>
                    <br />
                    <Link
                      href={`/locations/${location.slug}`}
                      className="font-semibold text-brand underline underline-offset-4"
                    >
                      About the {location.name} branch
                    </Link>
                  </>
                ) : null}
              </address>
            ) : null}
          </Card>
        </div>
      </Section>

      {related.length > 0 ? (
        <Section tone="warm" ariaLabelledBy="related-classes-heading">
          <SectionHeader
            eyebrow="Also available"
            heading={`Other ${subject?.name ?? ""} classes`.trim()}
            headingId="related-classes-heading"
            align="left"
          />
          <ul className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug} className="h-full">
                <ClassCard {...classCardProps(centre, item)} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <TrialCtaSection centre={centre} />

      {structuredDataEnabled() ? <JsonLd data={breadcrumbSchema(crumbs)} /> : null}
    </>
  );
}
