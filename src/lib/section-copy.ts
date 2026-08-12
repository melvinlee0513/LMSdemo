import type { Centre } from "@/config/types";

export type SectionCopy = {
  eyebrow?: string;
  heading: string;
  highlight?: string;
  description?: string;
};

/**
 * Resolves section headings: engine defaults, overridden field-by-field by
 * anything the centre wrote in `sectionCopy`.
 *
 * This is why adding a centre rarely means touching a component — the copy
 * that differs between centres is configuration, and the layout is not.
 */
export function sectionCopy(
  centre: Centre,
  key: string,
  defaults: SectionCopy,
): SectionCopy {
  const override = centre.sectionCopy?.[key];
  if (!override) return defaults;

  return {
    eyebrow: override.eyebrow ?? defaults.eyebrow,
    heading: override.heading ?? defaults.heading,
    highlight: override.heading ? override.highlight : (override.highlight ?? defaults.highlight),
    description: override.description ?? defaults.description,
  };
}
