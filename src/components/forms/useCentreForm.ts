"use client";

import { useCallback, useState, type FormEvent, type RefObject } from "react";

import type { SiteMode } from "@/config/types";
import { submitForm, type FormKind } from "@/lib/forms";
import {
  validateFields,
  type FieldErrors,
  type FieldRules,
  type FieldValue,
  type FieldValues,
} from "@/lib/validation";

export type FormStatus = "idle" | "submitting" | "success" | "error";

/**
 * The single form engine behind every form on the site.
 *
 * Keeping one implementation means validation behaviour, error focus
 * management, submit states and the demo/production split are identical
 * everywhere — rather than four forms that each drift in their own direction.
 */
export function useCentreForm({
  kind,
  mode,
  initialValues,
  rules,
  formRef,
}: {
  kind: FormKind;
  mode: SiteMode;
  initialValues: FieldValues;
  rules: FieldRules;
  /**
   * Owned by the calling component rather than returned from here: a hook that
   * returns a ref inside its result object makes every property read on that
   * result look like a ref access during render.
   */
  formRef: RefObject<HTMLFormElement | null>;
}) {
  const [values, setValues] = useState<FieldValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>();

  const setValue = useCallback((name: string, value: FieldValue) => {
    setValues((current) => ({ ...current, [name]: value }));
    // Clear the error as soon as the visitor starts fixing the field.
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }, []);

  /** Moves focus to the first field that failed, so keyboard users are not lost. */
  const focusFirstError = useCallback(
    (nextErrors: FieldErrors) => {
      const firstName = Object.keys(nextErrors)[0];
      const form = formRef.current;
      if (!firstName || !form) return;

      const field = form.querySelector<HTMLElement>(`[name="${CSS.escape(firstName)}"]`);
      field?.focus();
      field?.scrollIntoView({ block: "center", behavior: "smooth" });
    },
    [formRef],
  );

  const validate = useCallback(
    (scopedRules: FieldRules = rules) => {
      const nextErrors = validateFields(values, scopedRules);
      setErrors(nextErrors);
      const valid = Object.keys(nextErrors).length === 0;
      if (!valid) focusFirstError(nextErrors);
      return valid;
    },
    [focusFirstError, rules, values],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (status === "submitting") return;

      if (!validate()) return;

      setStatus("submitting");
      setErrorMessage(undefined);

      const outcome = await submitForm(mode, { kind, fields: values });

      if (outcome.status === "ok") {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(outcome.message);
      }
    },
    [kind, mode, status, validate, values],
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setStatus("idle");
    setErrorMessage(undefined);
  }, [initialValues]);

  return {
    values,
    errors,
    status,
    errorMessage,
    setValue,
    validate,
    handleSubmit,
    reset,
    text: (name: string) => (values[name] as string | undefined) ?? "",
    list: (name: string) => (values[name] as string[] | undefined) ?? [],
  };
}
