"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { track } from "@/lib/analytics";

/**
 * Discreet mobile-only conversion bar.
 *
 * Deliberately restrained: two actions, real 48px targets, safe-area padding,
 * and an in-flow spacer so it never covers the end of the page. It hides
 * itself on the form routes, where a fixed bar would sit on top of the
 * submit button.
 */
const HIDDEN_ON = ["/trial", "/register", "/contact"];

export function MobileStickyCta({
  whatsappHref,
  cta,
  centreName,
}: {
  whatsappHref?: string;
  cta?: { label: string; href: string };
  centreName: string;
}) {
  const pathname = usePathname();

  if (!whatsappHref && !cta) return null;
  if (HIDDEN_ON.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return null;
  }

  return (
    <>
      {/* Keeps the footer clear of the fixed bar. */}
      <div aria-hidden="true" className="h-[4.75rem] md:hidden" />

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur-sm md:hidden">
        <div className="flex gap-2.5 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { placement: "sticky_bar" })}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-line-warm bg-surface text-[0.9375rem] font-semibold text-brand"
            >
              <MessageCircle aria-hidden="true" className="size-4.5" />
              <span>
                WhatsApp<span className="sr-only"> {centreName}</span>
              </span>
            </a>
          ) : null}

          {cta ? (
            <Link
              href={cta.href}
              className="gradient-brand inline-flex h-12 flex-1 items-center justify-center rounded-full text-[0.9375rem] font-semibold text-white shadow-brand"
            >
              {cta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </>
  );
}
