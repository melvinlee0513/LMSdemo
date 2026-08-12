import { z } from "zod";

import {
  CLASS_AVAILABILITY,
  CLASS_MODES,
  CTA_VARIANTS,
  DAYS,
  FONT_KEYS,
  HERO_VARIANTS,
  HOMEPAGE_SECTIONS,
  METHOD_VARIANTS,
  STAT_VARIANTS,
  SUBJECT_CATEGORIES,
  SUBJECT_VARIANTS,
  TESTIMONIAL_VARIANTS,
  TUTOR_VARIANTS,
} from "@/config/constants";
import { ICON_NAMES } from "@/lib/icon-names";

/* -------------------------------------------------------------------------- */
/* Primitives                                                                  */
/* -------------------------------------------------------------------------- */

const hexColour = z
  .string()
  .regex(
    /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
    "must be a hex colour such as #ef4524",
  );

const slug = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "must be lowercase, hyphenated and URL safe (e.g. additional-mathematics)",
  );

const assetPath = z
  .string()
  .startsWith("/", "must be an absolute path under /public (e.g. /centres/…)");

const iconName = z.enum(ICON_NAMES);

const timeOfDay = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "must be 24-hour HH:MM (e.g. 16:30)");

/**
 * International dialling format without punctuation, e.g. 60123456789.
 * WhatsApp deep links require exactly this shape.
 */
const whatsappNumber = z
  .string()
  .regex(
    /^[1-9]\d{6,14}$/,
    "must be digits only in international format without '+' (e.g. 60123456789)",
  );

const imageSchema = z.strictObject({
  src: assetPath,
  alt: z.string().min(1, "every content image needs useful alt text"),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const linkSchema = z.strictObject({
  label: z.string().min(1),
  href: z.string().min(1),
  /** Hidden automatically when the named feature flag is disabled. */
  flag: z.string().optional(),
  external: z.boolean().optional(),
});

const ctaSchema = z.strictObject({
  label: z.string().min(1),
  href: z.string().min(1),
});

/* -------------------------------------------------------------------------- */
/* Identity, branding, SEO, contact                                            */
/* -------------------------------------------------------------------------- */

export const identitySchema = z.strictObject({
  name: z.string().min(2),
  shortName: z.string().min(1).optional(),
  legalName: z.string().min(2).optional(),
  tagline: z.string().min(4).optional(),
  description: z
    .string()
    .min(40, "used for metadata and structured data — write a real sentence"),
  logo: assetPath,
  logoMark: assetPath.optional(),
  /**
   * `image`          the logo file already contains the centre name.
   * `mark-and-name`  the file is a square mark; the engine sets the centre
   *                  name beside it in the brand typeface (crisper, and it
   *                  re-themes with the rest of the site).
   */
  logoLockup: z.enum(["image", "mark-and-name"]).default("image"),
  favicon: assetPath.optional(),
  appleIcon: assetPath.optional(),
  establishedYear: z.number().int().min(1900).max(2100).optional(),
  /** Only set when the centre genuinely operates from this city/area. */
  city: z.string().min(2).optional(),
  state: z.string().min(2).optional(),
  country: z.string().min(2).default("Malaysia"),
});

export const brandingSchema = z.strictObject({
  primary: hexColour,
  secondary: hexColour,
  soft: hexColour.default("#fff0ed"),
  soft2: hexColour.default("#fff8f5"),
  textPrimary: hexColour.default("#202632"),
  textSecondary: hexColour.default("#687385"),
  textMuted: hexColour.default("#8b93a1"),
  surface: hexColour.default("#ffffff"),
  surfaceWarm: hexColour.default("#fffdfb"),
  surfaceMuted: hexColour.default("#fafafa"),
  border: hexColour.default("#e7e9ee"),
  borderWarm: hexColour.default("#f1ded8"),
  footer: hexColour.default("#202632"),
  font: z.enum(FONT_KEYS).default("poppins"),
  /** Angle of the primary brand gradient, in degrees. */
  gradientAngle: z.number().min(0).max(360).default(100),
});

export const seoSchema = z.strictObject({
  titleTemplate: z
    .string()
    .includes("%s", { message: "must contain %s, e.g. \"%s | Centre Name\"" }),
  defaultTitle: z.string().min(10).max(70),
  defaultDescription: z.string().min(70).max(200),
  keywords: z.array(z.string().min(2)).max(12).optional(),
  locale: z.string().default("en_MY"),
  language: z.string().default("en-MY"),
  searchConsoleVerification: z.string().optional(),
  defaultOgImage: assetPath.optional(),
  /** Per-route metadata overrides, keyed by route key (see ROUTES). */
  pages: z
    .record(
      z.string(),
      z.strictObject({
        title: z.string().min(5).optional(),
        description: z.string().min(50).max(200).optional(),
      }),
    )
    .optional(),
});

export const openingHoursSchema = z.strictObject({
  /** Human-readable label, e.g. "Monday – Friday". */
  label: z.string().min(3),
  /** Human-readable value, e.g. "2:00 PM – 9:30 PM" or "Closed". */
  value: z.string().min(3),
  /** Optional machine-readable form for LocalBusiness structured data. */
  days: z.array(z.enum(DAYS)).nonempty().optional(),
  opens: timeOfDay.optional(),
  closes: timeOfDay.optional(),
});

export const contactSchema = z.strictObject({
  phone: z.string().min(6).optional(),
  whatsapp: whatsappNumber.optional(),
  email: z.email().optional(),
  hours: z.array(openingHoursSchema).optional(),
  /** Order in which contact channels are presented. */
  priority: z
    .array(z.enum(["whatsapp", "phone", "form", "email"]))
    .default(["whatsapp", "phone", "form", "email"]),
});

export const socialSchema = z.strictObject({
  facebook: z.url().optional(),
  instagram: z.url().optional(),
  tiktok: z.url().optional(),
  youtube: z.url().optional(),
  linkedin: z.url().optional(),
});

/* -------------------------------------------------------------------------- */
/* Navigation & footer                                                         */
/* -------------------------------------------------------------------------- */

export const navigationSchema = z.strictObject({
  primary: z.array(linkSchema).min(1).max(8),
  cta: ctaSchema.optional(),
  /** Secondary action rendered inside the mobile drawer. */
  mobileSecondaryCta: ctaSchema.optional(),
});

export const footerSchema = z.strictObject({
  description: z.string().min(40).optional(),
  groups: z
    .array(
      z.strictObject({
        title: z.string().min(2),
        links: z.array(linkSchema).min(1),
      }),
    )
    .optional(),
  legalLinks: z.array(linkSchema).optional(),
  copyright: z.string().optional(),
  /** Small print, e.g. company registration number. */
  note: z.string().optional(),
});

/* -------------------------------------------------------------------------- */
/* Hero, stats, methods, CTA                                                   */
/* -------------------------------------------------------------------------- */

const headlineFragment = z.strictObject({
  text: z.string().min(1),
  /** Renders in the brand colour or gradient. Use selectively. */
  highlight: z.boolean().optional(),
  /** Forces a line break after this fragment on desktop. */
  break: z.boolean().optional(),
});

export const heroSchema = z.strictObject({
  eyebrow: z.string().min(3).optional(),
  headline: z.array(headlineFragment).min(1),
  description: z.string().min(40),
  primaryCta: ctaSchema,
  secondaryCta: ctaSchema.optional(),
  /**
   * Optional trust indicator. Only render numbers the centre actually has —
   * never fabricate ratings or student counts.
   */
  trust: z
    .strictObject({
      rating: z.number().min(0).max(5).optional(),
      ratingLabel: z.string().min(3).optional(),
      avatars: z.array(imageSchema).max(5).optional(),
      text: z.string().min(3).optional(),
    })
    .optional(),
  media: z.strictObject({
    image: imageSchema,
    /** Small caption card overlaid on the hero visual. */
    badge: z
      .strictObject({
        icon: iconName,
        title: z.string().min(2),
        subtitle: z.string().min(2).optional(),
      })
      .optional(),
    /**
     * Rendered by the `split-preview` variant as a lesson-preview panel over
     * the hero image. A still image and real information only — the engine
     * never autoplays video in the hero.
     */
    preview: z
      .strictObject({
        label: z.string().min(2),
        title: z.string().min(2),
        meta: z.array(z.string().min(1)).min(1).max(3),
      })
      .optional(),
    /** Floating stat chip shown beside the hero visual. */
    chip: z
      .strictObject({
        icon: iconName,
        value: z.string().min(1),
        label: z.string().min(2),
      })
      .optional(),
  }),
});

export const statSchema = z.strictObject({
  icon: iconName,
  value: z.string().min(1),
  label: z.string().min(2),
  /** Optional clarifier, e.g. "since 2016". */
  hint: z.string().min(2).optional(),
});

export const methodsSchema = z.strictObject({
  eyebrow: z.string().min(3).optional(),
  heading: z.string().min(5),
  highlight: z.string().min(2).optional(),
  description: z.string().min(30).optional(),
  items: z
    .array(
      z.strictObject({
        icon: iconName,
        title: z.string().min(3),
        description: z.string().min(20),
      }),
    )
    .min(2)
    .max(8),
});

/**
 * Optional per-section heading copy, keyed by homepage section id (and reused
 * on the matching index page). Anything omitted falls back to engine defaults
 * written from the centre's own data, so a new centre works with none of this.
 */
export const sectionCopySchema = z.record(
  z.string(),
  z.strictObject({
    eyebrow: z.string().min(3).optional(),
    heading: z.string().min(5).optional(),
    highlight: z.string().min(2).optional(),
    description: z.string().min(20).optional(),
  }),
);

export const ctaSectionSchema = z.strictObject({
  eyebrow: z.string().min(3).optional(),
  heading: z.string().min(5),
  highlight: z.string().min(2).optional(),
  description: z.string().min(20).optional(),
  bullets: z.array(z.string().min(3)).max(5).optional(),
  primaryCta: ctaSchema,
  secondaryLabel: z.string().min(3).optional(),
  /** When true a WhatsApp action is offered alongside the primary CTA. */
  whatsapp: z.boolean().default(true),
});

/* -------------------------------------------------------------------------- */
/* About page                                                                  */
/* -------------------------------------------------------------------------- */

export const aboutSchema = z.strictObject({
  eyebrow: z.string().min(3).optional(),
  heading: z.string().min(5),
  highlight: z.string().min(2).optional(),
  intro: z.array(z.string().min(40)).min(1).max(4),
  mission: z.strictObject({
    title: z.string().min(3),
    body: z.string().min(40),
  }),
  values: z
    .array(
      z.strictObject({
        icon: iconName,
        title: z.string().min(3),
        description: z.string().min(20),
      }),
    )
    .min(2)
    .max(6),
  history: z
    .array(
      z.strictObject({
        year: z.string().min(4),
        title: z.string().min(3),
        description: z.string().min(20),
      }),
    )
    .optional(),
  image: imageSchema.optional(),
});

/* -------------------------------------------------------------------------- */
/* Feature flags, variants, forms, WhatsApp                                    */
/* -------------------------------------------------------------------------- */

export const featureFlagsSchema = z.strictObject({
  about: z.boolean(),
  subjects: z.boolean(),
  subjectDetailPages: z.boolean(),
  classes: z.boolean(),
  classDetailPages: z.boolean(),
  tutors: z.boolean(),
  timetable: z.boolean(),
  testimonials: z.boolean(),
  locations: z.boolean(),
  locationDetailPages: z.boolean(),
  trialRegistration: z.boolean(),
  studentRegistration: z.boolean(),
  enquiryForm: z.boolean(),
  parentLeadCapture: z.boolean(),
  whatsapp: z.boolean(),
});

export const componentVariantsSchema = z.strictObject({
  hero: z.enum(HERO_VARIANTS),
  subjects: z.enum(SUBJECT_VARIANTS),
  tutors: z.enum(TUTOR_VARIANTS),
  testimonials: z.enum(TESTIMONIAL_VARIANTS),
  methods: z.enum(METHOD_VARIANTS),
  stats: z.enum(STAT_VARIANTS),
  cta: z.enum(CTA_VARIANTS),
});

export const formsSchema = z.strictObject({
  /**
   * Production submission adapter. `webhook` posts to FORM_WEBHOOK_URL.
   * In demo mode the adapter is bypassed entirely — nothing leaves the browser.
   */
  provider: z.enum(["none", "webhook"]).default("none"),
  privacyNotice: z.string().min(30),
  consentLabel: z.string().min(20).optional(),
  successTitle: z.string().min(5).default("Thank you — we've got your details"),
  successBody: z.string().min(20),
});

export const whatsappSchema = z.strictObject({
  number: whatsappNumber,
  /** Display form, e.g. "+60 12-345 6789". */
  displayNumber: z.string().min(6).optional(),
  floatingButton: z.boolean().default(true),
  mobileStickyBar: z.boolean().default(true),
  /**
   * Message templates. `{{name}}`, `{{level}}`, `{{subject}}`, `{{centre}}`
   * and `{{branch}}` are substituted where available.
   */
  templates: z.strictObject({
    general: z.string().min(10),
    subject: z.string().min(10),
    class: z.string().min(10),
    tutor: z.string().min(10),
    trial: z.string().min(10),
    location: z.string().min(10),
  }),
});

/* -------------------------------------------------------------------------- */
/* Content collections                                                         */
/* -------------------------------------------------------------------------- */

export const subjectSchema = z.strictObject({
  slug,
  name: z.string().min(2),
  shortName: z.string().min(1).optional(),
  category: z.enum(SUBJECT_CATEGORIES),
  icon: iconName,
  summary: z.string().min(40).max(240),
  levels: z.array(z.string().min(2)).min(1),
  image: imageSchema.optional(),
  /** Muted colour used for subject coding in the timetable. */
  accent: hexColour.optional(),
  featured: z.boolean().default(false),
  /**
   * Detail pages are only generated for subjects that carry genuinely unique
   * content. Thin pages hurt the whole domain — leave this false by default.
   */
  seoIndexable: z.boolean().default(false),
  detail: z
    .strictObject({
      intro: z.string().min(120),
      outcomes: z.array(z.string().min(10)).min(3),
      approach: z
        .array(
          z.strictObject({
            title: z.string().min(3),
            description: z.string().min(30),
          }),
        )
        .min(2),
      faqs: z
        .array(
          z.strictObject({
            question: z.string().min(8),
            answer: z.string().min(30),
          }),
        )
        .optional(),
    })
    .optional(),
});

export const classSchema = z.strictObject({
  slug,
  title: z.string().min(4),
  subject: slug,
  level: z.string().min(2),
  tutor: slug.optional(),
  location: slug.optional(),
  day: z.enum(DAYS),
  startTime: timeOfDay,
  endTime: timeOfDay,
  mode: z.enum(CLASS_MODES),
  availability: z.enum(CLASS_AVAILABILITY).default("open"),
  trialAvailable: z.boolean().default(true),
  description: z.string().min(40),
  highlights: z.array(z.string().min(6)).max(6).optional(),
  seoIndexable: z.boolean().default(false),
});

export const tutorSchema = z.strictObject({
  slug,
  name: z.string().min(3),
  role: z.string().min(3).optional(),
  subjects: z.array(slug).min(1),
  image: imageSchema,
  bio: z.string().min(60),
  expertise: z.array(z.string().min(3)).min(1).max(6),
  /** Only populate these when the centre has verified the numbers. */
  yearsExperience: z.number().int().min(0).max(60).optional(),
  studentsTaught: z.number().int().min(0).optional(),
  rating: z.number().min(0).max(5).optional(),
  qualifications: z.array(z.string().min(4)).optional(),
  locations: z.array(slug).optional(),
  featured: z.boolean().default(false),
});

export const testimonialSchema = z.strictObject({
  id: slug,
  quote: z.string().min(60),
  author: z.string().min(2),
  authorType: z.enum(["student", "parent"]),
  context: z.string().min(3).optional(),
  avatar: imageSchema.optional(),
  rating: z.number().int().min(1).max(5).optional(),
  outcome: z.string().min(2).optional(),
  subject: slug.optional(),
  year: z.string().min(4).optional(),
  featured: z.boolean().default(false),
});

export const locationSchema = z.strictObject({
  slug,
  name: z.string().min(3),
  addressLines: z.array(z.string().min(3)).min(1),
  city: z.string().min(2),
  state: z.string().min(2),
  postcode: z.string().min(4),
  country: z.string().min(2).default("Malaysia"),
  phone: z.string().min(6).optional(),
  whatsapp: whatsappNumber.optional(),
  email: z.email().optional(),
  hours: z.array(openingHoursSchema).optional(),
  mapUrl: z.url().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  subjects: z.array(slug).optional(),
  image: imageSchema.optional(),
  isPrimary: z.boolean().default(false),
  seoIndexable: z.boolean().default(false),
  /** Unique, human-written branch copy. Required for a detail page. */
  intro: z.string().min(120).optional(),
  gettingHere: z.array(z.string().min(10)).optional(),
});

/* -------------------------------------------------------------------------- */
/* Centre                                                                      */
/* -------------------------------------------------------------------------- */

export const centreSchema = z
  .strictObject({
    id: slug,
    identity: identitySchema,
    branding: brandingSchema,
    seo: seoSchema,
    contact: contactSchema,
    social: socialSchema.default({}),
    navigation: navigationSchema,
    footer: footerSchema,
    hero: heroSchema,
    stats: z.array(statSchema).max(6).default([]),
    methods: methodsSchema.optional(),
    about: aboutSchema.optional(),
    trialCta: ctaSectionSchema.optional(),
    finalCta: ctaSectionSchema,
    featureFlags: featureFlagsSchema,
    componentVariants: componentVariantsSchema,
    homepageSections: z.array(z.enum(HOMEPAGE_SECTIONS)).min(1),
    sectionCopy: sectionCopySchema.optional(),
    forms: formsSchema,
    whatsapp: whatsappSchema.optional(),
    privacy: z.strictObject({
      updated: z.string().min(4),
      intro: z.string().min(60),
      sections: z
        .array(
          z.strictObject({
            title: z.string().min(3),
            body: z.array(z.string().min(30)).min(1),
          }),
        )
        .min(3),
    }),
    subjects: z.array(subjectSchema).default([]),
    classes: z.array(classSchema).default([]),
    tutors: z.array(tutorSchema).default([]),
    testimonials: z.array(testimonialSchema).default([]),
    locations: z.array(locationSchema).default([]),
  })
  .superRefine((centre, ctx) => {
    const flags = centre.featureFlags;

    const issue = (path: (string | number)[], message: string) =>
      ctx.addIssue({ code: "custom", path, message });

    /* --- feature flags must be backed by data / configuration ------------- */

    if (flags.whatsapp && !centre.whatsapp) {
      issue(
        ["whatsapp"],
        "whatsapp configuration is required because featureFlags.whatsapp is true",
      );
    }

    const requireContent = (
      flag: boolean,
      key: "subjects" | "classes" | "tutors" | "testimonials" | "locations",
    ) => {
      if (flag && centre[key].length === 0) {
        issue(
          [key],
          `at least one ${key.replace(/s$/, "")} entry is required because featureFlags.${key} is true`,
        );
      }
    };

    requireContent(flags.subjects, "subjects");
    requireContent(flags.classes, "classes");
    requireContent(flags.tutors, "tutors");
    requireContent(flags.testimonials, "testimonials");
    requireContent(flags.locations, "locations");

    if (flags.timetable && centre.classes.length === 0) {
      issue(
        ["classes"],
        "the timetable needs at least one class because featureFlags.timetable is true",
      );
    }

    if (flags.subjectDetailPages && !flags.subjects) {
      issue(
        ["featureFlags", "subjectDetailPages"],
        "subjectDetailPages requires featureFlags.subjects to be true",
      );
    }
    if (flags.classDetailPages && !flags.classes) {
      issue(
        ["featureFlags", "classDetailPages"],
        "classDetailPages requires featureFlags.classes to be true",
      );
    }
    if (flags.locationDetailPages && !flags.locations) {
      issue(
        ["featureFlags", "locationDetailPages"],
        "locationDetailPages requires featureFlags.locations to be true",
      );
    }

    if (flags.about && !centre.about) {
      issue(
        ["about"],
        "about content is required because featureFlags.about is true",
      );
    }

    if (flags.trialRegistration && !centre.trialCta) {
      issue(
        ["trialCta"],
        "trialCta is required because featureFlags.trialRegistration is true",
      );
    }

    if (
      (flags.enquiryForm || flags.trialRegistration || flags.studentRegistration) &&
      !centre.forms.privacyNotice
    ) {
      issue(
        ["forms", "privacyNotice"],
        "forms.privacyNotice is required whenever a form is enabled",
      );
    }

    /* --- referential integrity -------------------------------------------- */

    const subjectSlugs = new Set(centre.subjects.map((s) => s.slug));
    const tutorSlugs = new Set(centre.tutors.map((t) => t.slug));
    const locationSlugs = new Set(centre.locations.map((l) => l.slug));

    const assertUnique = (values: string[], path: string) => {
      const seen = new Set<string>();
      values.forEach((value, index) => {
        if (seen.has(value)) {
          issue([path, index], `duplicate slug/id "${value}"`);
        }
        seen.add(value);
      });
    };

    assertUnique(centre.subjects.map((s) => s.slug), "subjects");
    assertUnique(centre.classes.map((c) => c.slug), "classes");
    assertUnique(centre.tutors.map((t) => t.slug), "tutors");
    assertUnique(centre.testimonials.map((t) => t.id), "testimonials");
    assertUnique(centre.locations.map((l) => l.slug), "locations");

    centre.classes.forEach((klass, index) => {
      if (!subjectSlugs.has(klass.subject)) {
        issue(
          ["classes", index, "subject"],
          `unknown subject "${klass.subject}" — add it to subjects.ts or fix the slug`,
        );
      }
      if (klass.tutor && !tutorSlugs.has(klass.tutor)) {
        issue(["classes", index, "tutor"], `unknown tutor "${klass.tutor}"`);
      }
      if (klass.location && !locationSlugs.has(klass.location)) {
        issue(
          ["classes", index, "location"],
          `unknown location "${klass.location}"`,
        );
      }
      if (klass.endTime <= klass.startTime) {
        issue(
          ["classes", index, "endTime"],
          "endTime must be after startTime (overnight classes are not supported)",
        );
      }
    });

    centre.tutors.forEach((tutor, index) => {
      tutor.subjects.forEach((subject, subjectIndex) => {
        if (!subjectSlugs.has(subject)) {
          issue(
            ["tutors", index, "subjects", subjectIndex],
            `unknown subject "${subject}"`,
          );
        }
      });
      tutor.locations?.forEach((location, locationIndex) => {
        if (!locationSlugs.has(location)) {
          issue(
            ["tutors", index, "locations", locationIndex],
            `unknown location "${location}"`,
          );
        }
      });
    });

    centre.testimonials.forEach((testimonial, index) => {
      if (testimonial.subject && !subjectSlugs.has(testimonial.subject)) {
        issue(
          ["testimonials", index, "subject"],
          `unknown subject "${testimonial.subject}"`,
        );
      }
    });

    centre.locations.forEach((location, index) => {
      location.subjects?.forEach((subject, subjectIndex) => {
        if (!subjectSlugs.has(subject)) {
          issue(
            ["locations", index, "subjects", subjectIndex],
            `unknown subject "${subject}"`,
          );
        }
      });
      if (
        (location.latitude === undefined) !==
        (location.longitude === undefined)
      ) {
        issue(
          ["locations", index],
          "latitude and longitude must be supplied together or not at all",
        );
      }
    });

    /* --- SEO safety -------------------------------------------------------- */

    centre.subjects.forEach((subject, index) => {
      if (subject.seoIndexable && !subject.detail) {
        issue(
          ["subjects", index, "seoIndexable"],
          `subject "${subject.slug}" is marked indexable but has no detail content — thin pages must not be indexed`,
        );
      }
    });

    centre.locations.forEach((location, index) => {
      if (location.seoIndexable && !location.intro) {
        issue(
          ["locations", index, "seoIndexable"],
          `location "${location.slug}" is marked indexable but has no unique intro copy`,
        );
      }
    });

    /* --- homepage composition --------------------------------------------- */

    const sectionRequirements: Partial<
      Record<(typeof centre.homepageSections)[number], boolean>
    > = {
      subjects: flags.subjects,
      classes: flags.classes,
      tutors: flags.tutors,
      timetable: flags.timetable,
      testimonials: flags.testimonials,
      locations: flags.locations,
      trialCta: flags.trialRegistration,
      parentLead: flags.parentLeadCapture,
    };

    centre.homepageSections.forEach((section, index) => {
      if (sectionRequirements[section] === false) {
        issue(
          ["homepageSections", index],
          `section "${section}" is listed on the homepage but its feature flag is disabled`,
        );
      }
    });

    if (new Set(centre.homepageSections).size !== centre.homepageSections.length) {
      issue(["homepageSections"], "homepage sections must be unique");
    }

    /* --- contact ----------------------------------------------------------- */

    if (centre.contact.priority.includes("whatsapp") && !flags.whatsapp) {
      issue(
        ["contact", "priority"],
        "whatsapp is listed in contact.priority but featureFlags.whatsapp is false",
      );
    }
  });

export type CentreConfigInput = z.input<typeof centreSchema>;
export type CentreConfig = z.output<typeof centreSchema>;

/**
 * Validates a centre configuration, throwing a readable, actionable error.
 * Called once per process from `src/lib/site.ts`.
 */
export function parseCentre(id: string, raw: unknown): CentreConfig {
  const result = centreSchema.safeParse(raw);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => {
        const path = issue.path.length ? issue.path.join(".") : "(root)";
        return `  • ${path}: ${issue.message}`;
      })
      .join("\n");

    throw new Error(
      `Invalid centre configuration for "${id}":\n${details}\n\n` +
        `Fix src/centres/${id}/ and rebuild.`,
    );
  }

  return result.data;
}
