"use client";

import { Loader2, Send } from "lucide-react";
import { useRef } from "react";

import {
  ConsentField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/forms/Field";
import { FormShell, type FormChrome } from "@/components/forms/FormShell";
import { useCentreForm } from "@/components/forms/useCentreForm";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { email, minLength, phone, required, checked } from "@/lib/validation";

export type Option = { value: string; label: string };

/**
 * General enquiry form — used on the contact page and anywhere a centre wants
 * a "message us" block. One shared implementation, configured by props.
 */
export function EnquiryForm({
  chrome,
  subjectOptions,
  consentLabel,
}: {
  chrome: FormChrome;
  subjectOptions: Option[];
  consentLabel?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const form = useCentreForm({
    kind: "enquiry",
    mode: chrome.mode,
    formRef,
    initialValues: {
      name: "",
      contact: "",
      email: "",
      subject: "",
      message: "",
      consent: consentLabel ? "false" : "true",
    },
    rules: {
      name: [required("Please tell us your name"), minLength(2)],
      contact: [required("We need a number so we can reply"), phone()],
      email: [email()],
      message: [
        required("Please tell us how we can help"),
        minLength(10, "A sentence or two is enough"),
      ],
      ...(consentLabel ? { consent: [checked()] } : {}),
    },
  });

  return (
    <FormShell
      chrome={chrome}
      status={form.status}
      errorMessage={form.errorMessage}
      onReset={form.reset}
      resetLabel="Send another enquiry"
    >
      <form
        ref={formRef}
        onSubmit={(event) => {
          void form.handleSubmit(event).then(() => track("enquiry_submit"));
        }}
        noValidate
        className="flex flex-col gap-5"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Your name"
            name="name"
            required
            value={form.text("name")}
            onChange={(value) => form.setValue("name", value)}
            error={form.errors.name}
            autoComplete="name"
          />
          <TextField
            label="Phone or WhatsApp"
            name="contact"
            type="tel"
            inputMode="tel"
            required
            value={form.text("contact")}
            onChange={(value) => form.setValue("contact", value)}
            error={form.errors.contact}
            autoComplete="tel"
            hint="We usually reply on WhatsApp."
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Email"
            name="email"
            type="email"
            inputMode="email"
            value={form.text("email")}
            onChange={(value) => form.setValue("email", value)}
            error={form.errors.email}
            autoComplete="email"
          />
          {subjectOptions.length > 0 ? (
            <SelectField
              label="Subject you're asking about"
              name="subject"
              value={form.text("subject")}
              onChange={(value) => form.setValue("subject", value)}
              options={subjectOptions}
              error={form.errors.subject}
              placeholder="Any subject"
            />
          ) : null}
        </div>

        <TextAreaField
          label="How can we help?"
          name="message"
          required
          value={form.text("message")}
          onChange={(value) => form.setValue("message", value)}
          error={form.errors.message}
          rows={5}
        />

        {consentLabel ? (
          <ConsentField
            label={consentLabel}
            name="consent"
            checked={form.text("consent") === "true"}
            onChange={(value) => form.setValue("consent", String(value))}
            error={form.errors.consent}
          />
        ) : null}

        <Button
          type="submit"
          size="lg"
          disabled={form.status === "submitting"}
          className="self-start"
        >
          {form.status === "submitting" ? (
            <>
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send aria-hidden="true" className="size-4" />
              Send enquiry
            </>
          )}
        </Button>
      </form>
    </FormShell>
  );
}
