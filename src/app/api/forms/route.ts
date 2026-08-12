import { NextResponse } from "next/server";

import { getCentre, isDemo } from "@/lib/site";

/**
 * ---------------------------------------------------------------------------
 * Production form endpoint
 * ---------------------------------------------------------------------------
 * The integration point for a real backend. It exists so that credentials and
 * endpoints stay on the server — the browser only ever posts to this route.
 *
 * Behaviour:
 *   demo mode           404. Demo deployments must not have a live intake
 *                       endpoint at all; the client never calls this.
 *   provider "none"     501 with a clear message, so a misconfigured
 *                       production launch fails loudly instead of silently
 *                       dropping enquiries.
 *   provider "webhook"  forwards the submission to FORM_WEBHOOK_URL.
 *
 * To integrate Supabase, a CRM or an email service, add a branch here. No UI
 * component needs to change.
 */

const MAX_BODY_BYTES = 16 * 1024;

export async function POST(request: Request) {
  if (isDemo()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const centre = getCentre();

  if (centre.forms.provider === "none") {
    console.error(
      "[forms] A submission was received but forms.provider is \"none\". " +
        "Set a provider in the centre configuration before going live.",
    );
    return NextResponse.json(
      { error: "Form delivery is not configured for this site." },
      { status: 501 },
    );
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let submission: unknown;
  try {
    submission = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!isSubmission(submission)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const endpoint = process.env.FORM_WEBHOOK_URL;
  if (!endpoint) {
    console.error("[forms] forms.provider is \"webhook\" but FORM_WEBHOOK_URL is unset.");
    return NextResponse.json(
      { error: "Form delivery is not configured for this site." },
      { status: 501 },
    );
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        centreId: centre.id,
        kind: submission.kind,
        fields: submission.fields,
        receivedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error(`[forms] Webhook responded ${response.status}`);
      return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
    }
  } catch (error) {
    console.error("[forms] Webhook request failed", error);
    return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

type Submission = { kind: string; fields: Record<string, unknown> };

function isSubmission(value: unknown): value is Submission {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.kind === "string" &&
    typeof candidate.fields === "object" &&
    candidate.fields !== null
  );
}
