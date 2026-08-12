import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { getCentre } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const centre = getCentre();

export const alt = `${centre.identity.name}${
  centre.identity.tagline ? ` — ${centre.identity.tagline}` : ""
}`;

/**
 * Branded fallback Open Graph artwork, generated once at build time from the
 * centre's own name, positioning and gradient.
 *
 * Deliberately small in scope: a centre that supplies real artwork sets
 * `seo.defaultOgImage` and this is never used. It exists so that a new centre
 * never ships a blank social preview.
 */
export default async function OpengraphImage() {
  const [bold, semibold] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/fonts/poppins-700.ttf")),
    readFile(join(process.cwd(), "src/assets/fonts/poppins-600.ttf")),
  ]);

  const { identity, branding, seo } = centre;
  const initials = identity.name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: branding.surface,
          backgroundImage: `linear-gradient(${branding.gradientAngle}deg, ${branding.primary}, ${branding.secondary})`,
          fontFamily: "Poppins",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 24,
              backgroundColor: "rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            {initials}
          </div>
          <span style={{ color: "#ffffff", fontSize: 30, fontWeight: 600 }}>
            {identity.name}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            backgroundColor: branding.surface,
            borderRadius: 32,
            padding: "44px 48px",
          }}
        >
          <span
            style={{
              color: branding.textPrimary,
              fontSize: 58,
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            {identity.tagline ?? seo.defaultTitle}
          </span>
          <span style={{ color: branding.textSecondary, fontSize: 27, fontWeight: 600 }}>
            {[identity.city, identity.state].filter(Boolean).join(", ") ||
              identity.country}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Poppins", data: bold, weight: 700, style: "normal" },
        { name: "Poppins", data: semibold, weight: 600, style: "normal" },
      ],
    },
  );
}
