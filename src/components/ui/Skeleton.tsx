import { cn } from "@/lib/utils";

/**
 * Loading placeholder for route-level `loading.tsx` files.
 * Reserves the same box the real content will occupy, so nothing shifts.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-2xl bg-surface-muted", className)}
    />
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-line bg-surface p-6 shadow-soft",
        className,
      )}
    >
      <Skeleton className="h-12 w-12 rounded-2xl" />
      <Skeleton className="mt-5 h-5 w-2/3" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-4/5" />
    </div>
  );
}
