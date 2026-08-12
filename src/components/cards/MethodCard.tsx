import { IconBox } from "@/components/ui/IconBox";
import type { IconName } from "@/lib/icon-names";
import { cn } from "@/lib/utils";

export type MethodItem = {
  icon: IconName;
  title: string;
  description: string;
};

/**
 * A numbered teaching-method step. Used by both the `cards` and `timeline`
 * method variants so the two share one visual language.
 */
export function MethodCard({
  item,
  index,
  variant = "cards",
  className,
}: {
  item: MethodItem;
  index: number;
  variant?: "cards" | "timeline";
  className?: string;
}) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-4 rounded-3xl border p-6 transition-[transform,box-shadow,border-color] duration-200",
        variant === "cards"
          ? "border-line bg-surface shadow-soft hover:-translate-y-1 hover:border-line-warm hover:shadow-lift"
          : "border-line-warm bg-surface-warm",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <IconBox name={item.icon} tone="soft" size="md" />
        <span
          aria-hidden="true"
          className="text-2xl font-extrabold text-brand/15 tabular-nums"
        >
          {number}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-ink">{item.title}</h3>
        <p className="text-sm leading-relaxed text-ink-soft">{item.description}</p>
      </div>
    </article>
  );
}
