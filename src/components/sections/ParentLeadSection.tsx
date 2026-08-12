import { ParentLeadForm } from "@/components/forms/ParentLeadForm";
import { IconBox } from "@/components/ui/IconBox";
import { Section } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { HighlightedHeading } from "@/components/ui/SectionHeader";
import type { Centre } from "@/config/types";
import { getSiteMode } from "@/lib/site";
import { sectionCopy } from "@/lib/section-copy";
import { levelOptions } from "@/lib/view-models";
import { whatsappHref } from "@/lib/whatsapp";

/**
 * Contextual parent lead capture. Inline in the page, never a popup or an
 * interstitial — a parent who wants the timetable and fees can ask for them
 * without hunting for a contact page.
 */
export function ParentLeadSection({
  centre,
  defaultSubject,
  tone = "soft",
}: {
  centre: Centre;
  defaultSubject?: string;
  tone?: "soft" | "warm";
}) {
  if (!centre.featureFlags.parentLeadCapture) return null;

  const whatsapp = centre.featureFlags.whatsapp ? centre.whatsapp : undefined;

  const copy = sectionCopy(centre, "parentLead", {
    eyebrow: "For parents",
    heading: "Send me the timetable and fee guide",
    highlight: "timetable and fee guide",
    description:
      "Leave your name and number and we will send the current schedule, class sizes and fees on WhatsApp — no phone call unless you ask for one.",
  });

  return (
    <Section tone={tone} ariaLabelledBy="parent-lead-heading">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col items-start gap-5">
          {copy.eyebrow ? <SectionLabel>{copy.eyebrow}</SectionLabel> : null}

          <h2
            id="parent-lead-heading"
            className="text-3xl leading-[1.15] font-bold text-ink sm:text-4xl"
          >
            <HighlightedHeading heading={copy.heading} highlight={copy.highlight} />
          </h2>

          {copy.description ? (
            <p className="max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg">
              {copy.description}
            </p>
          ) : null}

          <ul className="flex flex-col gap-3 text-sm text-ink-soft">
            {[
              { icon: "calendarDays", text: "The current weekly timetable" },
              { icon: "users", text: "Class sizes and remaining places" },
              { icon: "messageCircle", text: "A reply on WhatsApp, not a sales call" },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-3">
                <IconBox name={item.icon as "calendarDays"} tone="soft" size="sm" />
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-line bg-surface p-5 shadow-soft sm:p-7">
          <ParentLeadForm
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
            defaultSubject={defaultSubject}
            consentLabel={centre.forms.consentLabel}
          />
        </div>
      </div>
    </Section>
  );
}
