import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type PillTone =
  | "neutral"
  | "brand"
  | "outline"
  | "success"
  | "warning"
  | "muted"
  | "inverse";

const tones: Record<PillTone, string> = {
  neutral: "bg-surface-muted text-ink-soft",
  brand: "bg-brand-soft text-brand",
  outline: "border border-line bg-surface text-ink-soft",
  success: "bg-[#eaf7f0] text-[#1a7a4c]",
  warning: "bg-[#fff4e5] text-[#a2611a]",
  muted: "bg-surface-muted text-ink-muted",
  inverse: "bg-white/10 text-white",
};

/**
 * The soft metadata chip used across cards: levels, days, modes, categories.
 */
export function Pill({
  children,
  tone = "neutral",
  size = "md",
  className,
  icon,
}: {
  children: ReactNode;
  tone?: PillTone;
  size?: "sm" | "md";
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-[0.8125rem]",
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
