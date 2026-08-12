import type { MetadataRoute } from "next";

import {
  isLocationIndexable,
  isSubjectIndexable,
} from "@/lib/content";
import { absoluteUrl, getCentre, isIndexable } from "@/lib/site";

/**
 * Production sitemap.
 *
 * Contains only pages that are enabled, unique and indexable. Demo builds
 * return an empty sitemap — there is nothing a demo deployment should be
 * inviting a crawler to fetch.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexable()) return [];

  const centre = getCentre();
  const flags = centre.featureFlags;
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
  ];

  const add = (path: string, priority: number) => {
    entries.push({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency: "monthly",
      priority,
    });
  };

  if (flags.about) add("/about", 0.7);
  if (flags.subjects && centre.subjects.length > 0) add("/subjects", 0.9);
  if (flags.classes && centre.classes.length > 0) add("/classes", 0.9);
  if (flags.tutors && centre.tutors.length > 0) add("/tutors", 0.8);
  if (flags.timetable && centre.classes.length > 0) add("/timetable", 0.8);
  if (flags.testimonials && centre.testimonials.length > 0) add("/testimonials", 0.6);
  if (flags.locations && centre.locations.length > 0) add("/locations", 0.8);
  if (flags.trialRegistration) add("/trial", 0.9);
  if (flags.studentRegistration) add("/register", 0.8);
  add("/contact", 0.7);
  add("/privacy", 0.3);

  // Detail routes — only those carrying genuinely unique content. Thin pages
  // stay reachable for humans but never enter the sitemap.
  for (const subject of centre.subjects) {
    if (isSubjectIndexable(centre, subject)) add(`/subjects/${subject.slug}`, 0.8);
  }

  for (const klass of centre.classes) {
    if (flags.classDetailPages && klass.seoIndexable) add(`/classes/${klass.slug}`, 0.6);
  }

  for (const location of centre.locations) {
    if (isLocationIndexable(centre, location)) add(`/locations/${location.slug}`, 0.7);
  }

  return entries;
}
