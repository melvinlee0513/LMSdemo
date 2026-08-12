import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RegistrationForm } from "@/components/forms/RegistrationForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { buildMetadata, pageDescription } from "@/lib/seo";
import { getCentre, getSiteMode } from "@/lib/site";
import { breadcrumbSchema, structuredDataEnabled } from "@/lib/structured-data";
import { classOptions, levelOptions, subjectOptions } from "@/lib/view-models";
import { whatsappHref } from "@/lib/whatsapp";

export function generateMetadata(): Metadata {
  const centre = getCentre();

  return buildMetadata({
    title: "Register a Student",
    description: pageDescription(
      "register",
      `Register a student at ${centre.identity.name} in four short steps — student details, subjects, parent contact and a review before you submit.`,
    ),
    path: "/register",
    noindex: !centre.featureFlags.studentRegistration,
  });
}

export default function RegisterPage() {
  const centre = getCentre();
  if (!centre.featureFlags.studentRegistration) notFound();

  const whatsapp = centre.featureFlags.whatsapp ? centre.whatsapp : undefined;

  return (
    <>
      <PageHeader
        eyebrow="Registration"
        title="Register a student in four short steps"
        highlight="four short steps"
        description="Student details, subjects, your contact information, then a review before anything is sent. It takes about two minutes."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Register", path: "/register" },
        ]}
      />

      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
          <div className="rounded-3xl border border-line bg-surface p-5 shadow-soft sm:p-8">
            <RegistrationForm
              chrome={{
                mode: getSiteMode(),
                privacyNotice: centre.forms.privacyNotice,
                successTitle: centre.forms.successTitle,
                successBody: centre.forms.successBody,
                whatsappHref: whatsappHref(whatsapp, "general", {
                  centre: centre.identity.name,
                }),
              }}
              levelOptions={levelOptions(centre)}
              subjectOptions={subjectOptions(centre)}
              classOptions={classOptions(centre)}
              consentLabel={centre.forms.consentLabel}
            />
          </div>

          <div className="flex flex-col gap-5">
            <Card tone="warm" padding="lg">
              <h2 className="text-lg font-bold text-ink">What happens next</h2>
              <ol className="mt-4 flex flex-col gap-4">
                {[
                  {
                    title: "We check the class has space",
                    body: "Groups are capped, so we confirm availability before anything else.",
                  },
                  {
                    title: "We message you on WhatsApp",
                    body: "Usually within one working day, with the session time and what to bring.",
                  },
                  {
                    title: "Your child sits the diagnostic",
                    body: "A short paper in the first session so the tutor knows where to start.",
                  },
                ].map((step, index) => (
                  <li key={step.title} className="flex gap-3.5">
                    <span
                      aria-hidden="true"
                      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand"
                    >
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{step.title}</p>
                      <p className="text-sm leading-relaxed text-ink-soft">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>

            {centre.featureFlags.trialRegistration ? (
              <Card padding="md" tone="soft">
                <p className="text-sm leading-relaxed text-ink-soft">
                  Not ready to commit? A trial class lets your child sit in on a real
                  session first —{" "}
                  <a
                    href="/trial"
                    className="font-semibold text-brand underline underline-offset-4"
                  >
                    book a trial instead
                  </a>
                  .
                </p>
              </Card>
            ) : null}
          </div>
        </div>
      </Section>

      {structuredDataEnabled() ? (
        <JsonLd
          data={breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Register", path: "/register" },
          ])}
        />
      ) : null}
    </>
  );
}
