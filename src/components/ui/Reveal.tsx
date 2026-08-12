"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Subtle fade + translate on first view.
 *
 * IntersectionObserver plus two CSS rules — no animation library for what is
 * fundamentally a transition. The observer writes the `data-revealed`
 * attribute straight to the DOM rather than going through React state: it is
 * a one-way update to an external system, so it costs no re-render.
 *
 * `prefers-reduced-motion` disables the effect entirely in CSS.
 */
export function Reveal({
  as: Component = "div",
  children,
  className,
  delay = 0,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Stagger in milliseconds. Keep small — this is punctuation, not a show. */
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reveal = () => {
      element.dataset.revealed = "true";
    };

    if (typeof IntersectionObserver === "undefined") {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal();
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Component
      ref={ref}
      className={cn("reveal", className)}
      data-revealed="false"
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Component>
  );
}
