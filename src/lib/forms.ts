import type { SiteMode } from "@/config/types";
import type { FieldValues } from "@/lib/validation";

/**
 * ---------------------------------------------------------------------------
 * Form submission adapters
 * ---------------------------------------------------------------------------
 * Forms are deliberately decoupled from any backend.
 *
 *   demo        Nothing leaves the browser. The submission is simulated so a
 *               prospect can click through the whole journey, and the UI says
 *               plainly that it is a demonstration.
 *
 *   production  The browser posts to this app's own /api/forms route, which
 *               runs the configured server-side adapter. Credentials stay on
 *               the server; the browser never sees an endpoint or a key.
 *
 * To integrate a real backend later (Supabase, a CRM, an email service),
 * implement it in `src/app/api/forms/route.ts` — nothing in the UI changes.
 */

export type FormKind = "enquiry" | "trial" | "registration" | "parent-lead";

export type FormSubmission = {
  kind: FormKind;
  /** Field values as captured by the form. Never sent to analytics. */
  fields: FieldValues;
};

export type SubmitOutcome =
  | { status: "ok" }
  | { status: "error"; message: string };

const DEMO_LATENCY_MS = 700;

export async function submitForm(
  mode: SiteMode,
  submission: FormSubmission,
): Promise<SubmitOutcome> {
  if (mode === "demo") {
    // Simulated only. No request is made, nothing is stored, and no personal
    // information is transmitted anywhere.
    await new Promise((resolve) => setTimeout(resolve, DEMO_LATENCY_MS));
    return { status: "ok" };
  }

  try {
    const response = await fetch("/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    });

    if (!response.ok) {
      return {
        status: "error",
        message:
          "We could not send your details just now. Please try again, or contact us on WhatsApp.",
      };
    }

    return { status: "ok" };
  } catch {
    return {
      status: "error",
      message:
        "We could not reach the centre. Please check your connection and try again.",
    };
  }
}
