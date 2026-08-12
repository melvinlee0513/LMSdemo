/**
 * Shared vocabulary used by both the configuration schema and the engine.
 * These are the only values a centre configuration may choose between, which
 * keeps typos out of production and keeps the component registries honest.
 */

export const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type Day = (typeof DAYS)[number];

export const DAY_LABELS: Record<Day, { short: string; long: string }> = {
  mon: { short: "Mon", long: "Monday" },
  tue: { short: "Tue", long: "Tuesday" },
  wed: { short: "Wed", long: "Wednesday" },
  thu: { short: "Thu", long: "Thursday" },
  fri: { short: "Fri", long: "Friday" },
  sat: { short: "Sat", long: "Saturday" },
  sun: { short: "Sun", long: "Sunday" },
};

export const SUBJECT_CATEGORIES = [
  "mathematics",
  "science",
  "languages",
  "humanities",
  "other",
] as const;
export type SubjectCategory = (typeof SUBJECT_CATEGORIES)[number];

export const SUBJECT_CATEGORY_LABELS: Record<SubjectCategory, string> = {
  mathematics: "Mathematics",
  science: "Science",
  languages: "Languages",
  humanities: "Humanities",
  other: "Other",
};

export const CLASS_MODES = ["physical", "online", "hybrid"] as const;
export type ClassMode = (typeof CLASS_MODES)[number];

export const CLASS_MODE_LABELS: Record<ClassMode, string> = {
  physical: "In centre",
  online: "Online",
  hybrid: "Hybrid",
};

export const CLASS_AVAILABILITY = [
  "open",
  "limited",
  "full",
  "waitlist",
] as const;
export type ClassAvailability = (typeof CLASS_AVAILABILITY)[number];

export const CLASS_AVAILABILITY_LABELS: Record<ClassAvailability, string> = {
  open: "Places available",
  limited: "Few places left",
  full: "Class full",
  waitlist: "Waitlist open",
};

/**
 * Homepage sections that can be ordered through `homepageSections`.
 * Every key here must exist in `src/components/sections/registry.tsx`.
 */
export const HOMEPAGE_SECTIONS = [
  "hero",
  "stats",
  "subjects",
  "methods",
  "classes",
  "tutors",
  "timetable",
  "testimonials",
  "locations",
  "parentLead",
  "trialCta",
  "finalCta",
] as const;
export type HomepageSection = (typeof HOMEPAGE_SECTIONS)[number];

export const HERO_VARIANTS = [
  "split-preview",
  "split-illustration",
  "split-photo",
  "centered",
] as const;

export const SUBJECT_VARIANTS = ["split-cards", "grid", "editorial"] as const;

export const TUTOR_VARIANTS = ["portrait-card", "portrait-overlay"] as const;

export const TESTIMONIAL_VARIANTS = [
  "featured-carousel",
  "grid",
  "featured-and-grid",
] as const;

export const METHOD_VARIANTS = ["cards", "timeline"] as const;

export const STAT_VARIANTS = ["cards", "inline"] as const;

export const CTA_VARIANTS = ["boxed", "banner"] as const;

export const FONT_KEYS = ["poppins"] as const;
export type FontKey = (typeof FONT_KEYS)[number];

/** Canonical route table. Detail routes are built from these prefixes. */
export const ROUTES = {
  home: "/",
  about: "/about",
  subjects: "/subjects",
  classes: "/classes",
  tutors: "/tutors",
  timetable: "/timetable",
  testimonials: "/testimonials",
  locations: "/locations",
  contact: "/contact",
  register: "/register",
  trial: "/trial",
  privacy: "/privacy",
} as const;

export type RouteKey = keyof typeof ROUTES;

/**
 * Feature flags that gate a whole route. Used by navigation, the footer,
 * the sitemap and the route handlers themselves so a disabled feature never
 * leaks a link or an indexable empty page.
 */
export const FEATURE_FLAGS = [
  "about",
  "subjects",
  "subjectDetailPages",
  "classes",
  "classDetailPages",
  "tutors",
  "timetable",
  "testimonials",
  "locations",
  "locationDetailPages",
  "trialRegistration",
  "studentRegistration",
  "enquiryForm",
  "parentLeadCapture",
  "whatsapp",
] as const;
export type FeatureFlag = (typeof FEATURE_FLAGS)[number];
