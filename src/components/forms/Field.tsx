"use client";

import { AlertCircle } from "lucide-react";
import { useId, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * ---------------------------------------------------------------------------
 * Form field primitives
 * ---------------------------------------------------------------------------
 * Every field here gets a real <label>, an id/name, `aria-describedby` for its
 * hint and error, and `aria-invalid` when it fails validation. Errors are
 * announced with an icon and text — never signalled by colour alone — and
 * placeholders are never used as a substitute for a label.
 */

type BaseFieldProps = {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
};

function useFieldIds(name: string, hint?: string, error?: string) {
  const uid = useId();
  const id = `${name}-${uid}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return { id, hintId, errorId, describedBy };
}

function FieldFrame({
  id,
  label,
  hint,
  hintId,
  error,
  errorId,
  required,
  className,
  children,
}: {
  id: string;
  hintId?: string;
  errorId?: string;
  children: ReactNode;
} & BaseFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
        {required ? (
          <span className="ml-1 text-brand" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-1.5 text-xs font-normal text-ink-muted">(optional)</span>
        )}
      </label>

      {hint ? (
        <p id={hintId} className="text-xs leading-relaxed text-ink-muted">
          {hint}
        </p>
      ) : null}

      {children}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="flex items-start gap-1.5 text-sm font-medium text-[#c0331b]"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

const controlClasses =
  "w-full rounded-2xl border bg-surface px-4 text-[0.9375rem] text-ink " +
  "transition-colors duration-200 placeholder:text-ink-muted/70 " +
  "focus:border-brand focus:outline-none";

export function TextField({
  type = "text",
  value,
  onChange,
  autoComplete,
  inputMode,
  placeholder,
  ...field
}: BaseFieldProps & {
  type?: "text" | "email" | "tel";
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  placeholder?: string;
}) {
  const { id, hintId, errorId, describedBy } = useFieldIds(
    field.name,
    field.hint,
    field.error,
  );

  return (
    <FieldFrame {...field} id={id} hintId={hintId} errorId={errorId}>
      <input
        id={id}
        name={field.name}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        aria-invalid={field.error ? true : undefined}
        aria-describedby={describedBy}
        required={field.required}
        className={cn(
          controlClasses,
          "h-12",
          field.error ? "border-[#c0331b]" : "border-line",
        )}
      />
    </FieldFrame>
  );
}

export function TextAreaField({
  value,
  onChange,
  rows = 4,
  placeholder,
  ...field
}: BaseFieldProps & {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  const { id, hintId, errorId, describedBy } = useFieldIds(
    field.name,
    field.hint,
    field.error,
  );

  return (
    <FieldFrame {...field} id={id} hintId={hintId} errorId={errorId}>
      <textarea
        id={id}
        name={field.name}
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-invalid={field.error ? true : undefined}
        aria-describedby={describedBy}
        required={field.required}
        className={cn(
          controlClasses,
          "resize-y py-3 leading-relaxed",
          field.error ? "border-[#c0331b]" : "border-line",
        )}
      />
    </FieldFrame>
  );
}

export function SelectField({
  value,
  onChange,
  options,
  placeholder = "Please choose…",
  ...field
}: BaseFieldProps & {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  const { id, hintId, errorId, describedBy } = useFieldIds(
    field.name,
    field.hint,
    field.error,
  );

  return (
    <FieldFrame {...field} id={id} hintId={hintId} errorId={errorId}>
      <select
        id={id}
        name={field.name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={field.error ? true : undefined}
        aria-describedby={describedBy}
        required={field.required}
        className={cn(
          controlClasses,
          "h-12 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%238b93a1%22 stroke-width=%222%22 stroke-linecap=%22round%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[length:18px] bg-[right_1rem_center] bg-no-repeat pr-11",
          field.error ? "border-[#c0331b]" : "border-line",
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldFrame>
  );
}

/** Multi-select as a list of real checkboxes inside a fieldset. */
export function CheckboxGroupField({
  label,
  name,
  options,
  values,
  onChange,
  hint,
  error,
  required,
  columns = 2,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  values: string[];
  onChange: (values: string[]) => void;
  hint?: string;
  error?: string;
  required?: boolean;
  columns?: 1 | 2;
}) {
  const uid = useId();
  const hintId = hint ? `${name}-${uid}-hint` : undefined;
  const errorId = error ? `${name}-${uid}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const toggle = (value: string) => {
    onChange(
      values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value],
    );
  };

  return (
    <fieldset
      className="flex flex-col gap-2.5"
      aria-describedby={describedBy}
      aria-invalid={error ? true : undefined}
    >
      <legend className="text-sm font-semibold text-ink">
        {label}
        {required ? (
          <span className="ml-1 text-brand" aria-hidden="true">
            *
          </span>
        ) : null}
      </legend>

      {hint ? (
        <p id={hintId} className="text-xs leading-relaxed text-ink-muted">
          {hint}
        </p>
      ) : null}

      <div
        className={cn("grid gap-2", columns === 2 ? "sm:grid-cols-2" : "grid-cols-1")}
      >
        {options.map((option) => {
          const checked = values.includes(option.value);
          return (
            <label
              key={option.value}
              className={cn(
                "flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-2.5 text-[0.9375rem] transition-colors duration-200",
                checked
                  ? "border-line-warm bg-brand-soft text-ink"
                  : "border-line bg-surface text-ink-soft hover:bg-surface-muted",
              )}
            >
              <input
                type="checkbox"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => toggle(option.value)}
                className="size-4.5 shrink-0 rounded border-line"
              />
              {option.label}
            </label>
          );
        })}
      </div>

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="flex items-start gap-1.5 text-sm font-medium text-[#c0331b]"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

export function ConsentField({
  label,
  name,
  checked,
  onChange,
  error,
}: {
  label: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}) {
  const uid = useId();
  const id = `${name}-${uid}`;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-soft"
      >
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className="mt-0.5 size-4.5 shrink-0 rounded border-line"
        />
        <span>{label}</span>
      </label>

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="flex items-start gap-1.5 text-sm font-medium text-[#c0331b]"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
