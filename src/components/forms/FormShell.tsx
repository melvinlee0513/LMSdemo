"use client";

import { AlertCircle, CheckCircle2, Info, MessageCircle } from "lucide-react";
import type { ReactNode } from "react";

import { buttonClasses } from "@/components/ui/Button";
import type { SiteMode } from "@/config/types";
import { cn } from "@/lib/utils";

export type FormChrome = {
  mode: SiteMode;
  privacyNotice: string;
  successTitle: string;
  successBody: string;
  whatsappHref?: string;
};

/**
 * Everything that wraps a form body: the demo disclosure, the privacy notice,
 * the error banner and the success state. Shared so all four forms behave
 * identically.
 */
export function FormShell({
  chrome,
  status,
  errorMessage,
  onReset,
  resetLabel = "Send another",
  children,
  className,
}: {
  chrome: FormChrome;
  status: "idle" | "submitting" | "success" | "error";
  errorMessage?: string;
  onReset?: () => void;
  resetLabel?: string;
  children: ReactNode;
  className?: string;
}) {
  if (status === "success") {
    return (
      <div
        className={cn(
          "flex flex-col items-center gap-4 rounded-3xl border border-line-warm bg-surface-warm p-8 text-center shadow-soft sm:p-10",
          className,
        )}
        role="status"
        aria-live="polite"
      >
        <span className="inline-flex size-14 items-center justify-center rounded-full bg-brand-soft text-brand">
          <CheckCircle2 aria-hidden="true" className="size-7" />
        </span>

        <div className="flex max-w-md flex-col gap-2">
          <h2 className="text-xl font-bold text-ink sm:text-2xl">{chrome.successTitle}</h2>
          <p className="text-sm leading-relaxed text-ink-soft">{chrome.successBody}</p>
        </div>

        {chrome.mode === "demo" ? (
          <p className="max-w-md rounded-2xl bg-surface px-4 py-3 text-xs leading-relaxed text-ink-muted">
            This is a demonstration. Nothing was sent and no information was stored.
          </p>
        ) : null}

        <div className="flex flex-wrap justify-center gap-2.5">
          {onReset ? (
            <button
              type="button"
              onClick={onReset}
              className={buttonClasses({ variant: "secondary", size: "sm" })}
            >
              {resetLabel}
            </button>
          ) : null}
          {chrome.whatsappHref ? (
            <a
              href={chrome.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses({ variant: "primary", size: "sm" })}
            >
              <MessageCircle aria-hidden="true" className="size-4" />
              Message us on WhatsApp
            </a>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {chrome.mode === "demo" ? (
        <p className="flex items-start gap-2.5 rounded-2xl border border-line bg-surface-muted px-4 py-3 text-xs leading-relaxed text-ink-soft">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-ink-muted" />
          <span>
            <strong className="font-semibold text-ink">Demonstration form.</strong> This
            is a concept website — submitting does not send or store anything. Please do
            not enter real personal details.
          </span>
        </p>
      ) : null}

      {status === "error" && errorMessage ? (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-2xl border border-[#f0c7bf] bg-[#fdf1ee] px-4 py-3 text-sm leading-relaxed text-[#a52b16]"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {errorMessage}
        </p>
      ) : null}

      {children}

      <p className="text-xs leading-relaxed text-ink-muted">{chrome.privacyNotice}</p>
    </div>
  );
}
