import { StatCard } from "@/components/cards/StatCard";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import type { Centre } from "@/config/types";
import { cn } from "@/lib/utils";

/**
 * Trust statistics. Renders nothing at all when a centre has supplied no
 * figures — an empty stats strip is worse than no stats strip, and inventing
 * numbers on a centre's behalf is not an option.
 */
export function StatsSection({ centre }: { centre: Centre }) {
  if (centre.stats.length === 0) return null;

  const variant = centre.componentVariants.stats;

  return (
    <Section tone="surface" spacing="compact" ariaLabel="Centre at a glance">
      <div
        className={cn(
          "grid gap-4",
          variant === "cards"
            ? "grid-cols-2 lg:grid-cols-4"
            : "grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4",
        )}
      >
        {centre.stats.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 60}>
            <StatCard stat={stat} variant={variant} className="h-full" />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
