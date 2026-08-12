"use client";

import { useMemo, useState, useSyncExternalStore } from "react";

import { ScheduleCard } from "@/components/cards/ScheduleCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterGroup, FilterPill } from "@/components/ui/FilterPill";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { DAYS, DAY_LABELS, type Day } from "@/config/constants";
import { cn, toMinutes } from "@/lib/utils";
import type { TimetableEntry, TimetableFilterOption } from "@/components/timetable/types";

const ALL = "all";

/** Today in the visitor's own timezone, mapped onto our Monday-first order. */
function currentDay(): Day | null {
  return DAYS[(new Date().getDay() + 6) % 7] ?? null;
}

/**
 * The server has no idea what day it is where the visitor is, so "today" is
 * read as an external value: null during render on the server, the real day
 * once hydrated. This avoids both a hydration mismatch and a cascading
 * setState-in-effect.
 */
const subscribeToNothing = () => () => {};

/**
 * ---------------------------------------------------------------------------
 * Weekly timetable
 * ---------------------------------------------------------------------------
 * Two genuinely different layouts rather than one squeezed grid:
 *
 *   lg and up  seven day columns, classes stacked in time order
 *   below lg   a horizontally scrollable day selector, then that day's
 *              classes as a readable vertical list
 *
 * Seven columns on a 390px phone is unreadable, so it is simply not attempted.
 */
export function TimetableView({
  entries,
  levels,
  subjects,
  locations,
}: {
  entries: TimetableEntry[];
  levels: TimetableFilterOption[];
  subjects: TimetableFilterOption[];
  locations: TimetableFilterOption[];
}) {
  const [level, setLevel] = useState(ALL);
  const [subject, setSubject] = useState(ALL);
  const [location, setLocation] = useState(ALL);
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);

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
    const map = new Map<Day, TimetableEntry[]>();
    for (const day of DAYS) map.set(day, []);
    for (const entry of filtered) map.get(entry.day)?.push(entry);
    for (const list of map.values()) {
      list.sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));
    }
    return map;
  }, [filtered]);

  // Defaults to today once hydrated, and to Monday on the server render.
  const activeDay = selectedDay ?? today ?? DAYS[0]!;
  const dayEntries = byDay.get(activeDay) ?? [];
  const hasResults = filtered.length > 0;

  const resetFilters = () => {
    setLevel(ALL);
    setSubject(ALL);
    setLocation(ALL);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Filters */}
      <div className="flex flex-col gap-5 rounded-3xl border border-line bg-surface p-5 shadow-soft sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
            />
          ) : null}
        </div>

        <p className="text-sm text-ink-muted" role="status" aria-live="polite">
          Showing <span className="font-semibold text-ink">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "class" : "classes"} this week
        </p>
      </div>

      {!hasResults ? (
        <EmptyState
          icon="calendarDays"
          title="No classes match those filters"
          description="Try a different form or subject — or message us and we will tell you what is running."
          action={
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-11 items-center rounded-full border border-line-warm bg-surface px-4 text-sm font-semibold text-brand transition-colors duration-200 hover:bg-brand-soft"
            >
              Clear filters
            </button>
          }
        />
      ) : (
        <>
          {/* Mobile: day selector + single-day list */}
          <div className="flex flex-col gap-5 lg:hidden">
            <FilterGroup label="Choose a day" scroll>
              {DAYS.map((day) => {
                const count = byDay.get(day)?.length ?? 0;
                return (
                  <FilterPill
                    key={day}
                    label={DAY_LABELS[day].short}
                    count={count}
                    selected={day === activeDay}
                    onSelect={() => setSelectedDay(day)}
                  />
                );
              })}
            </FilterGroup>

            <div>
              <h3 className="flex items-center gap-2 text-lg font-bold text-ink">
                {DAY_LABELS[activeDay].long}
                {today === activeDay ? (
                  <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand">
                    Today
                  </span>
                ) : null}
              </h3>

              {dayEntries.length === 0 ? (
                <p className="mt-3 rounded-2xl border border-dashed border-line bg-surface-warm px-4 py-6 text-center text-sm text-ink-muted">
                  No classes on {DAY_LABELS[activeDay].long} with these filters.
                </p>
              ) : (
                <ul className="mt-3 flex flex-col gap-3">
                  {dayEntries.map((entry) => (
                    <li key={entry.slug}>
                      <ScheduleCard
                        klass={toClassShape(entry)}
                        subjectName={entry.subjectName}
                        accent={entry.accent}
                        tutorName={entry.tutorName}
                        locationName={entry.locationName}
                        href={entry.href}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Desktop: seven-column week grid */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-7 gap-3">
              {DAYS.map((day) => {
                const entriesForDay = byDay.get(day) ?? [];
                const isToday = today === day;

                return (
                  <section
                    key={day}
                    aria-label={DAY_LABELS[day].long}
                    className={cn(
                      "flex flex-col gap-3 rounded-3xl border p-3",
                      isToday
                        ? "border-line-warm bg-brand-soft-2"
                        : "border-line bg-surface-muted/60",
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
                        {entriesForDay.length}
                      </span>
                    </h3>

                    {entriesForDay.length === 0 ? (
                      <p className="px-1 pb-2 text-xs text-ink-muted">No classes</p>
                    ) : (
                      <ul className="flex flex-col gap-2.5">
                        {entriesForDay.map((entry) => (
                          <li key={entry.slug}>
                            <ScheduleCard
                              klass={toClassShape(entry)}
                              subjectName={entry.subjectName}
                              accent={entry.accent}
                              tutorName={entry.tutorName}
                              locationName={entry.locationName}
                              href={entry.href}
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/** ScheduleCard renders from the class shape; the timetable holds a flat one. */
function toClassShape(entry: TimetableEntry) {
  return {
    slug: entry.slug,
    title: entry.title,
    subject: entry.subjectSlug,
    level: entry.level,
    day: entry.day,
    startTime: entry.startTime,
    endTime: entry.endTime,
    mode: entry.mode,
    availability: "open" as const,
    trialAvailable: true,
    description: "",
    seoIndexable: false,
  };
}
