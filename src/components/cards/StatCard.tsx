import { IconBox } from "@/components/ui/IconBox";
import { RollingNumber } from "@/components/ui/RollingNumber";
import type { Stat } from "@/config/types";
import { cn } from "@/lib/utils";

/**
 * Large number, small label.
 *
 * Only ever renders figures the centre supplied — the stats array is empty by
 * default and the section hides itself. The number rolls into place like an
 * odometer the first time the strip is reached; see <RollingNumber /> for why
 * that is safe without JavaScript.
 */
export function StatCard({
  stat,
  variant = "cards",
  className,
  /** Stagger against sibling cards, in milliseconds. */
  delay = 0,
  animate = true,
}: {
  stat: Stat;
  variant?: "cards" | "inline";
  className?: string;
  delay?: number;
  animate?: boolean;
}) {
  const number = (
    <RollingNumber value={stat.value} delay={delay} animate={animate} />
  );

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-3.5", className)}>
        <IconBox name={stat.icon} tone="soft" size="md" />
        <div>
          <p className="text-2xl leading-tight font-extrabold text-ink">{number}</p>
          <p className="text-sm text-ink-soft">{stat.label}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group flex flex-col gap-3 rounded-3xl border border-line bg-surface p-5 shadow-soft sm:p-6",
        // A statistic is not a link, so the response stays deliberately below
        // the threshold that would read as "click me": the border warms and the
        // card settles up a couple of pixels. No shadow jump, no pointer.
        "transition-[transform,border-color] duration-[var(--motion-normal)] ease-[var(--ease-emphasized)] hover:-translate-y-0.5 hover:border-line-warm",
        className,
      )}
    >
      <IconBox
        name={stat.icon}
        tone="soft"
        size="md"
        className="transition-transform duration-[var(--motion-normal)] ease-[var(--ease-emphasized)] group-hover:scale-105"
      />
      <div>
        <p className="text-3xl leading-tight font-extrabold text-ink sm:text-4xl">
          {number}
        </p>
        <p className="mt-1 text-sm font-medium text-ink-soft">{stat.label}</p>
        {stat.hint ? <p className="mt-0.5 text-xs text-ink-muted">{stat.hint}</p> : null}
      </div>
    </div>
  );
}
