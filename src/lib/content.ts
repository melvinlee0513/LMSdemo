import {
  DAYS,
  SUBJECT_CATEGORY_LABELS,
  type Day,
  type SubjectCategory,
} from "@/config/constants";
import type {
  Centre,
  CentreLocation,
  Subject,
  Testimonial,
  TuitionClass,
  Tutor,
} from "@/config/types";
import { toMinutes, uniqueBy } from "@/lib/utils";

/**
 * ---------------------------------------------------------------------------
 * Content queries
 * ---------------------------------------------------------------------------
 * Pure functions over a validated centre. They exist so that pages and
 * components never re-implement relationship logic (which class belongs to
 * which subject, which tutor teaches what) and so internal linking stays
 * consistent across the site.
 */

/* --- lookups -------------------------------------------------------------- */

export function findSubject(centre: Centre, slug: string): Subject | undefined {
  return centre.subjects.find((subject) => subject.slug === slug);
}

export function findClass(
  centre: Centre,
  slug: string,
): TuitionClass | undefined {
  return centre.classes.find((klass) => klass.slug === slug);
}

export function findTutor(centre: Centre, slug: string): Tutor | undefined {
  return centre.tutors.find((tutor) => tutor.slug === slug);
}

export function findLocation(
  centre: Centre,
  slug: string,
): CentreLocation | undefined {
  return centre.locations.find((location) => location.slug === slug);
}

export function primaryLocation(centre: Centre): CentreLocation | undefined {
  return centre.locations.find((location) => location.isPrimary) ?? centre.locations[0];
}

/* --- relationships -------------------------------------------------------- */

export function classesForSubject(
  centre: Centre,
  subjectSlug: string,
): TuitionClass[] {
  return sortClasses(
    centre.classes.filter((klass) => klass.subject === subjectSlug),
  );
}

export function classesForTutor(
  centre: Centre,
  tutorSlug: string,
): TuitionClass[] {
  return sortClasses(centre.classes.filter((klass) => klass.tutor === tutorSlug));
}

export function classesForLocation(
  centre: Centre,
  locationSlug: string,
): TuitionClass[] {
  return sortClasses(
    centre.classes.filter((klass) => klass.location === locationSlug),
  );
}

export function tutorsForSubject(centre: Centre, subjectSlug: string): Tutor[] {
  return centre.tutors.filter((tutor) => tutor.subjects.includes(subjectSlug));
}

export function subjectsForTutor(centre: Centre, tutor: Tutor): Subject[] {
  return tutor.subjects
    .map((slug) => findSubject(centre, slug))
    .filter((subject): subject is Subject => Boolean(subject));
}

export function subjectsForLocation(
  centre: Centre,
  location: CentreLocation,
): Subject[] {
  const slugs =
    location.subjects ??
    uniqueBy(
      classesForLocation(centre, location.slug).map((klass) => klass.subject),
      (slug) => slug,
    );

  return slugs
    .map((slug) => findSubject(centre, slug))
    .filter((subject): subject is Subject => Boolean(subject));
}

export function testimonialsForSubject(
  centre: Centre,
  subjectSlug: string,
): Testimonial[] {
  return centre.testimonials.filter(
    (testimonial) => testimonial.subject === subjectSlug,
  );
}

/* --- collections ---------------------------------------------------------- */

export function featuredSubjects(centre: Centre, limit = 3): Subject[] {
  const featured = centre.subjects.filter((subject) => subject.featured);
  const pool = featured.length > 0 ? featured : centre.subjects;
  return pool.slice(0, limit);
}

export function featuredTutors(centre: Centre, limit = 4): Tutor[] {
  const featured = centre.tutors.filter((tutor) => tutor.featured);
  const pool = featured.length > 0 ? featured : centre.tutors;
  return pool.slice(0, limit);
}

export function featuredTestimonials(centre: Centre): Testimonial[] {
  return centre.testimonials.filter((testimonial) => testimonial.featured);
}

export function sortClasses(classes: TuitionClass[]): TuitionClass[] {
  return [...classes].sort((a, b) => {
    const dayDelta = DAYS.indexOf(a.day) - DAYS.indexOf(b.day);
    if (dayDelta !== 0) return dayDelta;
    return toMinutes(a.startTime) - toMinutes(b.startTime);
  });
}

/** Weekly grid data: every day that has at least one class, in order. */
export function classesByDay(
  classes: TuitionClass[],
): { day: Day; classes: TuitionClass[] }[] {
  return DAYS.map((day) => ({
    day,
    classes: sortClasses(classes.filter((klass) => klass.day === day)),
  }));
}

/* --- filter option lists -------------------------------------------------- */

export function subjectCategoriesInUse(
  centre: Centre,
): { id: SubjectCategory; label: string }[] {
  const used = new Set(centre.subjects.map((subject) => subject.category));

  return (Object.keys(SUBJECT_CATEGORY_LABELS) as SubjectCategory[])
    .filter((category) => used.has(category))
    .map((category) => ({
      id: category,
      label: SUBJECT_CATEGORY_LABELS[category],
    }));
}

/** Levels in the order they appear across subjects, e.g. Form 3 → Form 5. */
export function levelsInUse(centre: Centre): string[] {
  const levels = centre.classes.map((klass) => klass.level);
  return [...new Set(levels)].sort((a, b) =>
    a.localeCompare(b, "en", { numeric: true }),
  );
}

export function daysInUse(centre: Centre): Day[] {
  const used = new Set(centre.classes.map((klass) => klass.day));
  return DAYS.filter((day) => used.has(day));
}

/* --- SEO eligibility ------------------------------------------------------ */

/**
 * Detail pages exist for humans whenever the feature is enabled, but only
 * pages carrying genuinely unique content are ever indexed or listed in the
 * sitemap. This is the single place that decision is made.
 */
export function isSubjectIndexable(centre: Centre, subject: Subject): boolean {
  return (
    centre.featureFlags.subjectDetailPages &&
    subject.seoIndexable &&
    Boolean(subject.detail)
  );
}

export function isClassIndexable(centre: Centre, klass: TuitionClass): boolean {
  return centre.featureFlags.classDetailPages && klass.seoIndexable;
}

export function isLocationIndexable(
  centre: Centre,
  location: CentreLocation,
): boolean {
  return (
    centre.featureFlags.locationDetailPages &&
    location.seoIndexable &&
    Boolean(location.intro)
  );
}
