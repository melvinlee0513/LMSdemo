import type { Metadata } from "next";

import { sectionRegistry } from "@/components/sections/registry";
import { buildMetadata } from "@/lib/seo";
import { getCentre } from "@/lib/site";

export function generateMetadata(): Metadata {
  const centre = getCentre();

  return {
    ...buildMetadata({
      title: centre.seo.defaultTitle,
      description: centre.seo.defaultDescription,
      path: "/",
    }),
    // The home page uses the configured title verbatim rather than running it
    // through the "%s | Centre" template, which would repeat the centre name.
    title: { absolute: centre.seo.defaultTitle },
  };
}

/**
 * The homepage is composed from `homepageSections`, not hardcoded here.
 * Reordering or removing a section for a centre is a configuration change.
 */
export default function HomePage() {
  const centre = getCentre();

  return (
    <>
      {centre.homepageSections.map((key) => {
        const SectionComponent = sectionRegistry[key];
        return <SectionComponent key={key} centre={centre} />;
      })}
    </>
  );
}
