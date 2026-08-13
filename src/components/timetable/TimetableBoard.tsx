"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useId, useMemo, useState, useSyncExternalStore } from "react";

import { ClassBlock } from "@/components/timetable/ClassBlock";
import { DayTabs } from "@/components/timetable/DayTabs";
import type { TimetableEntry, TimetableFilterOption } from "@/components/timetable/types";
import { buttonClasses } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { DAYS, DAY_LABELS, type Day } from "@/config/constants";
import { cn, toMinutes } from "@/lib/utils";

const ALL = "all";

/** Today in the visitor's own timezone, mapped onto our Monday-first order. */
function currentDay(): Day | null {
  return DAYS[(new Date().getDay() + 6) % 7] ?? null;
}

/**
 * The server has no idea what day it is where the visitor is, so "today" is
 * read as an external value: null while rendering on the server, the real day
 * once hydrated. Avoids both a hydration mismatch and a setState-in-effect.
 */
const subscribeToNothing = () => () => {};

export type TimetableBoardProps = {
  entries: TimetableEntry[];
  levels: TimetableFilterOption[];
  subjects: TimetableFilterOption[];
  locations: TimetableFilterOption[];
  /**
   * `tabs`       day selector at every width (homepage preview)
   * `responsive` day selector on small screens, week grid from lg up
   */
  layout?: "tabs" | "responsive";
  showFilters?: boolean;
  /** Preview mode: cap the classes shown per day and offer a link to the rest. */
  maxPerDay?: number;
  cta?: { label: string; href: string };
};

/**
 * ---------------------------------------------------------------------------
 * TimetableBoard
 * ---------------------------------------------------------------------------
 * One timetable implementation behind both the homepage preview and the full
 * timetable page, so the two can never drift into different designs.
 *
 * Mobile is the primary target: a scrollable day selector and a readable
 * vertical list, never a seven-column grid squeezed onto a phone. From `lg`
 * up, the full page adds the week-at-a-glance grid whose columns size to
 * their content rather than being padded out to a fixed height.
 *
 * The day panel is keyed by day, so switching days replays a short settle
 * animation rather than swapping content instantly. Filters update the same
 * panel in place: no section-wide flash, no layout jump.
 */
export function TimetableBoard({
  entries,
  levels,
  subjects,
  locations,
  layout = "responsive",
  showFilters = true,
  maxPerDay,
  cta,
}: TimetableBoardProps) {
  const panelId = useId();
  const [level, setLevel] = useState(ALL);
  const [subject, setSubject] = useState(ALL);
  const [location, setLocation] = useState(ALL);
  const [chosenDay, setChosenDay] = useState<Day | null>(null);

  const today = useSyncExternalStore(subscribeToNothing, currentDay, () => null);

  const filtered = useMemo(
    () =>
      entries.filter(
        (entry) =>
          (level === ALL || entry.level === level) &&
          (subject === ALL || entry.subjectSlug === subject) &&
          (location === ALL || entry.locationSlug === location),
      ),
    [entries, level, location, subject],
  );

  const byDay = useMemo(() => {
    const map = {} as Record<Day, TimetableEntry[]>;
    for (const day of DAYS) map[day] = [];
    for (const entry of filtered) map[entry.day]?.push(entry);
    for (const day of DAYS) {
      map[day].sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));
    }
    return map;
  }, [filtered]);

  const counts = useMemo(() => {
    const out = {} as Record<Day, number>;
    for (const day of DAYS) out[day] = byDay[day].length;
    return out;
  }, [byDay]);

  /**
   * Default to today when it has classes, otherwise the next day that does.
   * Before hydration `today` is null and the first day with classes is used,
   * which is a sensible server render either way.
   */
  const defaultDay = useMemo(() => {
    const start = today ? DAYS.indexOf(today) : 0;
    for (let step = 0; step < DAYS.length; step += 1) {
      const day = DAYS[(start + step) % DAYS.length]!;
      if (counts[day] > 0) return day;
    }
    return today ?? DAYS[0]!;
  }, [counts, today]);

  const activeDay = chosenDay ?? defaultDay;
  const dayEntries = byDay[activeDay];
  const visible = maxPerDay ? dayEntries.slice(0, maxPerDay) : dayEntries;
  const hidden = dayEntries.length - visible.length;

  const hasResults = filtered.length > 0;
  const resetFilters = () => {
    setLevel(ALL);
    setSubject(ALL);
    setLocation(ALL);
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {showFilters ? (
        <div className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-4 shadow-soft sm:p-6">
          <div
            className={cn(
              "grid gap-4",
              locations.length > 1 ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-2",
            )}
          >
            <FilterSelect
              label="Form"
              value={level}
              onChange={setLevel}
              options={[{ value: ALL, label: "All forms" }, ...levels]}
            />
            <FilterSelect
              label="Subject"
              value={subject}
              onChange={setSubject}
              options={[{ value: ALL, label: "All subjects" }, ...subjects]}
            />
            {locations.length > 1 ? (
              <FilterSelect
                label="Branch"
                value={location}
                onChange={setLocation}
                options={[{ value: ALL, label: "All branches" }, ...locations]}
                className="col-span-2 lg:col-span-1"
              />
            ) : null}
          </div>

          <p className="text-sm text-ink-muted" role="status" aria-live="polite">
            <span className="font-semibold text-ink">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "class" : "classes"} this week
          </p>
        </div>
      ) : null}

      {!hasResults ? (
        <EmptyState
          icon="calendarDays"
          title="No classes match those filters"
          description="Try a different form or subject — or message us and we'll tell you what's running."
          action={
            showFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-11 items-center rounded-full border border-line-warm bg-surface px-4 text-sm font-semibold text-brand transition-colors duration-[var(--motion-normal)] hover:bg-brand-soft"
              >
                Clear filters
              </button>
            ) : null
          }
        />
      ) : (
        <>
          {/* Day selector + single-day list */}
          <div className={cn("flex flex-col gap-5", layout === "responsive" && "lg:hidden")}>
            <DayTabs
              counts={counts}
              selected={activeDay}
              today={today}
              panelId={panelId}
              onSelect={setChosenDay}
            />

            <div
              id={panelId}
              role="tabpanel"
              aria-labelledby={`${panelId}-tab-${activeDay}`}
              tabIndex={-1}
            >
              <h3 className="flex items-center gap-2.5 text-lg font-bold text-ink">
                {DAY_LABELS[activeDay].long}
                {today === activeDay ? (
                  <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand">
                    Today
                  </span>
                ) : null}
              </h3>

              {dayEntries.length === 0 ? (
                <p className="mt-3 rounded-2xl border border-dashed border-line bg-surface-warm px-4 py-6 text-center text-sm text-ink-muted">
                  No classes on {DAY_LABELS[activeDay].long}
                  {showFilters ? " with these filters" : ""}.
                </p>
              ) : (
                /* Keyed by day so the list replays its settle animation on
                   every switch — the cue that the panel changed. */
                <ul key={activeDay} className="settle mt-3 grid gap-3 sm:grid-cols-2">
                  {visible.map((entry) => (
                    <li key={entry.slug}>
                      <ClassBlock entry={entry} />
                    </li>
                  ))}
                </ul>
              )}

              {hidden > 0 ? (
                <p className="mt-3 text-sm text-ink-muted">
                  +{hidden} more on {DAY_LABELS[activeDay].long}
                </p>
              ) : null}
            </div>
          </div>

          {/* Week-at-a-glance grid */}
          {layout === "responsive" ? (
            <div className="hidden lg:block">
              <div className="grid grid-cols-7 items-start gap-3">
                {DAYS.map((day) => {
                  const entriesForDay = byDay[day];
                  const isToday = today === day;

                  return (
                    <section
                      key={day}
                      aria-label={DAY_LABELS[day].long}
                      className={cn(
                        "flex flex-col gap-2.5 rounded-3xl border p-3",
                        isToday
                          ? "border-line-warm bg-brand-soft-2"
                          : "border-line bg-surface-muted/50",
                      )}
                    >
                      <h3 className="flex items-baseline justify-between px-1">
                        <span
                          className={cn(
                            "text-sm font-bold",
                            isToday ? "text-brand" : "text-ink",
                          )}
                        >
                          {DAY_LABELS[day].short}
                          {isToday ? <span className="sr-only"> (today)</span> : null}
                        </span>
                        <span className="text-xs font-medium text-ink-muted tabular-nums">
                          {entriesForDay.length || ""}
                        </span>
                      </h3>

                      {entriesForDay.length === 0 ? (
                        <p className="px-1 pb-1 text-xs text-ink-muted">No classes</p>
                      ) : (
                        <ul className="flex flex-col gap-2.5">
                          {entriesForDay.map((entry) => (
                            <li key={entry.slug}>
                              <ClassBlock entry={entry} size="sm" />
                            </li>
                          ))}
                        </ul>
                      )}
                    </section>
                  );
                })}
              </div>
            </div>
          ) : null}
        </>
      )}

      {cta ? (
        <div className="flex justify-center">
          <Link href={cta.href} className={buttonClasses({ variant: "secondary", size: "lg" })}>
            {cta.label}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
