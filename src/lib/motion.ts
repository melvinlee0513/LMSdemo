/**
 * ---------------------------------------------------------------------------
 * Motion tokens
 * ---------------------------------------------------------------------------
 * The TypeScript half of the motion system. The CSS half lives in
 * `src/styles/globals.css` as custom properties with the same names and
 * values; these constants exist for the few places a duration or a stagger
 * step has to be computed in JavaScript (inline `animation-delay`, observer
 * timing) rather than written in a stylesheet.
 *
 * Three categories, kept conceptually separate so the interface never turns
 * into an amusement park:
 *
 *   ambient      continuous and subtle — floating hero pills, breathing
 *                eyebrow labels. Never demands attention.
 *   entrance     plays once as content arrives — drop typography, rolling
 *                statistics, section reveals.
 *   interaction  responds to input — button press, card hover, day switch,
 *                filter selection.
 *
 * Rule of thumb enforced across the codebase: at any scroll position there is
 * at most one *entrance* animation running, plus ambient motion.
 */

export const MOTION = {
  /** Feedback the finger or cursor should feel immediately. */
  fast: 160,
  /** State changes: filters, tabs, hover, day switches. */
  normal: 260,
  /** Content entering the viewport. */
  reveal: 520,
  /** The few deliberate moments — headline typography, odometers. */
  dramatic: 640,

  /** Stagger steps. Small enough that the last item is never a wait. */
  stagger: {
    /** Between cards in a group. */
    cards: 70,
    /** Between words in an animated headline. */
    words: 55,
    /** Between statistic columns. */
    stats: 90,
  },

  easing: {
    standard: "cubic-bezier(0.4, 0, 0.2, 1)",
    emphasized: "cubic-bezier(0.22, 1, 0.36, 1)",
    soft: "cubic-bezier(0.33, 0, 0.15, 1)",
  },
} as const;

/**
 * Ambient float presets for the hero micro-pills. Each pill takes a different
 * duration, delay and direction — synchronised floating reads as mechanical.
 */
const FLOAT_PRESETS = [
  { duration: "5.2s", delay: "0s", direction: 1 },
  { duration: "6.4s", delay: "-1.9s", direction: -1 },
  { duration: "5.7s", delay: "-3.2s", direction: 1 },
] as const;

/**
 * Per-pill float variation. Amplitude itself stays in CSS so it can shrink on
 * small screens; only the tempo and direction are set per element.
 */
export function floatStyle(index: number): Record<string, string> {
  const preset = FLOAT_PRESETS[index % FLOAT_PRESETS.length]!;

  return {
    "--float-duration": preset.duration,
    "--float-delay": preset.delay,
    "--float-dir": String(preset.direction),
  };
}
