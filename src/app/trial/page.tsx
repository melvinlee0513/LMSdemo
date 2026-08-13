import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TrialForm } from "@/components/forms/TrialForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { findClass, findSubject } from "@/lib/content";
import { buildMetadata, pageDescription } from "@/lib/seo";
import { getCentre, getSiteMode } from "@/lib/site";
import { breadcrumbSchema, structuredDataEnabled } from "@/lib/structured-data";
import { classOptions, levelOptions, subjectOptions } from "@/lib/view-models";
import { whatsappHref } from "@/lib/whatsapp";

export function generateMetadata(): Metadata {
  const centre = getCentre();

  return buildMetadata({
    title: "Book a Trial Class",
    description: pageDescription(
      "trial",
      `Book a trial session at ${centre.identity.name}. Your child joins a normal class, does the same work and receives the same marked feedback — no obligation to continue.`,
    ),
    path: "/trial",
    noindex: !centre.featureFlags.trialRegistration,
  });
}

export default async function TrialPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const centre = getCentre();
  if (!centre.featureFlags.trialRegistration) notFound();

  const params = await searchParams;
  const whatsapp = centre.featureFlags.whatsapp ? centre.whatsapp : undefined;

  /**
   * Deep links from subject and class cards pre-fill the form. Values are
   * validated against real centre data before use — never trusted as given.
   */
  const requestedClass =
    typeof params.class === "string" ? findClass(centre, params.class) : undefined;
  const requestedSubject =
    requestedClass?.subject ??
    (typeof params.subject === "string" ? findSubject(centre, params.subject)?.slug : undefined);

  const cta = centre.trialCta;

  return (
    <>
      <PageHeader
        eyebrow={cta?.eyebrow ?? "Try a class"}
        title={cta?.heading ?? "See how the class feels before committing"}
        highlight={cta?.highlight ?? "before committing"}
        highlightAnimation="drop"
        description={
          cta?.description ??
          "Tell us what your child studies and which class works best. We'll take it from there."
        }
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Book a trial", path: "/trial" },
        ]}
      />

      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-16">
          <div className="rounded-3xl border border-line bg-surface p-5 shadow-soft sm:p-8">
            <TrialForm
              chrome={{
                mode: getSiteMode(),
                privacyNotice: centre.forms.privacyNotice,
                successTitle: centre.forms.successTitle,
                successBody: centre.forms.successBody,
                whatsappHref: whatsappHref(whatsapp, "trial", {
                  centre: centre.identity.name,
                }),
              }}
              subjectOptions={subjectOptions(centre)}
              levelOptions={levelOptions(centre)}
              classOptions={classOptions(centre)}
              defaultSubject={requestedSubject}
              defaultClass={requestedClass?.slug}
              consentLabel={centre.forms.consentLabel}
            />
          </div>

          <div className="flex flex-col gap-5">
            {cta?.bullets?.length ? (
              <Card tone="warm" padding="lg">
                <h2 className="text-lg font-bold text-ink">What a trial involves</h2>
                <ul className="mt-4 flex flex-col gap-3">
                  {cta.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-2.5 text-sm leading-relaxed text-ink-soft"
                    >
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-0.5 size-4.5 shrink-0 text-brand"
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </Card>
            ) : null}

            {requestedClass ? (
              <Card padding="md" tone="soft">
                <p className="text-xs font-semibold tracking-wide text-brand uppercase">
                  Selected class
                </p>
                <p className="mt-1.5 font-bold text-ink">{requestedClass.title}</p>
                <p className="text-sm text-ink-soft">{requestedClass.level}</p>
              </Card>
            ) : null}

            {centre.contact.hours?.length ? (
              <Card padding="md">
                <h2 className="text-base font-bold text-ink">When we reply</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  We confirm trial sessions during centre hours, usually on WhatsApp
                  within one working day.
                </p>
                <dl className="mt-3 flex flex-col gap-1.5 text-sm">
                  {centre.contact.hours.map((entry) => (
                    <div key={entry.label} className="flex justify-between gap-4">
                      <dt className="text-ink-muted">{entry.label}</dt>
                      <dd className="font-medium text-ink-soft">{entry.value}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
            ) : null}
          </div>
        </div>
      </Section>

      {structuredDataEnabled() ? (
        <JsonLd
          data={breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Book a trial", path: "/trial" },
          ])}
        />
      ) : null}
    </>
  );
}
