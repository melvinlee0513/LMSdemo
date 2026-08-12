"use client";

/**
 * Optional analytics integration point.
 *
 * No analytics library is bundled. `track` is a no-op unless a centre wires
 * one up, which keeps the default build free of third-party scripts.
 *
 * Rule: only event names and non-identifying context are ever passed here.
 * Form field values must never be sent to analytics in any mode.
 */

export type AnalyticsEvent =
  | "whatsapp_click"
  | "trial_start"
  | "trial_submit"
  | "registration_start"
  | "registration_submit"
  | "enquiry_submit"
  | "parent_lead_submit"
  | "class_view"
  | "subject_view";

type AnalyticsContext = Record<string, string | number | boolean>;

type AnalyticsSink = (event: AnalyticsEvent, context?: AnalyticsContext) => void;

let sink: AnalyticsSink | null = null;

/** Called once from a client component if a centre enables analytics. */
export function registerAnalyticsSink(next: AnalyticsSink): void {
  sink = next;
}

export function track(event: AnalyticsEvent, context?: AnalyticsContext): void {
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "true") return;
  sink?.(event, context);
}
