import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/lib/icon-names";
import { cn } from "@/lib/utils";

/**
 * The rounded 40–52px icon container used throughout the design system.
 *
 *   primary  orange gradient + white icon
 *   soft     pale blush background + brand-coloured icon
 */
export function IconBox({
  name,
  tone = "soft",
  size = "md",
  className,
}: {
  name: IconName;
  tone?: "primary" | "soft" | "neutral" | "inverse";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-2xl",
        size === "sm" && "size-10",
        size === "md" && "size-12",
        size === "lg" && "size-13",
        tone === "primary" && "gradient-brand text-white shadow-brand",
        tone === "soft" && "bg-brand-soft text-brand",
        tone === "neutral" && "bg-surface-muted text-ink-soft",
        tone === "inverse" && "bg-white/10 text-white",
        className,
      )}
    >
      <Icon
        name={name}
        className={cn(
          size === "sm" && "size-[18px]",
          size === "md" && "size-5",
          size === "lg" && "size-6",
        )}
      />
    </span>
  );
}
