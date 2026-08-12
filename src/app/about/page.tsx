import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { FeatureCard } from "@/components/cards/FeatureCard";
import { StatCard } from "@/components/cards/StatCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { FinalCtaSection } from "@/components/sections/CtaSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card } from "@/components/ui/Card";
import { Prose } from "@/components/ui/Prose";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { buildMetadata, pageDescription } from "@/lib/seo";
import { getCentre } from "@/lib/site";
import { breadcrumbSchema, structuredDataEnabled } from "@/lib/structured-data";

export function generateMetadata(): Metadata {
  const centre = getCentre();

  return buildMetadata({
    title: `About ${centre.identity.name}`,
    description: pageDescription(
      "about",
      centre.about?.mission.body ?? centre.identity.description,
    ),
    path: "/about",
    noindex: !centre.featureFlags.about,
  });
}

export default function AboutPage() {
  const centre = getCentre();
  if (!centre.featureFlags.about || !centre.about) notFound();

  const about = centre.about;

  return (
    <>
      <PageHeader
        eyebrow={about.eyebrow}
        title={about.heading}
        highlight={about.highlight}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
      />

      {/* Narrative + values */}
      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div className="flex flex-col gap-8">
            <Prose size="lg">
              {about.intro.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </Prose>

            <Card tone="soft" padding="lg" className="border-line-warm">
              <h2 className="text-lg font-bold text-ink">{about.mission.title}</h2>
              <p className="mt-2.5 leading-relaxed text-ink-soft">{about.mission.body}</p>
            </Card>
          </div>

          <div className="flex flex-col gap-5">
            {about.image ? (
              <Image
                src={about.image.src}
                alt={about.image.alt}
                width={about.image.width}
                height={about.image.height}
                sizes="(max-width: 1024px) 92vw, 560px"
                className="aspect-4/3 w-full rounded-3xl border border-line object-cover shadow-soft"
              />
            ) : null}

            <ul className="grid gap-4 sm:grid-cols-2">
              {about.values.map((value, index) => (
                <Reveal as="li" key={value.title} delay={index * 60} className="h-full">
                  <FeatureCard
                    icon={value.icon}
                    title={value.title}
                    description={value.description}
                    className="h-full"
                  />
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* History */}
      {about.history?.length ? (
        <Section tone="warm" ariaLabelledBy="history-heading">
          <SectionHeader
            eyebrow="Our story"
            heading="How the centre grew"
            highlight="grew"
            headingId="history-heading"
            align="left"
          />

          <ol className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-3">
            {about.history.map((entry, index) => (
              <Reveal as="li" key={entry.year} delay={index * 70} className="h-full">
                <Card padding="md" className="h-full">
                  <p className="text-sm font-extrabold text-brand tabular-nums">
                    {entry.year}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-ink">{entry.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {entry.description}
                  </p>
                </Card>
              </Reveal>
            ))}
          </ol>
        </Section>
      ) : null}

      {/* Trust statistics */}
      {centre.stats.length > 0 ? (
        <Section tone="surface" spacing="compact" ariaLabel="Centre statistics">
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {centre.stats.map((stat) => (
              <StatCard key={stat.label} stat={stat} className="h-full" />
            ))}
          </div>
        </Section>
      ) : null}

      <FinalCtaSection centre={centre} />

      {structuredDataEnabled() ? (
        <JsonLd
          data={breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ])}
        />
      ) : null}
    </>
  );
}
