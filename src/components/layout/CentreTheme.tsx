import type { Branding } from "@/config/types";
import { getFont } from "@/lib/fonts";

/**
 * Turns a centre's `branding` block into the CSS custom properties the whole
 * design system reads from.
 *
 * This is the entire theming mechanism: no component imports a brand colour,
 * so a new centre is re-skinned by configuration alone. Rendered once in the
 * document head, before any content paints.
 */
export function CentreTheme({ branding }: { branding: Branding }) {
  const font = getFont(branding.font);

  // `:root:root` rather than `:root` so the centre override always beats the
  // engine defaults in globals.css on specificity, whatever order the
  // stylesheets happen to land in.
  const css = `:root:root{
--brand-primary:${branding.primary};
--brand-secondary:${branding.secondary};
--brand-soft:${branding.soft};
--brand-soft-2:${branding.soft2};
--brand-gradient-angle:${branding.gradientAngle}deg;
--text-primary:${branding.textPrimary};
--text-secondary:${branding.textSecondary};
--text-muted:${branding.textMuted};
--surface:${branding.surface};
--surface-warm:${branding.surfaceWarm};
--surface-muted:${branding.surfaceMuted};
--border:${branding.border};
--border-warm:${branding.borderWarm};
--footer:${branding.footer};
--font-brand:var(${font.cssVariable});
}`;

  // Values are hex colours and a number, both validated by the Zod schema
  // before they can reach this component. `precedence` lets React hoist the
  // block into <head> so the theme is in place before first paint.
  return (
    <style
      precedence="high"
      href="centre-theme"
      dangerouslySetInnerHTML={{ __html: css }}
    />
  );
}
