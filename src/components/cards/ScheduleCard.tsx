import { Clock, MapPin, User } from "lucide-react";
import Link from "next/link";

import type { TuitionClass } from "@/config/types";
import { CLASS_MODE_LABELS } from "@/config/constants";
import { cn, formatDuration, formatTime } from "@/lib/utils";

export type ScheduleCardProps = {
  klass: TuitionClass;
  subjectName: string;
  /** Muted subject colour; the brand still owns every primary action. */
  accent?: string;
  tutorName?: string;
  locationName?: string;
  href?: string;
  className?: string;
};

/**
 * The compact class block used inside the timetable grid and the mobile day
 * list. Subject colour is applied as a thin left rule and a tinted label so
 * the grid stays scannable without turning into a rainbow.
 */
export function ScheduleCard({
  klass,
  subjectName,
  accent,
  tutorName,
  locationName,
  href,
  className,
}: ScheduleCardProps) {
  const accentStyle = accent
    ? ({
        "--schedule-accent": accent,
      } as React.CSSProperties)
    : undefined;

  const content = (
    <>
      <p className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted">
        <Clock aria-hidden="true" className="size-3.5" />
        <span>
          {formatTime(klass.startTime)} – {formatTime(klass.endTime)}
        </span>
        <span className="text-ink-muted/70">
          · {formatDuration(klass.startTime, klass.endTime)}
        </span>
      </p>

      <p
        className="mt-1.5 text-sm font-bold"
        style={accent ? { color: "var(--schedule-accent)" } : undefined}
      >
        {subjectName}
      </p>

      <p className="text-xs font-medium text-ink-soft">{klass.level}</p>

      <div className="mt-2 flex flex-col gap-1 text-xs text-ink-muted">
        {tutorName ? (
          <span className="flex items-center gap-1.5">
            <User aria-hidden="true" className="size-3.5 shrink-0" />
            {tutorName}
          </span>
        ) : null}
        <span className="flex items-center gap-1.5">
          <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
          {locationName ?? CLASS_MODE_LABELS[klass.mode]}
        </span>
      </div>
    </>
  );

  const classes = cn(
    "block rounded-2xl border border-line bg-surface p-3.5 text-left shadow-soft",
    "border-l-3 transition-[transform,box-shadow] duration-200",
    href && "hover:-translate-y-0.5 hover:shadow-lift",
    className,
  );

  const style = {
    ...accentStyle,
    borderLeftColor: accent ? "var(--schedule-accent)" : undefined,
  } as React.CSSProperties;

  if (href) {
    return (
      <Link href={href} className={classes} style={style}>
        {content}
        <span className="sr-only">— view class details</span>
      </Link>
    );
  }

  return (
    <div className={classes} style={style}>
      {content}
    </div>
  );
}
