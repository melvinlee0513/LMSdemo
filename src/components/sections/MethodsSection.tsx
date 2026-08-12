import { MethodCard } from "@/components/cards/MethodCard";
import { IconBox } from "@/components/ui/IconBox";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Centre } from "@/config/types";
import { cn } from "@/lib/utils";

/**
 * "How we teach" / why-us section.
 *
 *   cards     responsive card grid
 *   timeline  numbered vertical progression; alternating around a centre rule
 *             on large screens, a simple left-aligned list on phones
 */
export function MethodsSection({ centre }: { centre: Centre }) {
  const methods = centre.methods;
  if (!methods) return null;

  const variant = centre.componentVariants.methods;

  return (
    <Section tone="surface" ariaLabelledBy="methods-heading">
      <SectionHeader
        eyebrow={methods.eyebrow}
        heading={methods.heading}
        highlight={methods.highlight}
        description={methods.description}
        headingId="methods-heading"
      />

      {variant === "timeline" ? (
        <MethodTimeline items={methods.items} />
      ) : (
        <div
          className={cn(
            "mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2",
            methods.items.length % 3 === 0 ? "lg:grid-cols-3" : "lg:grid-cols-4",
          )}
        >
          {methods.items.map((item, index) => (
            <Reveal key={item.title} delay={index * 70}>
              <MethodCard item={item} index={index} className="h-full" />
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  );
}

function MethodTimeline({ items }: { items: NonNullable<Centre["methods"]>["items"] }) {
  return (
    <ol className="relative mt-10 flex flex-col gap-8 sm:mt-12 lg:gap-12">
      {/* The connecting rule: left-aligned on phones, centred on desktop. */}
      <span
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-6 w-px bg-line lg:left-1/2 lg:-translate-x-1/2"
      />

      {items.map((item, index) => (
        <li
          key={item.title}
          className={cn(
            "relative pl-16 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:pl-0",
          )}
        >
          <span
            aria-hidden="true"
            className="gradient-brand absolute top-0 left-0 inline-flex size-12 items-center justify-center rounded-2xl text-sm font-extrabold text-white shadow-brand lg:left-1/2 lg:-translate-x-1/2"
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          <div
            className={cn(
              "flex flex-col gap-3 lg:max-w-md",
              index % 2 === 0
                ? "lg:col-start-1 lg:items-end lg:pr-14 lg:text-right"
                : "lg:col-start-2 lg:pl-14",
            )}
          >
            <IconBox name={item.icon} tone="soft" size="md" />
            <h3 className="text-lg font-bold text-ink">{item.title}</h3>
            <p className="text-sm leading-relaxed text-ink-soft">{item.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
