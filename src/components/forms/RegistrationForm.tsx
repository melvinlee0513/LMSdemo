"use client";

import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import type { Option } from "@/components/forms/EnquiryForm";
import {
  CheckboxGroupField,
  ConsentField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/forms/Field";
import { FormShell, type FormChrome } from "@/components/forms/FormShell";
import { useCentreForm } from "@/components/forms/useCentreForm";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import {
  checked,
  email as emailRule,
  minLength,
  phone,
  required,
  type FieldRules,
} from "@/lib/validation";

export type RegistrationClassOption = Option & { subject: string };

const STEPS = [
  { id: "student", title: "Student" },
  { id: "subjects", title: "Subjects" },
  { id: "parent", title: "Parent" },
  { id: "review", title: "Review" },
] as const;

/**
 * Multi-step student registration.
 *
 * Split into four short steps rather than one intimidating page, with a
 * visible progress indicator, per-step validation, free movement backwards,
 * and a review screen before anything is submitted.
 */
export function RegistrationForm({
  chrome,
  levelOptions,
  subjectOptions,
  classOptions,
  consentLabel,
}: {
  chrome: FormChrome;
  levelOptions: Option[];
  subjectOptions: Option[];
  classOptions: RegistrationClassOption[];
  consentLabel?: string;
}) {
  const [step, setStep] = useState(0);

  const formRef = useRef<HTMLFormElement>(null);

  const form = useCentreForm({
    kind: "registration",
    mode: chrome.mode,
    formRef,
    initialValues: {
      studentName: "",
      school: "",
      level: "",
      subjects: [],
      preferredClasses: [],
      parentName: "",
      parentPhone: "",
      parentEmail: "",
      notes: "",
      consent: consentLabel ? "false" : "true",
    },
    rules: {
      studentName: [required("Please enter the student's name"), minLength(2)],
      level: [required("Please choose the student's form")],
      subjects: [required("Please choose at least one subject")],
      parentName: [required("Please enter a parent or guardian name"), minLength(2)],
      parentPhone: [required("We need a contact number"), phone()],
      parentEmail: [emailRule()],
      ...(consentLabel ? { consent: [checked()] } : {}),
    },
  });

  const stepRules = useMemo<FieldRules[]>(
    () => [
      {
        studentName: [required("Please enter the student's name"), minLength(2)],
        level: [required("Please choose the student's form")],
      },
      { subjects: [required("Please choose at least one subject")] },
      {
        parentName: [required("Please enter a parent or guardian name"), minLength(2)],
        parentPhone: [required("We need a contact number"), phone()],
        parentEmail: [emailRule()],
      },
      consentLabel ? { consent: [checked()] } : {},
    ],
    [consentLabel],
  );

  const selectedSubjects = form.list("subjects");

  const relevantClasses = useMemo(
    () =>
      selectedSubjects.length > 0
        ? classOptions.filter((option) => selectedSubjects.includes(option.subject))
        : [],
    [classOptions, selectedSubjects],
  );

  const goNext = () => {
    const rules = stepRules[step] ?? {};
    if (!form.validate(rules)) return;
    if (step === 0) track("registration_start");
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const goBack = () => setStep((current) => Math.max(current - 1, 0));

  const labelFor = (options: Option[], value: string) =>
    options.find((option) => option.value === value)?.label ?? value;

  return (
    <FormShell
      chrome={chrome}
      status={form.status}
      errorMessage={form.errorMessage}
      onReset={() => {
        form.reset();
        setStep(0);
      }}
      resetLabel="Register another student"
    >
      {/* Progress */}
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
        {STEPS.map((item, index) => {
          const state = index < step ? "done" : index === step ? "current" : "todo";
          return (
            <li key={item.id} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={cn(
                  "inline-flex size-8 items-center justify-center rounded-full text-sm font-bold transition-colors duration-200",
                  state === "done" && "gradient-brand text-white",
                  state === "current" && "bg-brand-soft text-brand ring-2 ring-brand/30",
                  state === "todo" && "bg-surface-muted text-ink-muted",
                )}
              >
                {state === "done" ? <Check className="size-4" strokeWidth={3} /> : index + 1}
              </span>
              <span
                className={cn(
                  "text-sm font-semibold",
                  state === "current" ? "text-ink" : "text-ink-muted",
                )}
              >
                {item.title}
                {state === "current" ? (
                  <span className="sr-only">
                    {" "}
                    — step {index + 1} of {STEPS.length}, current step
                  </span>
                ) : null}
              </span>
              {index < STEPS.length - 1 ? (
                <span aria-hidden="true" className="hidden h-px w-6 bg-line sm:block" />
              ) : null}
            </li>
          );
        })}
      </ol>

      <form
        ref={formRef}
        onSubmit={(event) => {
          void form.handleSubmit(event).then(() => track("registration_submit"));
        }}
        noValidate
        className="flex flex-col gap-6"
      >
        {step === 0 ? (
          <fieldset className="flex flex-col gap-5">
            <legend className="sr-only">Student details</legend>
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
                label="Current form"
                name="level"
                required
                value={form.text("level")}
                onChange={(value) => form.setValue("level", value)}
                options={levelOptions}
                error={form.errors.level}
              />
            </div>
            <TextField
              label="School"
              name="school"
              value={form.text("school")}
              onChange={(value) => form.setValue("school", value)}
              error={form.errors.school}
            />
          </fieldset>
        ) : null}

        {step === 1 ? (
          <fieldset className="flex flex-col gap-6">
            <legend className="sr-only">Subjects and classes</legend>
            <CheckboxGroupField
              label="Which subjects?"
              name="subjects"
              required
              options={subjectOptions}
              values={selectedSubjects}
              onChange={(values) => {
                form.setValue("subjects", values);
                form.setValue(
                  "preferredClasses",
                  form
                    .list("preferredClasses")
                    .filter((slug) =>
                      classOptions.some(
                        (option) => option.value === slug && values.includes(option.subject),
                      ),
                    ),
                );
              }}
              error={form.errors.subjects}
            />

            {relevantClasses.length > 0 ? (
              <CheckboxGroupField
                label="Preferred classes"
                name="preferredClasses"
                columns={1}
                hint="Optional — we will suggest sessions that fit if you are not sure."
                options={relevantClasses}
                values={form.list("preferredClasses")}
                onChange={(values) => form.setValue("preferredClasses", values)}
              />
            ) : null}
          </fieldset>
        ) : null}

        {step === 2 ? (
          <fieldset className="flex flex-col gap-5">
            <legend className="sr-only">Parent or guardian details</legend>
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
                label="Phone or WhatsApp"
                name="parentPhone"
                type="tel"
                inputMode="tel"
                required
                value={form.text("parentPhone")}
                onChange={(value) => form.setValue("parentPhone", value)}
                error={form.errors.parentPhone}
                autoComplete="tel"
              />
            </div>
            <TextField
              label="Email"
              name="parentEmail"
              type="email"
              inputMode="email"
              value={form.text("parentEmail")}
              onChange={(value) => form.setValue("parentEmail", value)}
              error={form.errors.parentEmail}
              autoComplete="email"
            />
            <TextAreaField
              label="Anything we should know?"
              name="notes"
              value={form.text("notes")}
              onChange={(value) => form.setValue("notes", value)}
              rows={3}
            />
          </fieldset>
        ) : null}

        {step === 3 ? (
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-bold text-ink">Please check these details</h2>

            <dl className="grid gap-x-8 gap-y-3 rounded-3xl border border-line bg-surface-warm p-5 text-sm sm:grid-cols-2 sm:p-6">
              <ReviewRow label="Student" value={form.text("studentName")} />
              <ReviewRow label="Form" value={labelFor(levelOptions, form.text("level"))} />
              <ReviewRow label="School" value={form.text("school")} />
              <ReviewRow
                label="Subjects"
                value={selectedSubjects
                  .map((value) => labelFor(subjectOptions, value))
                  .join(", ")}
              />
              <ReviewRow
                label="Preferred classes"
                value={form
                  .list("preferredClasses")
                  .map((value) => labelFor(classOptions, value))
                  .join(", ")}
              />
              <ReviewRow label="Parent / guardian" value={form.text("parentName")} />
              <ReviewRow label="Contact" value={form.text("parentPhone")} />
              <ReviewRow label="Email" value={form.text("parentEmail")} />
              <ReviewRow label="Notes" value={form.text("notes")} />
            </dl>

            {consentLabel ? (
              <ConsentField
                label={consentLabel}
                name="consent"
                checked={form.text("consent") === "true"}
                onChange={(value) => form.setValue("consent", String(value))}
                error={form.errors.consent}
              />
            ) : null}
          </div>
        ) : null}

        {/* Navigation */}
        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
          {step > 0 ? (
            <Button type="button" variant="secondary" onClick={goBack}>
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back
            </Button>
          ) : null}

          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={goNext} className="ml-auto sm:ml-0">
              Continue
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          ) : (
            <Button type="submit" size="lg" disabled={form.status === "submitting"}>
              {form.status === "submitting" ? (
                <>
                  <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  <Check aria-hidden="true" className="size-4" />
                  Submit registration
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </FormShell>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-semibold tracking-wide text-ink-muted uppercase">
        {label}
      </dt>
      <dd className="font-medium text-ink">{value || "—"}</dd>
    </div>
  );
}
