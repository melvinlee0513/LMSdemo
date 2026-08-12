import { IconBox } from "@/components/ui/IconBox";
import type { IconName } from "@/lib/icon-names";
import { cn } from "@/lib/utils";

/**
 * Generic "value" / "feature" tile — used for the About page value grid and
 * anywhere a short icon + title + description block is needed.
 */
export function FeatureCard({
  icon,
  title,
  description,
  tone = "surface",
  className,
}: {
  icon: IconName;
  title: string;
  description: string;
  tone?: "surface" | "warm";
  className?: string;
}) {
  return (
    <article
      className={cn(
        "flex flex-col gap-3.5 rounded-3xl border p-5 shadow-soft transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lift sm:p-6",
        tone === "surface" ? "border-line bg-surface" : "border-line-warm bg-surface-warm",
        className,
      )}
    >
      <IconBox name={icon} tone="soft" size="md" />
      <h3 className="text-base font-bold text-ink sm:text-lg">{title}</h3>
      <p className="text-sm leading-relaxed text-ink-soft">{description}</p>
    </article>
  );
}
