"use client";

import { ChevronDown } from "lucide-react";
import { useId } from "react";

import { cn } from "@/lib/utils";

/**
 * A native <select> in the design system's clothing.
 *
 * Native is deliberate: it gets the platform picker on mobile, full keyboard
 * support and screen-reader semantics for free, and costs no JavaScript.
 */
export function FilterSelect({
  label,
  value,
  options,
  onChange,
  className,
  hideLabel = false,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  className?: string;
  hideLabel?: boolean;
}) {
  const id = useId();

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <label
        htmlFor={id}
        className={cn(
          "text-xs font-semibold tracking-wide text-ink-muted uppercase",
          hideLabel && "sr-only",
        )}
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            "h-11 w-full appearance-none rounded-full border border-line bg-surface pr-10 pl-4",
            "text-sm font-semibold text-ink transition-colors duration-200",
            "hover:border-line-warm focus:border-brand focus:outline-none",
          )}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-ink-muted"
        />
      </div>
    </div>
  );
}
