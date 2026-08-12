import { Quote } from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Rating } from "@/components/ui/Rating";
import type { Testimonial } from "@/config/types";
import { cn } from "@/lib/utils";

/**
 * Grid testimonial. Ratings and outcomes render only when supplied — a
 * centre that has not collected ratings simply shows the quote.
 */
export function TestimonialCard({
  testimonial,
  subjectName,
  className,
}: {
  testimonial: Testimonial;
  subjectName?: string;
  className?: string;
}) {
  return (
    <Card
      as="figure"
      padding="md"
      className={cn("flex h-full flex-col gap-4", className)}
    >
      {testimonial.rating !== undefined ? (
        <Rating value={testimonial.rating} showValue={false} />
      ) : null}

      <blockquote className="flex-1 text-[0.9375rem] leading-relaxed text-ink-soft">
        <p>&ldquo;{testimonial.quote}&rdquo;</p>
      </blockquote>

      {/* Wraps rather than squeezing: on a 390px screen the subject chip drops
          to its own line instead of pushing the card past the viewport. */}
      <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line pt-4">
        <Avatar image={testimonial.avatar} name={testimonial.author} size={44} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">
            {testimonial.author}
          </p>
          <p className="truncate text-xs text-ink-muted">
            {testimonial.context ??
              (testimonial.authorType === "parent" ? "Parent" : "Student")}
          </p>
        </div>
        {subjectName ? (
          <Pill tone="neutral" size="sm" className="ml-auto">
            {subjectName}
          </Pill>
        ) : null}
      </figcaption>
    </Card>
  );
}

/**
 * The large featured testimonial used at the top of the testimonials section
 * and inside the carousel.
 */
export function FeaturedTestimonialCard({
  testimonial,
  subjectName,
  className,
}: {
  testimonial: Testimonial;
  subjectName?: string;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-3xl border border-line-warm bg-surface p-6 shadow-soft sm:p-8 lg:p-10",
        className,
      )}
    >
      <Quote
        aria-hidden="true"
        className="absolute top-6 right-6 size-16 text-brand/8 sm:size-24"
        strokeWidth={1.5}
      />

      <div className="relative flex flex-col gap-6">
        {testimonial.rating !== undefined ? (
          <Rating value={testimonial.rating} showValue={false} />
        ) : null}

        <blockquote className="text-lg leading-relaxed font-medium text-ink text-balance sm:text-xl lg:text-2xl">
          <p>&ldquo;{testimonial.quote}&rdquo;</p>
        </blockquote>

        <figcaption className="flex flex-wrap items-center gap-4">
          <Avatar image={testimonial.avatar} name={testimonial.author} size={56} />
          <div>
            <p className="font-semibold text-ink">{testimonial.author}</p>
            <p className="text-sm text-ink-muted">
              {testimonial.context ??
                (testimonial.authorType === "parent" ? "Parent" : "Student")}
              {testimonial.year ? ` · ${testimonial.year}` : ""}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:ml-auto">
            {subjectName ? <Pill tone="brand">{subjectName}</Pill> : null}
            {testimonial.outcome ? (
              <Pill tone="success">{testimonial.outcome}</Pill>
            ) : null}
          </div>
        </figcaption>
      </div>
    </figure>
  );
}
