import type { Centre, HighlightAnimation } from "@/config/types";

export type SectionCopy = {
  eyebrow?: string;
  heading: string;
  highlight?: string;
  description?: string;
  /**
   * Whether the highlighted fragment drops in. Engine defaults keep this to a
   * small number of sections; a centre can turn it on or off per section.
   * The global `motion.animatedHighlights` switch overrides everything.
   */
  highlightAnimation?: HighlightAnimation;
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
    // A centre that rewrites the heading must also say which fragment to
    // highlight — the engine's default fragment will not appear in new copy.
    highlight: override.heading ? override.highlight : (override.highlight ?? defaults.highlight),
    description: override.description ?? defaults.description,
    highlightAnimation: override.highlightAnimation ?? defaults.highlightAnimation,
  };
}
