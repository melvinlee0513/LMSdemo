"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useId, useRef, useState, type CSSProperties } from "react";

import { FeaturedTestimonialCard } from "@/components/cards/TestimonialCard";
import type { Testimonial } from "@/config/types";
import { cn } from "@/lib/utils";

const SWIPE_THRESHOLD = 44;

/**
 * Featured testimonial carousel.
 *
 * Manual only — nothing rotates on its own, so it never steals focus or moves
 * text someone is mid-way through reading. Changing testimonial fades and
 * shifts the card by about a dozen pixels in the direction of travel; sliding
 * a full-width card across the page would be motion for its own sake and
 * would drag the layout with it.
 *
 * Controls are real buttons with labels, the region is announced politely,
 * and on touch devices a horizontal swipe moves between quotes. The swipe is
 * a handful of pointer events rather than a gesture library.
 */
export function TestimonialCarousel({
  testimonials,
  subjectNames,
  note,
}: {
  testimonials: Testimonial[];
  subjectNames: Record<string, string>;
  /** Small print, e.g. a permission notice. */
  note?: string;
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const regionId = useId();
  const touchStartX = useRef<number | null>(null);

  if (testimonials.length === 0) return null;

  const total = testimonials.length;
  const current = testimonials[index] ?? testimonials[0]!;

  const go = (next: number, travel: number) => {
    setDirection(travel);
    setIndex(((next % total) + total) % total);
  };

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start === null || total < 2) return;

    const delta = (event.changedTouches[0]?.clientX ?? start) - start;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;

    go(index + (delta < 0 ? 1 : -1), delta < 0 ? 1 : -1);
  };

  return (
    <div className="flex flex-col gap-5">
      <div
        id={regionId}
        aria-live="polite"
        aria-atomic="true"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          // Keyed so the entrance replays on every change; the direction of
          // travel decides which side it arrives from.
          key={current.id}
          className="carousel-item"
          style={
            { "--carousel-from": `${direction * 14}px` } as CSSProperties
          }
        >
          <FeaturedTestimonialCard
            testimonial={current}
            subjectName={current.subject ? subjectNames[current.subject] : undefined}
          />
        </div>
      </div>

      {total > 1 ? (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-ink-muted tabular-nums">
            {index + 1} of {total}
          </p>

          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5"
              role="tablist"
              aria-label="Choose a testimonial"
            >
              {testimonials.map((testimonial, dotIndex) => (
                <button
                  key={testimonial.id}
                  type="button"
                  role="tab"
                  aria-selected={dotIndex === index}
                  aria-controls={regionId}
                  onClick={() => go(dotIndex, dotIndex > index ? 1 : -1)}
                  className="inline-flex size-11 items-center justify-center rounded-full"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "block h-2 rounded-full transition-all duration-[var(--motion-normal)] ease-[var(--ease-emphasized)]",
                      dotIndex === index ? "w-6 bg-brand" : "w-2 bg-line",
                    )}
                  />
                  <span className="sr-only">
                    Testimonial {dotIndex + 1} from {testimonial.author}
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => go(index - 1, -1)}
              aria-controls={regionId}
              className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors duration-[var(--motion-normal)] hover:bg-brand-soft hover:text-brand active:scale-95"
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
              <span className="sr-only">Previous testimonial</span>
            </button>

            <button
              type="button"
              onClick={() => go(index + 1, 1)}
              aria-controls={regionId}
              className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors duration-[var(--motion-normal)] hover:bg-brand-soft hover:text-brand active:scale-95"
            >
              <ChevronRight aria-hidden="true" className="size-5" />
              <span className="sr-only">Next testimonial</span>
            </button>
          </div>
        </div>
      ) : null}

      {note ? <p className="text-xs text-ink-muted">{note}</p> : null}
    </div>
  );
}
