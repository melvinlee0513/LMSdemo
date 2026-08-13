import { ArrowRight, CalendarDays, Clock, MapPin, MessageCircle, User } from "lucide-react";
import Link from "next/link";

import { buttonClasses } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import {
  CLASS_AVAILABILITY_LABELS,
  CLASS_MODE_LABELS,
} from "@/config/constants";
import type { TuitionClass } from "@/config/types";
import { cn, dayLabel, formatDuration, formatTime } from "@/lib/utils";

export type ClassCardProps = {
  klass: TuitionClass;
  subjectName: string;
  tutorName?: string;
  locationName?: string;
  href?: string;
  whatsappHref?: string;
  trialHref?: string;
  registerHref?: string;
  className?: string;
};

const availabilityTone = {
  open: "success",
  limited: "warning",
  full: "muted",
  waitlist: "neutral",
} as const;

/**
 * A class is a bookable offering, so this card leads with the practical
 * answers a parent is looking for: when, where, who, and how to join.
 */
export function ClassCard({
  klass,
  subjectName,
  tutorName,
  locationName,
  href,
  whatsappHref,
  trialHref,
  registerHref,
  className,
}: ClassCardProps) {
  const canTrial = klass.trialAvailable && klass.availability !== "full";

  return (
    <Card
      as="article"
      padding="md"
      interactive={Boolean(href)}
      className={cn("relative flex h-full flex-col gap-4", className)}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone="brand" size="sm">
          {subjectName}
        </Pill>
        <Pill tone="outline" size="sm">
          {klass.level}
        </Pill>
        <Pill tone={availabilityTone[klass.availability]} size="sm">
          {CLASS_AVAILABILITY_LABELS[klass.availability]}
        </Pill>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-ink sm:text-xl">
          {href ? (
            <Link href={href} className="after:absolute after:inset-0">
              {klass.title}
            </Link>
          ) : (
            klass.title
          )}
        </h3>
        {/* Clamped so a grid of cards keeps a common rhythm; the full text is
            on the class detail page. */}
        <p className="line-clamp-3 text-sm leading-relaxed text-ink-soft">
          {klass.description}
        </p>
      </div>

      <dl className="grid gap-2.5 border-t border-line pt-4 text-sm sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <dt className="sr-only">Day</dt>
          <CalendarDays aria-hidden="true" className="size-4 shrink-0 text-brand" />
          <dd className="text-ink-soft">{dayLabel(klass.day)}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="sr-only">Time</dt>
          <Clock aria-hidden="true" className="size-4 shrink-0 text-brand" />
          <dd className="text-ink-soft">
            {formatTime(klass.startTime)} · {formatDuration(klass.startTime, klass.endTime)}
          </dd>
        </div>
        {tutorName ? (
          <div className="flex items-center gap-2">
            <dt className="sr-only">Tutor</dt>
            <User aria-hidden="true" className="size-4 shrink-0 text-brand" />
            <dd className="text-ink-soft">{tutorName}</dd>
          </div>
        ) : null}
        <div className="flex items-center gap-2">
          <dt className="sr-only">Where</dt>
          <MapPin aria-hidden="true" className="size-4 shrink-0 text-brand" />
          <dd className="text-ink-soft">
            {locationName ?? CLASS_MODE_LABELS[klass.mode]}
            {locationName && klass.mode !== "physical"
              ? ` · ${CLASS_MODE_LABELS[klass.mode]}`
              : ""}
          </dd>
        </div>
      </dl>

      <div className="mt-auto flex flex-wrap items-center gap-2.5 pt-1">
        {href ? (
          <Link
            href={href}
            className={cn(
              buttonClasses({ variant: "primary", size: "sm" }),
              // Lifts above the card-wide stretched link from the title.
              "relative z-10",
            )}
          >
            View details
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        ) : null}
        {canTrial && trialHref ? (
          <Link
            href={trialHref}
            className={cn(
              buttonClasses({ variant: href ? "secondary" : "primary", size: "sm" }),
              "relative z-10",
            )}
          >
            Book a trial
          </Link>
        ) : null}
        {!canTrial && registerHref ? (
          <Link
            href={registerHref}
            className={cn(buttonClasses({ variant: "secondary", size: "sm" }), "relative z-10")}
          >
            Register interest
          </Link>
        ) : null}
        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-flex h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-brand transition-colors duration-200 hover:bg-brand-soft"
          >
            <MessageCircle aria-hidden="true" className="size-4" />
            Ask about this class
          </a>
        ) : null}
      </div>
    </Card>
  );
}
