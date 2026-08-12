import type { ReactNode } from "react";

import { IconBox } from "@/components/ui/IconBox";
import type { IconName } from "@/lib/icon-names";
import { cn } from "@/lib/utils";

/**
 * Shown when a page is enabled but a filter combination (or the centre's
 * current data) produces nothing. Always offers a way forward.
 */
export function EmptyState({
  icon = "compass",
  title,
  description,
  action,
  className,
}: {
  icon?: IconName;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 rounded-3xl border border-dashed border-line bg-surface-warm px-6 py-14 text-center",
        className,
      )}
    >
      <IconBox name={icon} tone="soft" size="lg" />
      <div className="flex max-w-md flex-col gap-2">
        <p className="text-lg font-semibold text-ink">{title}</p>
        {description ? (
          <p className="text-sm leading-relaxed text-ink-soft">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
