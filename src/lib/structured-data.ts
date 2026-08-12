import "server-only";

import { DAY_LABELS } from "@/config/constants";
import type { Centre, CentreLocation, OpeningHours } from "@/config/types";
import { primaryLocation } from "@/lib/content";
import { absoluteUrl, getCentre, isIndexable } from "@/lib/site";

/**
 * ---------------------------------------------------------------------------
 * Structured data
 * ---------------------------------------------------------------------------
 * Rules this module enforces:
 *
 *   1. Only truthful, configured data is emitted. Every field is conditional —
 *      a centre that has not supplied a phone number gets no `telephone`.
 *   2. Nothing is marked up that is not visible on the page.
 *   3. No reviews, aggregate ratings, prices or awards are ever generated.
 *   4. Demo deployments emit no structured data at all. There is nothing to
 *      gain from it, and a prospect's concept site must not leak into any
 *      knowledge graph.
 */

type JsonLd = Record<string, unknown>;

/** Returns null in demo mode so callers can skip rendering entirely. */
export function structuredDataEnabled(): boolean {
  return isIndexable();
}

function socialProfiles(centre: Centre): string[] {
  return Object.values(centre.social).filter(
    (value): value is string => typeof value === "string" && value.length > 0,
  );
}

function postalAddress(location: CentreLocation): JsonLd {
  return {
    "@type": "PostalAddress",
    streetAddress: location.addressLines.join(", "),
    addressLocality: location.city,
    addressRegion: location.state,
    postalCode: location.postcode,
    addressCountry: location.country,
  };
}

function openingHoursSpecification(hours: OpeningHours[] | undefined) {
  if (!hours) return undefined;

  const specs = hours
    .filter((entry) => entry.days && entry.opens && entry.closes)
    .map((entry) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: entry.days!.map((day) => DAY_LABELS[day].long),
      opens: entry.opens,
      closes: entry.closes,
    }));

  return specs.length > 0 ? specs : undefined;
}

function compact(object: JsonLd): JsonLd {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined),
  );
}

/* -------------------------------------------------------------------------- */

export function organisationSchema(): JsonLd {
  const centre = getCentre();
  const branch = primaryLocation(centre);
  const social = socialProfiles(centre);

  return compact({
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${absoluteUrl("/")}#organisation`,
    name: centre.identity.name,
    legalName: centre.identity.legalName,
    alternateName: centre.identity.shortName,
    description: centre.identity.description,
    url: absoluteUrl("/"),
    logo: absoluteUrl(centre.identity.logo),
    telephone: centre.contact.phone,
    email: centre.contact.email,
    foundingDate: centre.identity.establishedYear
      ? String(centre.identity.establishedYear)
      : undefined,
    address: branch ? postalAddress(branch) : undefined,
    areaServed: centre.identity.city,
    sameAs: social.length > 0 ? social : undefined,
  });
}

export function websiteSchema(): JsonLd {
  const centre = getCentre();

  return compact({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${absoluteUrl("/")}#website`,
    name: centre.identity.name,
    url: absoluteUrl("/"),
    description: centre.seo.defaultDescription,
    inLanguage: centre.seo.language,
    publisher: { "@id": `${absoluteUrl("/")}#organisation` },
  });
}

/**
 * Emitted only for branches with a real street address. Geo coordinates and
 * opening hours appear only when the centre supplied them.
 */
export function localBusinessSchema(location: CentreLocation): JsonLd {
  const centre = getCentre();

  return compact({
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "EducationalOrganization"],
    "@id": `${absoluteUrl(`/locations/${location.slug}`)}#branch`,
    name: `${centre.identity.name} — ${location.name}`,
    parentOrganization: { "@id": `${absoluteUrl("/")}#organisation` },
    url: absoluteUrl(`/locations/${location.slug}`),
    image: location.image ? absoluteUrl(location.image.src) : undefined,
    address: postalAddress(location),
    telephone: location.phone ?? centre.contact.phone,
    email: location.email ?? centre.contact.email,
    geo:
      location.latitude !== undefined && location.longitude !== undefined
        ? {
            "@type": "GeoCoordinates",
            latitude: location.latitude,
            longitude: location.longitude,
          }
        : undefined,
    openingHoursSpecification: openingHoursSpecification(location.hours),
    hasMap: location.mapUrl,
  });
}

export function breadcrumbSchema(
  items: { name: string; path: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/**
 * Only call this from a page that actually renders the same questions and
 * answers to the visitor.
 */
export function faqSchema(
  faqs: { question: string; answer: string }[],
): JsonLd | null {
  if (faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
