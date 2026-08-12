"use client";

import { cn } from "@/lib/utils";

/**
 * The compact filter chip used on the subjects, classes and timetable pages.
 *
 * Rendered as a real <button> inside a group with `role="group"`, so keyboard
 * users tab through them and screen readers get the pressed state from
 * `aria-pressed` rather than from colour.
 */
export function FilterPill({
  label,
  count,
  selected,
  onSelect,
  className,
}: {
  label: string;
  count?: number;
  selected: boolean;
  onSelect: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold",
        "transition-[background-color,color,border-color,box-shadow] duration-200",
        selected
          ? "gradient-brand text-white shadow-brand"
          : "border border-line bg-surface text-ink-soft hover:border-line-warm hover:bg-brand-soft hover:text-brand",
        className,
      )}
    >
      {label}
      {typeof count === "number" ? (
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[0.6875rem] font-semibold tabular-nums",
            selected ? "bg-white/20 text-white" : "bg-surface-muted text-ink-muted",
          )}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}

export function FilterGroup({
  label,
  children,
  scroll = false,
  className,
}: {
  label: string;
  children: React.ReactNode;
  /** Horizontal rail on small screens instead of wrapping to many rows. */
  scroll?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <span className="text-xs font-semibold tracking-wide text-ink-muted uppercase">
        {label}
      </span>
      <div
        role="group"
        aria-label={label}
        className={cn(
          "flex gap-2",
          scroll
            ? "no-scrollbar -mx-5 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
            : "flex-wrap",
        )}
      >
        {children}
      </div>
    </div>
  );
}
