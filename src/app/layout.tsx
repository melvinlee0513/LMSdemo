import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { CentreTheme } from "@/components/layout/CentreTheme";
import { ConversionLayer } from "@/components/layout/ConversionLayer";
import { DemoNotice } from "@/components/layout/DemoNotice";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { getFont } from "@/lib/fonts";
import { robotsFor } from "@/lib/seo";
import { absoluteUrl, getCentre, getSiteUrl, isDemo, isIndexable } from "@/lib/site";
import {
  organisationSchema,
  structuredDataEnabled,
  websiteSchema,
} from "@/lib/structured-data";

import "@/styles/globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const centre = getCentre();

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: centre.seo.defaultTitle,
      template: centre.seo.titleTemplate,
    },
    description: centre.seo.defaultDescription,
    applicationName: centre.identity.name,
    ...(centre.seo.keywords?.length ? { keywords: centre.seo.keywords } : {}),
    robots: robotsFor(),
    icons: {
      icon: centre.identity.favicon ?? "/favicon.ico",
      ...(centre.identity.appleIcon ? { apple: centre.identity.appleIcon } : {}),
    },
    openGraph: {
      type: "website",
      siteName: centre.identity.name,
      locale: centre.seo.locale,
      url: absoluteUrl("/"),
    },
    twitter: { card: "summary_large_image" },
    ...(isIndexable() && centre.seo.searchConsoleVerification
      ? { verification: { google: centre.seo.searchConsoleVerification } }
      : {}),
    // Demo deployments carry a machine-readable marker as well as the visible
    // notice, so a stray crawl is unambiguous.
    ...(isDemo() ? { other: { "x-site-mode": "demo" } } : {}),
  };
}

export function generateViewport(): Viewport {
  const centre = getCentre();

  return {
    themeColor: centre.branding.primary,
    colorScheme: "light",
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const centre = getCentre();
  const font = getFont(centre.branding.font);
  const withStructuredData = structuredDataEnabled();

  return (
    <html lang={centre.seo.language} className={font.className}>
      <body className="flex min-h-dvh flex-col bg-surface font-sans text-ink">
        <CentreTheme branding={centre.branding} />

        <a
          href="#main"
          className="sr-only rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-100"
        >
          Skip to main content
        </a>

        {isDemo() ? <DemoNotice centreName={centre.identity.name} /> : null}

        <SiteHeader />

        <main id="main" className="flex-1">
          {children}
        </main>

        <SiteFooter />
        <ConversionLayer />

        {withStructuredData ? (
          <>
            <JsonLd data={organisationSchema()} />
            <JsonLd data={websiteSchema()} />
          </>
        ) : null}
      </body>
    </html>
  );
}
