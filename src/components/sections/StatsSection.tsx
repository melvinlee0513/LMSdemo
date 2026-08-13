import { StatCard } from "@/components/cards/StatCard";
import { InView } from "@/components/ui/InView";
import { Section } from "@/components/ui/Section";
import type { Centre } from "@/config/types";
import { MOTION } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Trust statistics.
 *
 * Renders nothing at all when a centre has supplied no figures — an empty
 * stats strip is worse than no stats strip, and inventing numbers on a
 * centre's behalf is not an option.
 *
 * One <InView /> wraps the whole strip so a single observer starts every
 * odometer, staggered left to right, exactly once per page load.
 */
export function StatsSection({ centre }: { centre: Centre }) {
  if (centre.stats.length === 0) return null;

  const variant = centre.componentVariants.stats;
  const rolling = centre.motion.rollingStats;

  return (
    <Section tone="surface" spacing="compact" ariaLabel="Centre at a glance">
      <InView
        amount={0.35}
        className={cn(
          "grid gap-4",
          variant === "cards"
            ? "grid-cols-2 lg:grid-cols-4"
            : "grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4",
        )}
      >
        {centre.stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            stat={stat}
            variant={variant}
            className="h-full"
            animate={rolling}
            delay={index * MOTION.stagger.stats}
          />
        ))}
      </InView>
    </Section>
  );
}
