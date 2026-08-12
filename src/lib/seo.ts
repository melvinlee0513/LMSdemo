import "server-only";

import type { Metadata } from "next";

import type { Centre, CentreLocation, Subject, TuitionClass } from "@/config/types";
import { absoluteUrl, getCentre, isIndexable } from "@/lib/site";
import { truncate } from "@/lib/utils";

/**
 * ---------------------------------------------------------------------------
 * SEO engine
 * ---------------------------------------------------------------------------
 * One place builds metadata for every route, so titles, canonicals, Open
 * Graph and robots directives cannot drift apart between pages.
 *
 * The indexing decision has exactly one source of truth: `isIndexable()`,
 * which is false for every demo deployment regardless of what a centre
 * configuration says.
 */

export type PageMetadataOptions = {
  /** Page title WITHOUT the centre suffix — the template adds it. */
  title: string;
  description: string;
  /** Route path, e.g. "/subjects/physics". */
  path: string;
  /** Set for pages that exist for humans but must not be indexed. */
  noindex?: boolean;
  keywords?: string[];
  type?: "website" | "article";
};

const NO_INDEX = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
  },
} as const;

const INDEX = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
} as const;

export function robotsFor(noindex = false): Metadata["robots"] {
  return !isIndexable() || noindex ? NO_INDEX : INDEX;
}

export function buildMetadata(options: PageMetadataOptions): Metadata {
  const centre = getCentre();
  const indexable = isIndexable() && !options.noindex;
  const url = absoluteUrl(options.path);

  return {
    title: options.title,
    description: truncate(options.description, 200),
    ...(options.keywords?.length ? { keywords: options.keywords } : {}),
    // Canonicals are only meaningful on a production domain. A demo build
    // must never publish a canonical pointing at a prospect's real site, nor
    // one pointing at the throwaway preview URL.
    ...(indexable ? { alternates: { canonical: url } } : {}),
    robots: robotsFor(options.noindex),
    openGraph: {
      type: options.type ?? "website",
      url,
      siteName: centre.identity.name,
      title: applyTitleTemplate(centre, options.title),
      description: truncate(options.description, 200),
      locale: centre.seo.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: applyTitleTemplate(centre, options.title),
      description: truncate(options.description, 200),
    },
  };
}

export function applyTitleTemplate(centre: Centre, title: string): string {
  return centre.seo.titleTemplate.replace("%s", title);
}

/* -------------------------------------------------------------------------- */
/* Title builders                                                             */
/* -------------------------------------------------------------------------- */

/**
 * A city is only ever inserted when the centre actually configured one.
 * Never fabricate a location to chase a local keyword.
 */
function inCity(centre: Centre, prefix = "in"): string {
  return centre.identity.city ? ` ${prefix} ${centre.identity.city}` : "";
}

export function subjectPageTitle(centre: Centre, subject: Subject): string {
  return `${subject.name} Tuition${inCity(centre)}`;
}

export function classPageTitle(_centre: Centre, klass: TuitionClass): string {
  return `${klass.title} — Weekly Class`;
}

export function locationPageTitle(
  centre: Centre,
  location: CentreLocation,
): string {
  const area = location.city || centre.identity.city;
  return area
    ? `${location.name} Tuition Centre in ${area}`
    : `${location.name} Branch`;
}

/* -------------------------------------------------------------------------- */
/* Description builders                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Descriptions are generated from real configured content, never templated
 * keyword strings. If a centre wrote its own override in `seo.pages`, that
 * always wins.
 */
export function pageDescription(routeKey: string, fallback: string): string {
  const centre = getCentre();
  return centre.seo.pages?.[routeKey]?.description ?? fallback;
}

export function pageTitleOverride(
  routeKey: string,
  fallback: string,
): string {
  const centre = getCentre();
  return centre.seo.pages?.[routeKey]?.title ?? fallback;
}
