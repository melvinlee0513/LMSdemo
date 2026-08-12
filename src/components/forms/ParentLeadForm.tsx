"use client";

import { Loader2, Send } from "lucide-react";
import { useRef } from "react";

import type { Option } from "@/components/forms/EnquiryForm";
import { ConsentField, SelectField, TextField } from "@/components/forms/Field";
import { FormShell, type FormChrome } from "@/components/forms/FormShell";
import { useCentreForm } from "@/components/forms/useCentreForm";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { checked, minLength, phone, required } from "@/lib/validation";

/**
 * Compact parent lead capture for contextual CTA blocks — three fields, no
 * modal, no interstitial, no dark patterns. It appears inline in the page
 * where a parent is already reading about a subject or a branch.
 */
export function ParentLeadForm({
  chrome,
  levelOptions,
  defaultSubject,
  consentLabel,
}: {
  chrome: FormChrome;
  levelOptions: Option[];
  defaultSubject?: string;
  consentLabel?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const form = useCentreForm({
    kind: "parent-lead",
    mode: chrome.mode,
    formRef,
    initialValues: {
      parentName: "",
      contact: "",
      level: "",
      subject: defaultSubject ?? "",
      consent: consentLabel ? "false" : "true",
    },
    rules: {
      parentName: [required("Please tell us your name"), minLength(2)],
      contact: [required("We need a number so we can reply"), phone()],
      ...(consentLabel ? { consent: [checked()] } : {}),
    },
  });

  return (
    <FormShell
      chrome={chrome}
      status={form.status}
      errorMessage={form.errorMessage}
      onReset={form.reset}
      resetLabel="Send another request"
    >
      <form
        ref={formRef}
        onSubmit={(event) => {
          void form.handleSubmit(event).then(() => track("parent_lead_submit"));
        }}
        noValidate
        className="flex flex-col gap-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Your name"
            name="parentName"
            required
            value={form.text("parentName")}
            onChange={(value) => form.setValue("parentName", value)}
            error={form.errors.parentName}
            autoComplete="name"
          />
          <TextField
            label="WhatsApp number"
            name="contact"
            type="tel"
            inputMode="tel"
            required
            value={form.text("contact")}
            onChange={(value) => form.setValue("contact", value)}
            error={form.errors.contact}
            autoComplete="tel"
          />
        </div>

        {levelOptions.length > 0 ? (
          <SelectField
            label="Your child's form"
            name="level"
            value={form.text("level")}
            onChange={(value) => form.setValue("level", value)}
            options={levelOptions}
            error={form.errors.level}
            placeholder="Not sure yet"
          />
        ) : null}

        {consentLabel ? (
          <ConsentField
            label={consentLabel}
            name="consent"
            checked={form.text("consent") === "true"}
            onChange={(value) => form.setValue("consent", String(value))}
            error={form.errors.consent}
          />
        ) : null}

        <Button type="submit" disabled={form.status === "submitting"} fullWidth>
          {form.status === "submitting" ? (
            <>
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send aria-hidden="true" className="size-4" />
              Send me the details
            </>
          )}
        </Button>
      </form>
    </FormShell>
  );
}
