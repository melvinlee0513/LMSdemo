import { TimetableBoard } from "@/components/timetable/TimetableBoard";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Centre } from "@/config/types";
import { sectionCopy } from "@/lib/section-copy";
import {
  levelOptions,
  locationOptions,
  subjectOptions,
  timetableEntries,
} from "@/lib/view-models";

/**
 * Homepage timetable preview.
 *
 * Same component as the full timetable page, in preview mode: a day selector,
 * up to three representative classes for the chosen day, and a link to the
 * rest. The homepage's job here is to show that the centre is organised and
 * that finding a class is easy — not to reproduce the whole schedule.
 */
export function TimetablePreviewSection({ centre }: { centre: Centre }) {
  if (!centre.featureFlags.timetable || centre.classes.length === 0) return null;

  const branches = centre.locations.length;

  const copy = sectionCopy(centre, "timetable", {
    eyebrow: "Weekly timetable",
    heading: "Find a class that fits your week",
    highlight: "fits your week",
    description:
      branches > 1
        ? "Pick a day to see what's running. The full timetable filters by form, subject and branch."
        : "Pick a day to see what's running. The full timetable filters by form and subject.",
  });

  return (
    <Section tone="surface" ariaLabelledBy="timetable-heading">
      <SectionHeader
        eyebrow={copy.eyebrow}
        heading={copy.heading}
        highlight={copy.highlight}
        highlightAnimation={copy.highlightAnimation}
        description={copy.description}
        headingId="timetable-heading"
        align="left"
      />

      <div className="mt-10 sm:mt-12">
        <TimetableBoard
          entries={timetableEntries(centre)}
          levels={levelOptions(centre)}
          subjects={subjectOptions(centre)}
          locations={locationOptions(centre)}
          layout="tabs"
          showFilters={false}
          maxPerDay={3}
          cta={{ label: "View full timetable", href: "/timetable" }}
        />
      </div>
    </Section>
  );
}
