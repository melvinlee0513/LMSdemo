import { Clock, MapPin, User } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";

import { CLASS_MODE_LABELS } from "@/config/constants";
import type { TimetableEntry } from "@/components/timetable/types";
import { cn, formatDuration, formatTime } from "@/lib/utils";

/**
 * ---------------------------------------------------------------------------
 * ClassBlock
 * ---------------------------------------------------------------------------
 * The timetable's unit of information, designed to answer a parent's question
 * in one glance: when, what, who, where.
 *
 *   10:00 AM · 2 hr
 *   PHYSICS
 *   Form 5 · Chen Wei Lun
 *   Kuching Central
 *
 * Subject colour is applied as a soft tint and a thin rule, mixed into the
 * centre's own surface tokens — expressive enough to scan a week by subject,
 * never loud enough to compete with the brand's orange, which stays reserved
 * for actions.
 */
export function ClassBlock({
  entry,
  size = "md",
  className,
}: {
  entry: TimetableEntry;
  size?: "sm" | "md";
  className?: string;
}) {
  const style = entry.accent ? ({ "--accent": entry.accent } as CSSProperties) : undefined;

  const body = (
    <>
      <span aria-hidden="true" className="class-block-rule absolute inset-y-3 left-0 w-1 rounded-full" />

      <p className="flex flex-wrap items-center gap-x-1.5 text-xs font-semibold text-ink-soft">
        <Clock aria-hidden="true" className="size-3.5 shrink-0" />
        <span>{formatTime(entry.startTime)}</span>
        <span className="text-ink-muted">
          · {formatDuration(entry.startTime, entry.endTime)}
        </span>
      </p>

      <p
        className={cn(
          "class-block-accent mt-1.5 leading-tight font-bold",
          size === "sm" ? "text-[0.9375rem]" : "text-lg",
        )}
      >
        {entry.subjectName}
      </p>

      <p className="mt-0.5 text-sm font-medium text-ink">
        {entry.level}
        {entry.tutorName ? (
          <span className="font-normal text-ink-soft"> · {entry.tutorName}</span>
        ) : null}
      </p>

      <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-muted">
        {entry.tutorName ? null : <User aria-hidden="true" className="size-3.5 shrink-0" />}
        <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
        {entry.locationName ?? CLASS_MODE_LABELS[entry.mode]}
        {entry.locationName && entry.mode !== "physical"
          ? ` · ${CLASS_MODE_LABELS[entry.mode]}`
          : ""}
      </p>
    </>
  );

  const classes = cn(
    "class-block relative block rounded-2xl border pr-4 pl-4.5 text-left",
    size === "sm" ? "py-3" : "py-3.5 sm:py-4",
    entry.href &&
      "transition-[transform,box-shadow] duration-[var(--motion-normal)] ease-[var(--ease-emphasized)] hover:-translate-y-0.5 hover:shadow-soft active:translate-y-0 active:scale-[0.995]",
    className,
  );

  if (entry.href) {
    return (
      <Link href={entry.href} className={classes} style={style}>
        {body}
        <span className="sr-only">— view class details</span>
      </Link>
    );
  }

  return (
    <div className={classes} style={style}>
      {body}
    </div>
  );
}
