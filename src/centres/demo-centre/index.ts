import type { CentreDefinition } from "@/config/types";

import { classes } from "./classes";
import { locations } from "./locations";
import { siteConfig } from "./site.config";
import { subjects } from "./subjects";
import { testimonials } from "./testimonials";
import { tutors } from "./tutors";

/**
 * The complete, still-unvalidated centre definition.
 * `src/lib/site.ts` runs it through the Zod schema exactly once at startup.
 */
const demoCentre: CentreDefinition = {
  ...siteConfig,
  subjects,
  classes,
  tutors,
  testimonials,
  locations,
};

export default demoCentre;
