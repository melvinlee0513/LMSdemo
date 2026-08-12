import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ClassCard } from "@/components/cards/ClassCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { FinalCtaSection } from "@/components/sections/CtaSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Prose } from "@/components/ui/Prose";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  classesForLocation,
  findLocation,
  isLocationIndexable,
  subjectsForLocation,
} from "@/lib/content";
import { buildMetadata, locationPageTitle } from "@/lib/seo";
import { getCentre } from "@/lib/site";
import {
  breadcrumbSchema,
  localBusinessSchema,
  structuredDataEnabled,
} from "@/lib/structured-data";
import { classCardProps } from "@/lib/view-models";
import { whatsappHref } from "@/lib/whatsapp";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  const centre = getCentre();
  if (!centre.featureFlags.locationDetailPages) return [];
  return centre.locations.map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const centre = getCentre();
  const { slug } = await params;
  const location = findLocation(centre, slug);

  if (!location) {
    return buildMetadata({
      title: "Branch not found",
      description: "",
      path: `/locations/${slug}`,
      noindex: true,
    });
  }

  const subjects = subjectsForLocation(centre, location).map((subject) => subject.name);

  return buildMetadata({
    title: locationPageTitle(centre, location),
    description:
      location.intro ??
      `${centre.identity.name} in ${location.city}: ${subjects.join(", ")}. Address, opening hours and the classes running at this branch.`,
    path: `/locations/${location.slug}`,
    // A branch page is only indexed when it has genuinely unique copy — the
    // guard against doorway pages.
    noindex: !isLocationIndexable(centre, location),
  });
}

export default async function LocationPage({ params }: { params: Promise<Params> }) {
  const centre = getCentre();
  if (!centre.featureFlags.locationDetailPages) notFound();

  const { slug } = await params;
  const location = findLocation(centre, slug);
  if (!location) notFound();

  const classes = centre.featureFlags.classes ? classesForLocation(centre, location.slug) : [];
  const subjects = subjectsForLocation(centre, location);
  const whatsapp = centre.featureFlags.whatsapp ? centre.whatsapp : undefined;
  const chatHref = whatsappHref(whatsapp, "location", {
    centre: centre.identity.name,
    branch: location.name,
  });

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Locations", path: "/locations" },
    { name: location.name, path: `/locations/${location.slug}` },
  ];

  return (
    <>
      <PageHeader
        eyebrow={location.isPrimary ? "Main branch" : "Branch"}
        title={`${centre.identity.shortName ?? centre.identity.name} ${location.name}`}
        highlight={location.name}
        description={location.intro}
        breadcrumbs={crumbs}
        actions={
          <>
            {centre.featureFlags.trialRegistration ? (
              <ButtonLink href="/trial" size="lg">
                Book a trial at this branch
              </ButtonLink>
            ) : null}
            {chatHref ? (
              <ButtonLink href={chatHref} external variant="secondary" size="lg">
                <MessageCircle aria-hidden="true" className="size-4" />
                WhatsApp this branch
              </ButtonLink>
            ) : null}
          </>
        }
      />

      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-16">
          <div className="flex flex-col gap-8">
            {location.image ? (
              <Image
                src={location.image.src}
                alt={location.image.alt}
                width={location.image.width}
                height={location.image.height}
                sizes="(max-width: 1024px) 92vw, 640px"
                priority
                className="aspect-3/2 w-full rounded-3xl border border-line object-cover shadow-soft"
              />
            ) : null}

            {location.gettingHere?.length ? (
              <div>
                <h2 className="text-lg font-bold text-ink">Getting here</h2>
                <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed text-ink-soft">
                  {location.gettingHere.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {subjects.length > 0 ? (
              <div>
                <h2 className="text-lg font-bold text-ink">Subjects taught here</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {subjects.map((subject) => (
                    <li key={subject.slug}>
                      <Pill tone="brand">{subject.name}</Pill>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {/* NAP block — identical wording to the locations index and footer */}
          <Card tone="warm" padding="lg" className="h-fit">
            <h2 className="text-lg font-bold text-ink">Contact this branch</h2>

            <address className="mt-4 flex flex-col gap-4 text-sm">
              <span className="flex gap-3">
                <MapPin aria-hidden="true" className="mt-0.5 size-4.5 shrink-0 text-brand" />
                <span className="text-ink-soft">
                  {centre.identity.name} — {location.name}
                  <br />
                  {location.addressLines.join(", ")}
                  <br />
                  {location.postcode} {location.city}, {location.state}
                  <br />
                  {location.country}
                </span>
              </span>

              {location.phone ? (
                <span className="flex gap-3">
                  <Phone aria-hidden="true" className="mt-0.5 size-4.5 shrink-0 text-brand" />
                  <a
                    href={`tel:${location.phone.replace(/[^\d+]/g, "")}`}
                    className="text-ink-soft transition-colors duration-200 hover:text-brand"
                  >
                    {location.phone}
                  </a>
                </span>
              ) : null}

              {location.email ? (
                <span className="flex gap-3">
                  <Mail aria-hidden="true" className="mt-0.5 size-4.5 shrink-0 text-brand" />
                  <a
                    href={`mailto:${location.email}`}
                    className="break-all text-ink-soft transition-colors duration-200 hover:text-brand"
                  >
                    {location.email}
                  </a>
                </span>
              ) : null}
            </address>

            {location.hours?.length ? (
              <div className="mt-5 flex gap-3 border-t border-line-warm pt-4 text-sm">
                <Clock aria-hidden="true" className="mt-0.5 size-4.5 shrink-0 text-brand" />
                <dl className="flex flex-col gap-1.5">
                  {location.hours.map((entry) => (
                    <div key={entry.label} className="flex flex-wrap gap-x-2">
                      <dt className="text-ink-muted">{entry.label}</dt>
                      <dd className="font-medium text-ink-soft">{entry.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            {location.mapUrl ? (
              <ButtonLink
                href={location.mapUrl}
                external
                variant="secondary"
                size="sm"
                className="mt-5"
              >
                Open in maps
              </ButtonLink>
            ) : null}
          </Card>
        </div>
      </Section>

      {classes.length > 0 ? (
        <Section tone="warm" ariaLabelledBy="branch-classes-heading">
          <SectionHeader
            eyebrow="At this branch"
            heading={`Classes running at ${location.name}`}
            highlight={location.name}
            headingId="branch-classes-heading"
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
      ) : (
        <Section tone="warm" containerSize="narrow">
          <Prose>
            <p>
              Class listings for this branch are being updated. Message us and we will tell
              you exactly what is running here this term.
            </p>
          </Prose>
        </Section>
      )}

      <FinalCtaSection centre={centre} />

      {structuredDataEnabled() ? (
        <>
          <JsonLd data={breadcrumbSchema(crumbs)} />
          <JsonLd data={localBusinessSchema(location)} />
        </>
      ) : null}
    </>
  );
}
