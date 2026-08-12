import { IconBox } from "@/components/ui/IconBox";
import type { Stat } from "@/config/types";
import { cn } from "@/lib/utils";

/**
 * Large number, small label. Only ever renders figures the centre supplied —
 * the stats array is empty by default and the section hides itself.
 */
export function StatCard({
  stat,
  variant = "cards",
  className,
}: {
  stat: Stat;
  variant?: "cards" | "inline";
  className?: string;
}) {
  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-3.5", className)}>
        <IconBox name={stat.icon} tone="soft" size="md" />
        <div>
          <p className="text-2xl leading-tight font-extrabold text-ink">{stat.value}</p>
          <p className="text-sm text-ink-soft">{stat.label}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-3xl border border-line bg-surface p-5 shadow-soft sm:p-6",
        className,
      )}
    >
      <IconBox name={stat.icon} tone="soft" size="md" />
      <div>
        <p className="text-3xl leading-tight font-extrabold text-ink sm:text-4xl">
          {stat.value}
        </p>
        <p className="mt-1 text-sm font-medium text-ink-soft">{stat.label}</p>
        {stat.hint ? <p className="mt-0.5 text-xs text-ink-muted">{stat.hint}</p> : null}
      </div>
    </div>
  );
}
