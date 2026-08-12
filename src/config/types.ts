import type { z } from "zod";

import type {
  aboutSchema,
  brandingSchema,
  centreSchema,
  classSchema,
  componentVariantsSchema,
  contactSchema,
  ctaSectionSchema,
  featureFlagsSchema,
  footerSchema,
  formsSchema,
  heroSchema,
  identitySchema,
  locationSchema,
  methodsSchema,
  navigationSchema,
  openingHoursSchema,
  seoSchema,
  socialSchema,
  statSchema,
  subjectSchema,
  testimonialSchema,
  tutorSchema,
  whatsappSchema,
} from "@/config/centre.schema";

/**
 * The validated, defaults-applied shape the engine renders from.
 * Components should depend on these types — never on a specific centre.
 */
export type Centre = z.output<typeof centreSchema>;

/**
 * The authoring shape. Centre files are written as
 * `satisfies CentreDefinition`, so optional fields with defaults may be
 * omitted while typos are still caught in the editor.
 */
export type CentreDefinition = z.input<typeof centreSchema>;

export type Identity = z.output<typeof identitySchema>;
export type Branding = z.output<typeof brandingSchema>;
export type Seo = z.output<typeof seoSchema>;
export type Contact = z.output<typeof contactSchema>;
export type Social = z.output<typeof socialSchema>;
export type Navigation = z.output<typeof navigationSchema>;
export type Footer = z.output<typeof footerSchema>;
export type Hero = z.output<typeof heroSchema>;
export type Stat = z.output<typeof statSchema>;
export type Methods = z.output<typeof methodsSchema>;
export type About = z.output<typeof aboutSchema>;
export type CtaSection = z.output<typeof ctaSectionSchema>;
export type FeatureFlags = z.output<typeof featureFlagsSchema>;
export type ComponentVariants = z.output<typeof componentVariantsSchema>;
export type Forms = z.output<typeof formsSchema>;
export type WhatsappConfig = z.output<typeof whatsappSchema>;
export type OpeningHours = z.output<typeof openingHoursSchema>;

export type Subject = z.output<typeof subjectSchema>;
export type TuitionClass = z.output<typeof classSchema>;
export type Tutor = z.output<typeof tutorSchema>;
export type Testimonial = z.output<typeof testimonialSchema>;
export type CentreLocation = z.output<typeof locationSchema>;

export type CentreImage = Subject["image"] extends infer T
  ? Exclude<T, undefined>
  : never;

export type SiteMode = "demo" | "production";
