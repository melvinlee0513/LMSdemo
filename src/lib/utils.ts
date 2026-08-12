import { DAY_LABELS, type Day } from "@/config/constants";

export type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | ClassValue[]
  | Record<string, boolean | null | undefined>;

/**
 * Minimal class-name joiner. Deliberately not `clsx` + `tailwind-merge`:
 * variants in this codebase are composed rather than overridden, so there is
 * nothing for a merge pass to resolve.
 */
export function cn(...values: ClassValue[]): string {
  const out: string[] = [];

  for (const value of values) {
    if (!value) continue;

    if (typeof value === "string" || typeof value === "number") {
      out.push(String(value));
    } else if (Array.isArray(value)) {
      const nested = cn(...value);
      if (nested) out.push(nested);
    } else {
      for (const [key, enabled] of Object.entries(value)) {
        if (enabled) out.push(key);
      }
    }
  }

  return out.join(" ");
}

/** "16:30" → "4:30 PM" */
export function formatTime(time: string): string {
  const [hoursRaw, minutesRaw] = time.split(":");
  const hours = Number(hoursRaw);
  const minutes = minutesRaw ?? "00";

  if (Number.isNaN(hours)) return time;

  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;

  return `${displayHour}:${minutes} ${period}`;
}

/** "16:30" + "18:00" → "1 hr 30 min" */
export function formatDuration(startTime: string, endTime: string): string {
  const minutes = durationInMinutes(startTime, endTime);
  if (minutes <= 0) return "";

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  if (hours === 0) return `${remainder} min`;
  if (remainder === 0) return `${hours} hr`;
  return `${hours} hr ${remainder} min`;
}

export function durationInMinutes(startTime: string, endTime: string): number {
  return toMinutes(endTime) - toMinutes(startTime);
}

export function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":");
  return Number(hours) * 60 + Number(minutes ?? 0);
}

export function dayLabel(day: Day, form: "short" | "long" = "long"): string {
  return DAY_LABELS[day][form];
}

/** Turns arbitrary text into a stable, human-readable URL slug. */
export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Formats a list as "A, B and C" for readable prose and metadata. */
export function listToSentence(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0] ?? "";

  const head = items.slice(0, -1).join(", ");
  const tail = items[items.length - 1];
  return `${head} and ${tail}`;
}

/** Truncates on a word boundary — used to keep meta descriptions in range. */
export function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;

  const clipped = value.slice(0, maxLength - 1);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, lastSpace > 40 ? lastSpace : clipped.length).trimEnd()}…`;
}

/** Groups a list by a derived key, preserving input order within each group. */
export function groupBy<T, K extends string>(
  items: readonly T[],
  keyOf: (item: T) => K,
): Record<K, T[]> {
  const out = {} as Record<K, T[]>;

  for (const item of items) {
    const key = keyOf(item);
    (out[key] ??= []).push(item);
  }

  return out;
}

/** Stable unique-by-key helper for building filter option lists. */
export function uniqueBy<T, K>(items: readonly T[], keyOf: (item: T) => K): T[] {
  const seen = new Set<K>();
  const out: T[] = [];

  for (const item of items) {
    const key = keyOf(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }

  return out;
}
