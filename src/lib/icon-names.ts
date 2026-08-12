/**
 * The curated icon vocabulary available to centre configurations.
 *
 * Keeping this as a plain string list (no React imports) lets the Zod schema
 * validate icon names at config-load time without pulling the icon components
 * into every module that touches configuration.
 *
 * To add an icon: add its key here AND map it in `src/components/ui/Icon.tsx`.
 */
export const ICON_NAMES = [
  "atom",
  "award",
  "beaker",
  "bookOpen",
  "bookMarked",
  "brain",
  "briefcase",
  "building",
  "calculator",
  "calendarDays",
  "checkCircle",
  "clipboardCheck",
  "clock",
  "compass",
  "flaskConical",
  "globe",
  "graduationCap",
  "handshake",
  "heart",
  "highlighter",
  "languages",
  "laptop",
  "library",
  "lightbulb",
  "lineChart",
  "mapPin",
  "medal",
  "messageCircle",
  "microscope",
  "notebookPen",
  "penTool",
  "phone",
  "presentation",
  "puzzle",
  "ruler",
  "scrollText",
  "sigma",
  "sparkles",
  "star",
  "target",
  "timer",
  "trendingUp",
  "trophy",
  "userCheck",
  "users",
  "video",
  "zap",
] as const;

export type IconName = (typeof ICON_NAMES)[number];

export function isIconName(value: string): value is IconName {
  return (ICON_NAMES as readonly string[]).includes(value);
}
