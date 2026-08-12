import type { MetadataRoute } from "next";

import { absoluteUrl, isIndexable } from "@/lib/site";

/**
 * Demo deployments disallow everything.
 *
 * robots.txt alone never removes a page from an index, so this works together
 * with page-level `noindex, nofollow` metadata and the `X-Robots-Tag` response
 * header set in next.config.ts. All three are driven by the same
 * `SITE_MODE=production` gate.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable()) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
