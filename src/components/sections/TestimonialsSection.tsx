import { ArrowRight } from "lucide-react";

import { TestimonialCard } from "@/components/cards/TestimonialCard";
import { TestimonialCarousel } from "@/components/sections/TestimonialCarousel";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Centre } from "@/config/types";
import { featuredTestimonials } from "@/lib/content";
import { sectionCopy } from "@/lib/section-copy";

/**
 * Testimonials.
 *
 *   featured-carousel  one large quote with manual controls
 *   grid               responsive card grid
 *   featured-and-grid  both — carousel first, then supporting cards
 *
 * The permission note is deliberately microcopy rather than the section's
 * marketing sentence: it matters, but it is not what a parent came to read.
 */
export function TestimonialsSection({
  centre,
  limit = 3,
  showAllLink = true,
}: {
  centre: Centre;
  limit?: number;
  showAllLink?: boolean;
}) {
  if (!centre.featureFlags.testimonials || centre.testimonials.length === 0) return null;

  const variant = centre.componentVariants.testimonials;
  const featured = featuredTestimonials(centre);
  const carouselItems = featured.length > 0 ? featured : centre.testimonials.slice(0, 2);

  const gridItems = centre.testimonials
    .filter((testimonial) => !carouselItems.includes(testimonial))
    .slice(0, limit);

  const subjectNames = Object.fromEntries(
    centre.subjects.map((subject) => [subject.slug, subject.shortName ?? subject.name]),
  );

  const copy = sectionCopy(centre, "testimonials", {
    eyebrow: "In their words",
    heading: "What students and parents say",
    highlight: "students and parents",
    highlightAnimation: "drop",
    description: "Real feedback from families who learn with us.",
  });

  const showCarousel = variant !== "grid";
  const showGrid = variant !== "featured-carousel" && gridItems.length > 0;

  return (
    <Section tone="soft" ariaLabelledBy="testimonials-heading">
      <SectionHeader
        eyebrow={copy.eyebrow}
        heading={copy.heading}
        highlight={copy.highlight}
        highlightAnimation={copy.highlightAnimation}
        description={copy.description}
        headingId="testimonials-heading"
      />

      <div className="mt-10 flex flex-col gap-6 sm:mt-12">
        {showCarousel ? (
          <TestimonialCarousel
            testimonials={carouselItems}
            subjectNames={subjectNames}
            note="Testimonials shown with permission."
          />
        ) : null}

        {showGrid ? (
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {(variant === "grid" ? centre.testimonials.slice(0, limit) : gridItems).map(
              (testimonial, index) => (
                <Reveal as="li" key={testimonial.id} delay={index * 70} className="h-full">
                  <TestimonialCard
                    testimonial={testimonial}
                    subjectName={
                      testimonial.subject ? subjectNames[testimonial.subject] : undefined
                    }
                  />
                </Reveal>
              ),
            )}
          </ul>
        ) : null}
      </div>

      {showAllLink && centre.testimonials.length > gridItems.length + carouselItems.length ? (
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/testimonials" variant="secondary">
            Read all {centre.testimonials.length} stories
            <ArrowRight aria-hidden="true" className="size-4" />
          </ButtonLink>
        </div>
      ) : null}
    </Section>
  );
}
