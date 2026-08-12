import type { ClassCardProps } from "@/components/cards/ClassCard";
import type { SubjectCardProps } from "@/components/cards/SubjectCard";
import type { TimetableEntry } from "@/components/timetable/types";
import type { Centre, Subject, TuitionClass } from "@/config/types";
import {
  classesForSubject,
  findLocation,
  findSubject,
  findTutor,
  tutorsForSubject,
} from "@/lib/content";
import { whatsappHref } from "@/lib/whatsapp";

/**
 * ---------------------------------------------------------------------------
 * View models
 * ---------------------------------------------------------------------------
 * Cards take flat, already-resolved props so they stay dumb and reusable.
 * These builders are the one place relationships, links, feature flags and
 * WhatsApp templates are turned into those props — used by the homepage, the
 * index pages and every detail page alike.
 */

function whatsapp(centre: Centre) {
  return centre.featureFlags.whatsapp ? centre.whatsapp : undefined;
}

export function subjectCardProps(
  centre: Centre,
  subject: Subject,
  index?: number,
): SubjectCardProps {
  return {
    subject,
    index,
    href: centre.featureFlags.subjectDetailPages
      ? `/subjects/${subject.slug}`
      : undefined,
    tutorCount: centre.featureFlags.tutors
      ? tutorsForSubject(centre, subject.slug).length
      : undefined,
    classCount: centre.featureFlags.classes
      ? classesForSubject(centre, subject.slug).length
      : undefined,
    whatsappHref: whatsappHref(whatsapp(centre), "subject", {
      centre: centre.identity.name,
      subject: subject.name,
    }),
  };
}

export function classCardProps(centre: Centre, klass: TuitionClass): ClassCardProps {
  const subject = findSubject(centre, klass.subject);
  const tutor = klass.tutor ? findTutor(centre, klass.tutor) : undefined;
  const location = klass.location ? findLocation(centre, klass.location) : undefined;

  return {
    klass,
    subjectName: subject?.name ?? klass.subject,
    tutorName: centre.featureFlags.tutors ? tutor?.name : undefined,
    locationName: location?.name,
    href: centre.featureFlags.classDetailPages ? `/classes/${klass.slug}` : undefined,
    trialHref: centre.featureFlags.trialRegistration
      ? `/trial?class=${klass.slug}`
      : undefined,
    registerHref: centre.featureFlags.studentRegistration ? "/register" : undefined,
    whatsappHref: whatsappHref(whatsapp(centre), "class", {
      centre: centre.identity.name,
      class: klass.title,
      subject: subject?.name,
    }),
  };
}

export function timetableEntries(
  centre: Centre,
  classes: TuitionClass[] = centre.classes,
): TimetableEntry[] {
  return classes.map((klass) => {
    const subject = findSubject(centre, klass.subject);
    const tutor = klass.tutor ? findTutor(centre, klass.tutor) : undefined;
    const location = klass.location ? findLocation(centre, klass.location) : undefined;

    return {
      slug: klass.slug,
      title: klass.title,
      subjectSlug: klass.subject,
      subjectName: subject?.shortName ?? subject?.name ?? klass.subject,
      accent: subject?.accent,
      level: klass.level,
      day: klass.day,
      startTime: klass.startTime,
      endTime: klass.endTime,
      mode: klass.mode,
      tutorName: centre.featureFlags.tutors ? tutor?.name : undefined,
      locationSlug: location?.slug,
      locationName: location?.name,
      href: centre.featureFlags.classDetailPages ? `/classes/${klass.slug}` : undefined,
    };
  });
}

/** Option lists shared by the forms and the filter controls. */
export function subjectOptions(centre: Centre) {
  return centre.subjects.map((subject) => ({
    value: subject.slug,
    label: subject.name,
  }));
}

export function levelOptions(centre: Centre) {
  const levels = [...new Set(centre.classes.map((klass) => klass.level))].sort((a, b) =>
    a.localeCompare(b, "en", { numeric: true }),
  );
  return levels.map((level) => ({ value: level, label: level }));
}

export function classOptions(centre: Centre) {
  return centre.classes.map((klass) => ({
    value: klass.slug,
    label: `${klass.title} — ${klass.level}`,
    subject: klass.subject,
  }));
}

export function locationOptions(centre: Centre) {
  return centre.locations.map((location) => ({
    value: location.slug,
    label: location.name,
  }));
}
