"use client";

import { useEffect, useRef } from "react";

import { DAYS, DAY_LABELS, type Day } from "@/config/constants";
import { cn } from "@/lib/utils";

/**
 * ---------------------------------------------------------------------------
 * DayTabs
 * ---------------------------------------------------------------------------
 * The timetable's day selector: large rounded tabs on a horizontally
 * scrollable rail. This is the primary control on mobile, where seven columns
 * of a grid would be unreadable, and it stays the control on the homepage
 * preview at every width because it is simply a better way to ask "which day?"
 *
 * Accessibility is the reason this is a real tablist rather than a row of
 * buttons: roving tabindex, left/right/Home/End keys, `aria-selected`, and an
 * `aria-controls` link to the panel. The selected tab is scrolled into the
 * centre of its own rail only — never via `scrollIntoView`, which would drag
 * the whole page around.
 */
export function DayTabs({
  counts,
  selected,
  today,
  panelId,
  onSelect,
  className,
}: {
  counts: Record<Day, number>;
  selected: Day;
  today: Day | null;
  panelId: string;
  onSelect: (day: Day) => void;
  className?: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef(new Map<Day, HTMLButtonElement>());
  const hasScrolled = useRef(false);

  /* Keep the selected day visible in the rail. */
  useEffect(() => {
    const rail = railRef.current;
    const tab = tabRefs.current.get(selected);
    if (!rail || !tab) return;

    const target = tab.offsetLeft - rail.clientWidth / 2 + tab.clientWidth / 2;
    rail.scrollTo({
      left: Math.max(0, target),
      behavior: hasScrolled.current ? "smooth" : "auto",
    });
    hasScrolled.current = true;
  }, [selected]);

  const move = (from: Day, step: number) => {
    const index = DAYS.indexOf(from);
    const next = DAYS[(index + step + DAYS.length) % DAYS.length];
    if (!next) return;
    onSelect(next);
    tabRefs.current.get(next)?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, day: Day) => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        move(day, 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        move(day, -1);
        break;
      case "Home":
        event.preventDefault();
        onSelect(DAYS[0]!);
        tabRefs.current.get(DAYS[0]!)?.focus();
        break;
      case "End": {
        event.preventDefault();
        const last = DAYS[DAYS.length - 1]!;
        onSelect(last);
        tabRefs.current.get(last)?.focus();
        break;
      }
      default:
        break;
    }
  };

  return (
    <div
      ref={railRef}
      role="tablist"
      aria-label="Day of the week"
      className={cn(
        "no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0",
        className,
      )}
    >
      {DAYS.map((day) => {
        const active = day === selected;
        const count = counts[day];
        const isToday = today === day;

        return (
          <button
            key={day}
            ref={(node) => {
              if (node) tabRefs.current.set(day, node);
              else tabRefs.current.delete(day);
            }}
            type="button"
            role="tab"
            id={`${panelId}-tab-${day}`}
            aria-selected={active}
            aria-controls={panelId}
            tabIndex={active ? 0 : -1}
            onClick={() => onSelect(day)}
            onKeyDown={(event) => onKeyDown(event, day)}
            className={cn(
              "flex h-14 shrink-0 flex-col items-center justify-center rounded-2xl px-4 sm:px-5",
              "transition-[background-color,color,border-color,box-shadow,transform] duration-[var(--motion-normal)] ease-[var(--ease-emphasized)]",
              "active:scale-[0.98]",
              active
                ? "gradient-brand text-white shadow-brand"
                : "border border-line bg-surface text-ink-soft hover:border-line-warm hover:bg-brand-soft hover:text-brand",
            )}
          >
            <span className="text-sm leading-none font-bold">
              {DAY_LABELS[day].short}
            </span>
            <span
              className={cn(
                "mt-1 text-[0.6875rem] leading-none font-medium",
                active ? "text-white/80" : "text-ink-muted",
              )}
            >
              {isToday ? "Today" : count === 0 ? "—" : `${count} class${count === 1 ? "" : "es"}`}
            </span>
          </button>
        );
      })}
    </div>
  );
}
