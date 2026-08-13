"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

/**
 * ---------------------------------------------------------------------------
 * InView
 * ---------------------------------------------------------------------------
 * The single entrance-animation trigger for the whole site.
 *
 * It renders `data-anim="idle"` on the server and flips it to `"run"` the
 * first time the element reaches the viewport. Every entrance effect in
 * `globals.css` is written as `[data-anim="run"] .thing { animation: … }`,
 * which means:
 *
 *   • the content is fully present and styled correctly without JavaScript;
 *   • the animation's hidden start state lives in the keyframes, not in the
 *     base styles, so nothing can ever be left invisible;
 *   • one observer per animated block, disconnected after it fires;
 *   • no React state, so triggering costs zero re-renders.
 *
 * Children are passed through untouched, so server components stay server
 * components inside it.
 */
export function InView({
  as: Component = "div",
  children,
  className,
  style,
  /** Fraction of the element that must be visible before it triggers. */
  amount = 0.2,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  amount?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const run = () => {
      element.dataset.anim = "run";
    };

    if (typeof IntersectionObserver === "undefined") {
      run();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            run();
            observer.disconnect();
          }
        }
      },
      { threshold: amount, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [amount]);

  return (
    <Component ref={ref} data-anim="idle" className={className} style={style}>
      {children}
    </Component>
  );
}
