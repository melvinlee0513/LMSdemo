"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * ---------------------------------------------------------------------------
 * SubjectStack
 * ---------------------------------------------------------------------------
 * Progressive stacking for the subject cards: each card sticks below the site
 * header as it is reached, and earlier cards stay visible as thin layers
 * behind it.
 *
 * The stacking itself is pure CSS (`position: sticky` with a per-card offset
 * from `--i`), gated by a media query to viewports with genuine room for it.
 * Below 768px wide or 680px tall the cards stay in normal document flow —
 * usability beats showing off the effect, and a full-height sticky card on a
 * short phone is how you trap someone's scroll.
 *
 * This component adds only the depth cue: marking a card as receded once the
 * following card has taken the top slot. That needs the *position* of the
 * next card relative to its sticky line, which IntersectionObserver cannot
 * report — it reports area crossings, not positions. So it uses a scroll
 * listener that is:
 *
 *   • gated by an observer, so it is only attached while the stack is near
 *     the viewport at all;
 *   • throttled to one rAF, reading a handful of rects per frame;
 *   • detached entirely below the media-query breakpoint and under reduced
 *     motion, where the effect does not apply.
 *
 * Children are passed in as an array of already-rendered server components, so
 * nothing about the subject cards themselves moves to the client.
 */
export function SubjectStack({
  items,
  enabled = true,
  className,
}: {
  items: ReactNode[];
  enabled?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const list = ref.current;
    if (!list) return;
    if (typeof IntersectionObserver === "undefined") return;

    const canStack = window.matchMedia("(min-width: 768px) and (min-height: 680px)");
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;
    let listening = false;
    let cards: HTMLElement[] = [];
    let lines: number[] = [];

    /** Sticky offsets resolve from calc() to px in computed style. */
    const measure = () => {
      cards = Array.from(list.querySelectorAll<HTMLElement>("[data-stack-card]"));
      lines = cards.map((card) => Number.parseFloat(getComputedStyle(card).top) || 0);
    };

    const update = () => {
      frame = 0;
      for (let index = 0; index < cards.length; index += 1) {
        const card = cards[index];
        const next = cards[index + 1];
        if (!card) continue;

        // The last card never recedes — there is nothing in front of it.
        if (!next) {
          card.dataset.stacked = "false";
          continue;
        }

        const line = lines[index + 1] ?? 0;
        card.dataset.stacked =
          next.getBoundingClientRect().top <= line + 1 ? "true" : "false";
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    const clear = () => {
      for (const card of cards) card.dataset.stacked = "false";
    };

    const setListening = (next: boolean) => {
      if (next === listening) return;
      listening = next;

      if (next) {
        measure();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize, { passive: true });
        update();
      } else {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        clear();
      }
    };

    function onResize() {
      measure();
      onScroll();
    }

    const sync = (nearViewport: boolean) => {
      setListening(nearViewport && canStack.matches && !prefersReduced.matches);
    };

    const gate = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) sync(entry.isIntersecting);
      },
      { rootMargin: "300px 0px 300px 0px" },
    );

    gate.observe(list);

    const onMediaChange = () => sync(listening || canStack.matches);
    canStack.addEventListener("change", onMediaChange);
    prefersReduced.addEventListener("change", onMediaChange);

    return () => {
      gate.disconnect();
      canStack.removeEventListener("change", onMediaChange);
      prefersReduced.removeEventListener("change", onMediaChange);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) {
    return (
      <ul className={cn("grid gap-5", className)}>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <ul ref={ref} className={cn("grid gap-5 md:gap-6", className)}>
      {items.map((item, index) => (
        <li
          key={index}
          data-stack-card
          data-stacked="false"
          className="stack-item"
          style={{ "--i": String(index) } as CSSProperties}
        >
          <div className="stack-inner">{item}</div>
        </li>
      ))}
    </ul>
  );
}
