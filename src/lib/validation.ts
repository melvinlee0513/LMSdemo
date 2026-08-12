/**
 * A tiny, client-safe validation layer.
 *
 * Zod stays on the server for configuration validation; forms use these few
 * hundred bytes instead so the JavaScript budget for a marketing site is not
 * spent on a schema library the browser barely needs.
 */

export type FieldValue = string | string[];
export type FieldValues = Record<string, FieldValue>;
export type FieldErrors = Record<string, string>;

export type Validator = (value: FieldValue, values: FieldValues) => string | undefined;

export const required =
  (message = "This field is required"): Validator =>
  (value) => {
    if (Array.isArray(value)) return value.length === 0 ? message : undefined;
    return value.trim().length === 0 ? message : undefined;
  };

export const minLength =
  (length: number, message?: string): Validator =>
  (value) => {
    const text = Array.isArray(value) ? value.join("") : value;
    if (text.trim().length === 0) return undefined; // `required` owns emptiness
    return text.trim().length < length
      ? (message ?? `Please enter at least ${length} characters`)
      : undefined;
  };

export const email =
  (message = "Please enter a valid email address, for example name@example.com"): Validator =>
  (value) => {
    const text = String(value).trim();
    if (!text) return undefined;
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text) ? undefined : message;
  };

/**
 * Malaysian mobile numbers are commonly written as 012-345 6789,
 * +60 12-345 6789 or 0123456789. Accept all of them; normalise later.
 */
export const phone =
  (message = "Please enter a contact number, for example 012-345 6789"): Validator =>
  (value) => {
    const digits = String(value).replace(/[^\d]/g, "");
    if (digits.length === 0) return undefined;
    return digits.length >= 8 && digits.length <= 15 ? undefined : message;
  };

export const checked =
  (message = "Please tick this box to continue"): Validator =>
  (value) =>
    value === "true" ? undefined : message;

/**
 * Values may be undefined so that rule sets can be composed conditionally
 * (`...(consentLabel ? { consent: [checked()] } : {})`) without fighting the
 * type system at every call site.
 */
export type FieldRules = Record<string, Validator[] | undefined>;

export function validateFields(
  values: FieldValues,
  rules: FieldRules,
): FieldErrors {
  const errors: FieldErrors = {};

  for (const [name, validators] of Object.entries(rules)) {
    if (!validators) continue;
    const value = values[name] ?? "";
    for (const validate of validators) {
      const error = validate(value, values);
      if (error) {
        errors[name] = error;
        break;
      }
    }
  }

  return errors;
}

/** Normalises a Malaysian number to international digits, e.g. 60123456789. */
export function normalisePhone(value: string): string {
  const digits = value.replace(/[^\d]/g, "");
  if (digits.startsWith("60")) return digits;
  if (digits.startsWith("0")) return `60${digits.slice(1)}`;
  return digits;
}
