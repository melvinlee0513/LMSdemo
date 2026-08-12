import { ArrowRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DAYS, DAY_LABELS } from "@/config/constants";
import type { Centre } from "@/config/types";
import { classesByDay } from "@/lib/content";
import { sectionCopy } from "@/lib/section-copy";
import { formatTime } from "@/lib/utils";

/**
 * A week-at-a-glance rail. Entirely server-rendered — no JavaScript — because
 * the homepage only needs to answer "roughly when do classes run?" before
 * sending the visitor to the interactive timetable.
 *
 * Desktop: seven columns. Mobile: a horizontal scroll rail of the same cards.
 */
export function TimetablePreviewSection({ centre }: { centre: Centre }) {
  if (!centre.featureFlags.timetable || centre.classes.length === 0) return null;

  const week = classesByDay(centre.classes);

  const copy = sectionCopy(centre, "timetable", {
    eyebrow: "Weekly timetable",
    heading: "The teaching week at a glance",
    highlight: "at a glance",
    description:
      "Sessions run on weekday evenings and across the weekend. Filter the full timetable by form, subject and branch.",
  });

  return (
    <Section tone="surface" ariaLabelledBy="timetable-heading">
      <SectionHeader
        eyebrow={copy.eyebrow}
        heading={copy.heading}
        highlight={copy.highlight}
        description={copy.description}
        headingId="timetable-heading"
        align="left"
        action={
          <ButtonLink href="/timetable" variant="secondary">
            Open full timetable
            <ArrowRight aria-hidden="true" className="size-4" />
          </ButtonLink>
        }
      />

      <div className="no-scrollbar -mx-5 mt-10 overflow-x-auto px-5 sm:mt-12 lg:mx-0 lg:overflow-visible lg:px-0">
        <ol className="grid w-max grid-flow-col gap-3 lg:w-full lg:grid-flow-row lg:grid-cols-7">
          {DAYS.map((day) => {
            const entry = week.find((item) => item.day === day);
            const dayClasses = entry?.classes ?? [];

            return (
              <li
                key={day}
                className="flex w-[9.5rem] flex-col gap-3 rounded-3xl border border-line bg-surface-muted/60 p-3.5 lg:w-auto"
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold text-ink">
                    {DAY_LABELS[day].short}
                  </span>
                  <span className="text-xs text-ink-muted tabular-nums">
                    {dayClasses.length}
                  </span>
                </div>

                {dayClasses.length === 0 ? (
                  <p className="text-xs text-ink-muted">No classes</p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {dayClasses.slice(0, 2).map((klass) => (
                      <li
                        key={klass.slug}
                        className="rounded-2xl border border-line bg-surface p-2.5"
                      >
                        <p className="text-xs font-semibold text-ink-muted">
                          {formatTime(klass.startTime)}
                        </p>
                        <p className="mt-0.5 text-[0.8125rem] leading-snug font-bold text-ink">
                          {klass.title.split("—")[0]?.trim()}
                        </p>
                        <p className="text-xs text-ink-muted">{klass.level}</p>
                      </li>
                    ))}
                    {dayClasses.length > 2 ? (
                      <li>
                        <Pill tone="brand" size="sm">
                          +{dayClasses.length - 2} more
                        </Pill>
                      </li>
                    ) : null}
                  </ul>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
