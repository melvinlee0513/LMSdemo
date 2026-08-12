"use client";

import { CalendarCheck, Loader2 } from "lucide-react";
import { useMemo, useRef } from "react";

import type { Option } from "@/components/forms/EnquiryForm";
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
import { checked, minLength, phone, required } from "@/lib/validation";

export type TrialClassOption = Option & { subject: string };

/**
 * Trial booking — deliberately shorter than full registration.
 * Seven fields, one screen, no steps: the point is low friction.
 */
export function TrialForm({
  chrome,
  subjectOptions,
  levelOptions,
  classOptions,
  defaultSubject,
  defaultClass,
  consentLabel,
}: {
  chrome: FormChrome;
  subjectOptions: Option[];
  levelOptions: Option[];
  classOptions: TrialClassOption[];
  defaultSubject?: string;
  defaultClass?: string;
  consentLabel?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const form = useCentreForm({
    kind: "trial",
    mode: chrome.mode,
    formRef,
    initialValues: {
      parentName: "",
      studentName: "",
      level: "",
      subject: defaultSubject ?? "",
      preferredClass: defaultClass ?? "",
      contact: "",
      notes: "",
      consent: consentLabel ? "false" : "true",
    },
    rules: {
      parentName: [required("Please tell us your name"), minLength(2)],
      studentName: [required("Please tell us the student's name"), minLength(2)],
      level: [required("Please choose the student's form")],
      subject: [required("Please choose a subject")],
      contact: [required("We need a number to confirm the session"), phone()],
      ...(consentLabel ? { consent: [checked()] } : {}),
    },
  });

  const selectedSubject = form.text("subject");

  /** Only offer classes that actually teach the chosen subject. */
  const availableClasses = useMemo(
    () =>
      selectedSubject
        ? classOptions.filter((option) => option.subject === selectedSubject)
        : classOptions,
    [classOptions, selectedSubject],
  );

  return (
    <FormShell
      chrome={chrome}
      status={form.status}
      errorMessage={form.errorMessage}
      onReset={form.reset}
      resetLabel="Book another trial"
    >
      <form
        ref={formRef}
        onSubmit={(event) => {
          void form.handleSubmit(event).then(() => track("trial_submit"));
        }}
        noValidate
        className="flex flex-col gap-5"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Parent or guardian name"
            name="parentName"
            required
            value={form.text("parentName")}
            onChange={(value) => form.setValue("parentName", value)}
            error={form.errors.parentName}
            autoComplete="name"
          />
          <TextField
            label="WhatsApp or phone number"
            name="contact"
            type="tel"
            inputMode="tel"
            required
            value={form.text("contact")}
            onChange={(value) => form.setValue("contact", value)}
            error={form.errors.contact}
            autoComplete="tel"
            hint="We confirm trial sessions on WhatsApp."
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Student name"
            name="studentName"
            required
            value={form.text("studentName")}
            onChange={(value) => form.setValue("studentName", value)}
            error={form.errors.studentName}
          />
          <SelectField
            label="Student's form"
            name="level"
            required
            value={form.text("level")}
            onChange={(value) => form.setValue("level", value)}
            options={levelOptions}
            error={form.errors.level}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            label="Subject"
            name="subject"
            required
            value={selectedSubject}
            onChange={(value) => {
              form.setValue("subject", value);
              form.setValue("preferredClass", "");
            }}
            options={subjectOptions}
            error={form.errors.subject}
          />
          <SelectField
            label="Preferred class"
            name="preferredClass"
            value={form.text("preferredClass")}
            onChange={(value) => form.setValue("preferredClass", value)}
            options={availableClasses}
            error={form.errors.preferredClass}
            placeholder="Let the centre suggest one"
            hint="Not sure? Leave this and we will recommend a session."
          />
        </div>

        <TextAreaField
          label="Anything we should know?"
          name="notes"
          value={form.text("notes")}
          onChange={(value) => form.setValue("notes", value)}
          error={form.errors.notes}
          rows={3}
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
              Booking…
            </>
          ) : (
            <>
              <CalendarCheck aria-hidden="true" className="size-4" />
              Request trial class
            </>
          )}
        </Button>
      </form>
    </FormShell>
  );
}
