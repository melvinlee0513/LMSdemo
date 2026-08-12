import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { buildMetadata } from "@/lib/seo";
import { getCentre, isDemo } from "@/lib/site";

export function generateMetadata(): Metadata {
  const centre = getCentre();

  return buildMetadata({
    title: "Privacy Notice",
    description: `How ${centre.identity.name} collects and uses the information you provide through this website.`,
    path: "/privacy",
  });
}

/**
 * The engine provides the structure; the centre provides the words.
 *
 * Note what is deliberately absent: no claim of certification or compliance
 * with any specific regime. A template cannot verify that, and asserting it
 * on a centre's behalf would be a legal claim we are in no position to make.
 */
export default function PrivacyPage() {
  const centre = getCentre();
  const privacy = centre.privacy;

  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy notice"
        description={privacy.intro}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Privacy", path: "/privacy" },
        ]}
      />

      <Section tone="surface" containerSize="narrow">
        <p className="text-sm text-ink-muted">Last updated: {privacy.updated}</p>

        {isDemo() ? (
          <p className="mt-5 rounded-2xl border border-line bg-surface-muted px-4 py-3 text-sm leading-relaxed text-ink-soft">
            <strong className="font-semibold text-ink">
              This is a demonstration website.
            </strong>{" "}
            No form on this site transmits or stores any information. Please do not enter
            real personal details anywhere on it.
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-8">
          {privacy.sections.map((section) => (
            <section key={section.title} className="flex flex-col gap-3">
              <h2 className="text-xl font-bold text-ink">{section.title}</h2>
              {section.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="max-w-[68ch] leading-relaxed text-ink-soft"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </Section>
    </>
  );
}
