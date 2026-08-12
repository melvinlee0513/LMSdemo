"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useId, useState } from "react";

import { FeaturedTestimonialCard } from "@/components/cards/TestimonialCard";
import type { Testimonial } from "@/config/types";
import { cn } from "@/lib/utils";

/**
 * Featured testimonial carousel.
 *
 * Manual only — nothing rotates on its own, so it never steals focus or moves
 * text a visitor is mid-way through reading. Controls are real buttons with
 * labels, and the live region announces each change.
 */
export function TestimonialCarousel({
  testimonials,
  subjectNames,
}: {
  testimonials: Testimonial[];
  subjectNames: Record<string, string>;
}) {
  const [index, setIndex] = useState(0);
  const regionId = useId();

  if (testimonials.length === 0) return null;

  const total = testimonials.length;
  const current = testimonials[index] ?? testimonials[0]!;

  const go = (next: number) => setIndex(((next % total) + total) % total);

  return (
    <div className="flex flex-col gap-5">
      <div id={regionId} aria-live="polite" aria-atomic="true">
        <FeaturedTestimonialCard
          testimonial={current}
          subjectName={current.subject ? subjectNames[current.subject] : undefined}
        />
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
                  onClick={() => setIndex(dotIndex)}
                  className="inline-flex size-11 items-center justify-center rounded-full"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "block h-2 rounded-full transition-all duration-200",
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
              onClick={() => go(index - 1)}
              aria-controls={regionId}
              className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors duration-200 hover:bg-brand-soft hover:text-brand"
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
              <span className="sr-only">Previous testimonial</span>
            </button>

            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-controls={regionId}
              className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors duration-200 hover:bg-brand-soft hover:text-brand"
            >
              <ChevronRight aria-hidden="true" className="size-5" />
              <span className="sr-only">Next testimonial</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
