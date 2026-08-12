import localFont from "next/font/local";

import type { FontKey } from "@/config/constants";

/**
 * Fonts ship with the repository rather than being fetched from Google at
 * build time: the build stays reproducible and offline-capable, and the
 * browser makes no third-party request.
 *
 * Only the weights the design system actually uses are loaded (400–800),
 * latin subset only.
 */
const poppins = localFont({
  src: [
    { path: "../assets/fonts/poppins-latin-400.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/poppins-latin-500.woff2", weight: "500", style: "normal" },
    { path: "../assets/fonts/poppins-latin-600.woff2", weight: "600", style: "normal" },
    { path: "../assets/fonts/poppins-latin-700.woff2", weight: "700", style: "normal" },
    { path: "../assets/fonts/poppins-latin-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-poppins",
  display: "swap",
  fallback: [
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "Segoe UI",
    "Roboto",
    "sans-serif",
  ],
  preload: true,
});

/**
 * To offer another typeface to centres: load it here, add its key to
 * FONT_KEYS in `src/config/constants.ts`, and add an entry below.
 */
const registry = {
  poppins: { className: poppins.variable, cssVariable: "--font-poppins" },
} as const satisfies Record<FontKey, { className: string; cssVariable: string }>;

export function getFont(key: FontKey) {
  return registry[key];
}
