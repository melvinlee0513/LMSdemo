"use client";

import { useMemo, useState } from "react";

import { ClassCard, type ClassCardProps } from "@/components/cards/ClassCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterGroup, FilterPill } from "@/components/ui/FilterPill";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { DAYS, DAY_LABELS } from "@/config/constants";

const ALL = "all";

export type ClassFilterOption = { value: string; label: string };

/**
 * Classes index with the filters that actually matter to a parent: form,
 * subject, branch and day. Filters that would only ever have one option
 * (a single-branch centre, for instance) are not rendered at all.
 */
export function ClassExplorer({
  cards,
  levels,
  subjects,
  locations,
}: {
  cards: ClassCardProps[];
  levels: ClassFilterOption[];
  subjects: ClassFilterOption[];
  locations: ClassFilterOption[];
}) {
  const [level, setLevel] = useState(ALL);
  const [subject, setSubject] = useState(ALL);
  const [location, setLocation] = useState(ALL);
  const [day, setDay] = useState(ALL);

  const daysInUse = useMemo(
    () => DAYS.filter((value) => cards.some((card) => card.klass.day === value)),
    [cards],
  );

  const visible = useMemo(
    () =>
      cards.filter(
        (card) =>
          (level === ALL || card.klass.level === level) &&
          (subject === ALL || card.klass.subject === subject) &&
          (location === ALL || card.klass.location === location) &&
          (day === ALL || card.klass.day === day),
      ),
    [cards, day, level, location, subject],
  );

  const reset = () => {
    setLevel(ALL);
    setSubject(ALL);
    setLocation(ALL);
    setDay(ALL);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5 rounded-3xl border border-line bg-surface p-5 shadow-soft sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {levels.length > 1 ? (
            <FilterSelect
              label="Form"
              value={level}
              onChange={setLevel}
              options={[{ value: ALL, label: "All forms" }, ...levels]}
            />
          ) : null}
          {subjects.length > 1 ? (
            <FilterSelect
              label="Subject"
              value={subject}
              onChange={setSubject}
              options={[{ value: ALL, label: "All subjects" }, ...subjects]}
            />
          ) : null}
          {locations.length > 1 ? (
            <FilterSelect
              label="Branch"
              value={location}
              onChange={setLocation}
              options={[{ value: ALL, label: "All branches" }, ...locations]}
            />
          ) : null}
        </div>

        {daysInUse.length > 1 ? (
          <FilterGroup label="Day" scroll>
            <FilterPill label="Any day" selected={day === ALL} onSelect={() => setDay(ALL)} />
            {daysInUse.map((value) => (
              <FilterPill
                key={value}
                label={DAY_LABELS[value].short}
                count={cards.filter((card) => card.klass.day === value).length}
                selected={day === value}
                onSelect={() => setDay(value)}
              />
            ))}
          </FilterGroup>
        ) : null}

        <p className="text-sm text-ink-muted" role="status" aria-live="polite">
          Showing <span className="font-semibold text-ink">{visible.length}</span> of{" "}
          {cards.length} classes
        </p>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon="calendarDays"
          title="No classes match those filters"
          description="Try widening the form or day. If nothing fits your schedule, message us — we open new groups when there is demand."
          action={
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-11 items-center rounded-full border border-line-warm bg-surface px-4 text-sm font-semibold text-brand transition-colors duration-200 hover:bg-brand-soft"
            >
              Clear filters
            </button>
          }
        />
      ) : (
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((card) => (
            <li key={card.klass.slug} className="h-full">
              <ClassCard {...card} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
