import "server-only";

import { centreRegistry, centreIds } from "@/centres";
import { parseCentre } from "@/config/centre.schema";
import type { Centre, SiteMode } from "@/config/types";

/**
 * ---------------------------------------------------------------------------
 * Site resolution
 * ---------------------------------------------------------------------------
 * One repository, many deployments. `SITE_ID` picks the centre, `SITE_MODE`
 * decides whether the deployment is a sales concept (never indexed, forms are
 * simulated) or a live production site.
 *
 * Everything in this module is server-only. Client components receive the
 * narrow slice of data they need as props — the full configuration object is
 * never shipped to the browser.
 */

const DEFAULT_SITE_ID = "demo-centre";
const DEFAULT_SITE_URL = "http://localhost:3000";

function resolveSiteId(): string {
  const id = process.env.SITE_ID?.trim() || DEFAULT_SITE_ID;

  if (!(id in centreRegistry)) {
    throw new Error(
      `Unknown SITE_ID "${id}".\n` +
        `Known centres: ${centreIds.join(", ")}.\n` +
        `Add the centre under src/centres/<id>/ and register it in src/centres/index.ts.`,
    );
  }

  return id;
}

function resolveMode(): SiteMode {
  // Anything that is not an explicit "production" is treated as a demo.
  // This is deliberate: a typo must never accidentally publish a prospect's
  // concept site to Google.
  return process.env.SITE_MODE?.trim() === "production" ? "production" : "demo";
}

function resolveSiteUrl(mode: SiteMode): string {
  const raw = process.env.SITE_URL?.trim() || DEFAULT_SITE_URL;
  const withoutTrailingSlash = raw.replace(/\/+$/, "");

  let parsed: URL;
  try {
    parsed = new URL(withoutTrailingSlash);
  } catch {
    throw new Error(
      `SITE_URL ("${raw}") is not a valid absolute URL. ` +
        `Use something like https://centre-name.com (no trailing slash).`,
    );
  }

  if (mode === "production") {
    if (parsed.protocol !== "https:") {
      throw new Error(
        `SITE_MODE=production requires an https:// SITE_URL. Received "${raw}".`,
      );
    }
    if (/^(localhost|127\.0\.0\.1)$/.test(parsed.hostname)) {
      throw new Error(
        `SITE_MODE=production cannot use a localhost SITE_URL ("${raw}"). ` +
          `Canonical URLs would point at nothing.`,
      );
    }
  }

  return withoutTrailingSlash;
}

const siteId = resolveSiteId();
const siteMode = resolveMode();
const siteUrl = resolveSiteUrl(siteMode);

// Parsed once per process. A malformed centre configuration fails the build
// with a precise message rather than rendering `undefined` into a CTA.
const centre: Centre = parseCentre(
  siteId,
  centreRegistry[siteId as keyof typeof centreRegistry],
);

export function getCentre(): Centre {
  return centre;
}

export function getSiteId(): string {
  return siteId;
}

export function getSiteMode(): SiteMode {
  return siteMode;
}

export function isDemo(): boolean {
  return siteMode === "demo";
}

export function getSiteUrl(): string {
  return siteUrl;
}

/**
 * The single gate for search-engine indexing.
 * Demo deployments are never indexable, regardless of centre configuration.
 */
export function isIndexable(): boolean {
  return siteMode === "production";
}

/** Builds an absolute URL for canonicals, Open Graph and structured data. */
export function absoluteUrl(path = "/"): string {
  const normalised = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalised === "/" ? "" : normalised}`;
}
