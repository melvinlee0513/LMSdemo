"use client";

import { Menu, MessageCircle, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";

import { buttonClasses } from "@/components/ui/Button";
import type { NavLink } from "@/lib/navigation";
import { isActivePath } from "@/lib/navigation";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export type HeaderNavProps = {
  logo: ReactNode;
  links: NavLink[];
  cta?: { label: string; href: string };
  mobileSecondaryCta?: { label: string; href: string };
  whatsapp?: { href: string; display?: string };
  phone?: string;
  centreName: string;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Sticky site header plus the mobile drawer.
 *
 * The mobile menu is a rebuilt experience rather than a shrunken desktop nav:
 * full-height sheet, large targets, the primary CTA, WhatsApp and the
 * centre's contact details all in reach.
 */
export function HeaderNav({
  logo,
  links,
  cta,
  mobileSecondaryCta,
  whatsapp,
  phone,
  centreName,
}: HeaderNavProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  /**
   * The drawer stores the route it was opened on rather than a plain boolean.
   * A navigation therefore closes it during render — no effect, and it works
   * for the browser back button as well as for tapping a link.
   */
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn !== null && openedOn === pathname;

  const close = useCallback(() => setOpenedOn(null), []);
  const toggle = useCallback(
    () => setOpenedOn((current) => (current === null ? pathname : null)),
    [pathname],
  );

  /* Elevate the header only once the page has actually scrolled. */
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 8));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* Scroll lock, ESC handling and a focus trap while the drawer is open. */
  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpenedOn(null);
        toggleRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => element.offsetParent !== null,
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-surface/95 backdrop-blur-sm transition-shadow duration-200",
        scrolled ? "border-line shadow-soft" : "border-line/70",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center gap-4 px-5 sm:px-6 lg:h-18 lg:px-8">
        {logo}

        {/* Desktop navigation */}
        <nav aria-label="Main" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => {
              const active = isActivePath(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex h-10 items-center rounded-full px-3.5 text-[0.9375rem] font-medium transition-colors duration-200",
                      active
                        ? "bg-brand-soft text-brand"
                        : "text-ink-soft hover:bg-surface-muted hover:text-ink",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          {whatsapp ? (
            <a
              href={whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { placement: "header" })}
              className="hidden size-11 items-center justify-center rounded-full text-ink-soft transition-colors duration-200 hover:bg-brand-soft hover:text-brand sm:inline-flex lg:hidden xl:inline-flex"
              aria-label={`Message ${centreName} on WhatsApp`}
            >
              <MessageCircle aria-hidden="true" className="size-5" />
            </a>
          ) : null}

          {/* Wrapped rather than given a `hidden lg:inline-flex` class: the
              button base already sets a display, and two display utilities on
              one element resolve by stylesheet order, not by class order. */}
          {cta ? (
            <span className="hidden lg:block">
              <Link href={cta.href} className={buttonClasses({ size: "sm" })}>
                {cta.label}
              </Link>
            </span>
          ) : null}

          <button
            ref={toggleRef}
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls={panelId}
            className="inline-flex size-11 items-center justify-center rounded-full border border-line text-ink transition-colors duration-200 hover:bg-surface-muted lg:hidden"
          >
            {open ? (
              <X aria-hidden="true" className="size-5" />
            ) : (
              <Menu aria-hidden="true" className="size-5" />
            )}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={close}
            className="absolute inset-0 h-full w-full cursor-default bg-ink/40 backdrop-blur-[2px]"
          />

          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label={`${centreName} menu`}
            className="absolute inset-x-0 top-0 flex max-h-dvh flex-col overflow-y-auto rounded-b-3xl bg-surface pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-lift"
          >
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <span className="text-sm font-semibold text-ink-muted">Menu</span>
              <button
                type="button"
                data-autofocus
                onClick={() => {
                  close();
                  toggleRef.current?.focus();
                }}
                className="inline-flex size-11 items-center justify-center rounded-full border border-line text-ink transition-colors duration-200 hover:bg-surface-muted"
              >
                <X aria-hidden="true" className="size-5" />
                <span className="sr-only">Close menu</span>
              </button>
            </div>

            <nav aria-label="Mobile" className="px-5 py-4">
              <ul className="flex flex-col">
                {links.map((link) => {
                  const active = isActivePath(pathname, link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex min-h-12 items-center rounded-2xl px-4 text-base font-medium transition-colors duration-200",
                          active ? "bg-brand-soft text-brand" : "text-ink hover:bg-surface-muted",
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex flex-col gap-2.5 border-t border-line px-5 pt-4">
              {cta ? (
                <Link href={cta.href} className={buttonClasses({ fullWidth: true })}>
                  {cta.label}
                </Link>
              ) : null}
              {mobileSecondaryCta ? (
                <Link
                  href={mobileSecondaryCta.href}
                  className={buttonClasses({ variant: "secondary", fullWidth: true })}
                >
                  {mobileSecondaryCta.label}
                </Link>
              ) : null}
            </div>

            {whatsapp || phone ? (
              <div className="mt-4 flex flex-col gap-1 border-t border-line px-5 pt-4">
                <p className="pb-1 text-xs font-semibold tracking-wide text-ink-muted uppercase">
                  Talk to us
                </p>
                {whatsapp ? (
                  <a
                    href={whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("whatsapp_click", { placement: "mobile_menu" })}
                    className="flex min-h-12 items-center gap-3 rounded-2xl px-4 text-[0.9375rem] font-medium text-ink transition-colors duration-200 hover:bg-surface-muted"
                  >
                    <MessageCircle aria-hidden="true" className="size-5 text-brand" />
                    WhatsApp {whatsapp.display ? `· ${whatsapp.display}` : ""}
                  </a>
                ) : null}
                {phone ? (
                  <a
                    href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                    className="flex min-h-12 items-center gap-3 rounded-2xl px-4 text-[0.9375rem] font-medium text-ink transition-colors duration-200 hover:bg-surface-muted"
                  >
                    <Phone aria-hidden="true" className="size-5 text-brand" />
                    {phone}
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}
