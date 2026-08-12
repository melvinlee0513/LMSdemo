import type { ComponentType } from "react";

import { ClassesSection } from "@/components/sections/ClassesSection";
import { FinalCtaSection, TrialCtaSection } from "@/components/sections/CtaSection";
import { Hero } from "@/components/sections/Hero";
import { LocationsSection } from "@/components/sections/LocationsSection";
import { MethodsSection } from "@/components/sections/MethodsSection";
import { ParentLeadSection } from "@/components/sections/ParentLeadSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { SubjectsSection } from "@/components/sections/SubjectsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { TimetablePreviewSection } from "@/components/sections/TimetablePreviewSection";
import { TutorsSection } from "@/components/sections/TutorsSection";
import type { HomepageSection } from "@/config/constants";
import type { Centre } from "@/config/types";

export type SectionComponent = ComponentType<{ centre: Centre }>;

/**
 * ---------------------------------------------------------------------------
 * Homepage section registry
 * ---------------------------------------------------------------------------
 * The homepage is assembled by looking up `homepageSections` in this map, so
 * a centre reorders (or drops) sections purely through configuration. Nothing
 * about the page order is hardcoded in `app/page.tsx`.
 *
 * Every section is responsible for rendering nothing when its own feature
 * flag is off or its data is empty, which keeps the composition honest.
 */
export const sectionRegistry: Record<HomepageSection, SectionComponent> = {
  hero: ({ centre }) => (
    <Hero hero={centre.hero} variant={centre.componentVariants.hero} />
  ),
  stats: StatsSection,
  subjects: SubjectsSection,
  methods: MethodsSection,
  classes: ClassesSection,
  tutors: TutorsSection,
  timetable: TimetablePreviewSection,
  testimonials: TestimonialsSection,
  locations: LocationsSection,
  parentLead: ParentLeadSection,
  trialCta: TrialCtaSection,
  finalCta: FinalCtaSection,
};
