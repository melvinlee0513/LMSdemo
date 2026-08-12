import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Star ratings are only rendered when a centre has actually supplied a value.
 * The numeric rating is always present in the accessible name so the meaning
 * is never carried by the stars alone.
 */
export function Rating({
  value,
  max = 5,
  label,
  size = "md",
  showValue = true,
  className,
}: {
  value: number;
  max?: number;
  label?: string;
  size?: "sm" | "md";
  showValue?: boolean;
  className?: string;
}) {
  const rounded = Math.round(value);
  const starSize = size === "sm" ? "size-3.5" : "size-4";

  return (
    <span
      className={cn("inline-flex items-center gap-2", className)}
      role="img"
      aria-label={label ?? `Rated ${value} out of ${max}`}
    >
      <span className="inline-flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: max }, (_, index) => (
          <Star
            key={index}
            className={cn(
              starSize,
              index < rounded
                ? "fill-[#f5a623] text-[#f5a623]"
                : "fill-transparent text-line",
            )}
            strokeWidth={1.5}
          />
        ))}
      </span>
      {showValue ? (
        <span
          aria-hidden="true"
          className={cn(
            "font-semibold text-ink",
            size === "sm" ? "text-xs" : "text-sm",
          )}
        >
          {value.toFixed(1)}
        </span>
      ) : null}
    </span>
  );
}
