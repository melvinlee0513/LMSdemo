import type { Branding, MotionConfig } from "@/config/types";
import { getFont } from "@/lib/fonts";

/**
 * Turns a centre's `branding` and `motion` blocks into the CSS custom
 * properties the whole design system reads from.
 *
 * This is the entire theming mechanism: no component imports a brand colour,
 * and no component checks a motion flag to decide whether to animate. Ambient
 * and entrance effects reference `--anim-*` animation-name variables, so
 * setting one to `none` here switches that effect off everywhere at once —
 * no prop drilling, no conditional class names.
 *
 * Rendered into <head> so the theme is in place before first paint.
 */
export function CentreTheme({
  branding,
  motion,
}: {
  branding: Branding;
  motion: MotionConfig;
}) {
  const font = getFont(branding.font);
  const off = (enabled: boolean, name: string) => (enabled ? name : "none");

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
--anim-drop:${off(motion.animatedHighlights, "drop-in")};
--anim-float:${off(motion.floatingHeroPills, "float-soft")};
--anim-breathe:${off(motion.breathingEyebrows, "breathe")};
--anim-dot:${off(motion.breathingEyebrows, "dot-pulse")};
}`;

  // Values are hex colours, a number and fixed keywords, all validated by the
  // Zod schema before they can reach this component.
  return (
    <style
      precedence="high"
      href="centre-theme"
      dangerouslySetInnerHTML={{ __html: css }}
    />
  );
}
