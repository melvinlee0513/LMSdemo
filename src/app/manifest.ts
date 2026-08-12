import type { MetadataRoute } from "next";

import { getCentre } from "@/lib/site";

/**
 * Per-centre web app manifest. Name, icons and theme colour all come from the
 * active centre, so no deployment ever ships another centre's branding.
 */
export default function manifest(): MetadataRoute.Manifest {
  const centre = getCentre();

  return {
    name: centre.identity.name,
    short_name: centre.identity.shortName ?? centre.identity.name,
    description: centre.identity.description,
    start_url: "/",
    display: "standalone",
    background_color: centre.branding.surface,
    theme_color: centre.branding.primary,
    icons: [
      ...(centre.identity.favicon
        ? [
            {
              src: centre.identity.favicon,
              sizes: "any",
              type: centre.identity.favicon.endsWith(".svg")
                ? "image/svg+xml"
                : "image/png",
            },
          ]
        : []),
      ...(centre.identity.appleIcon
        ? [{ src: centre.identity.appleIcon, sizes: "180x180", type: "image/png" }]
        : []),
    ],
  };
}
