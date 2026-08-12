import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TestimonialCard } from "@/components/cards/TestimonialCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { FinalCtaSection } from "@/components/sections/CtaSection";
import { TestimonialCarousel } from "@/components/sections/TestimonialCarousel";
import { JsonLd } from "@/components/seo/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { featuredTestimonials } from "@/lib/content";
import { buildMetadata, pageDescription } from "@/lib/seo";
import { getCentre } from "@/lib/site";
import { breadcrumbSchema, structuredDataEnabled } from "@/lib/structured-data";

export function generateMetadata(): Metadata {
  const centre = getCentre();

  return buildMetadata({
    title: "Student & Parent Stories",
    description: pageDescription(
      "testimonials",
      `What students and parents say about studying at ${centre.identity.name} — published with their permission.`,
    ),
    path: "/testimonials",
    noindex: !centre.featureFlags.testimonials || centre.testimonials.length === 0,
  });
}

export default function TestimonialsPage() {
  const centre = getCentre();
  if (!centre.featureFlags.testimonials) notFound();

  const featured = featuredTestimonials(centre);
  const subjectNames = Object.fromEntries(
    centre.subjects.map((subject) => [subject.slug, subject.shortName ?? subject.name]),
  );

  const students = centre.testimonials.filter((item) => item.authorType === "student");
  const parents = centre.testimonials.filter((item) => item.authorType === "parent");

  return (
    <>
      <PageHeader
        eyebrow="In their words"
        title="What students and parents tell us"
        highlight="students and parents"
        description="Every quote below was given by a family who studied with us and is published with their permission. We do not write testimonials on anyone's behalf."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Testimonials", path: "/testimonials" },
        ]}
      />

      {featured.length > 0 ? (
        <Section tone="soft" ariaLabel="Featured testimonials">
          <TestimonialCarousel testimonials={featured} subjectNames={subjectNames} />
        </Section>
      ) : null}

      {students.length > 0 ? (
        <Section tone="surface" ariaLabelledBy="student-stories-heading">
          <SectionHeader
            eyebrow="From students"
            heading="Students on what changed for them"
            highlight="what changed"
            headingId="student-stories-heading"
            align="left"
          />
          <ul className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-2 lg:grid-cols-3">
            {students.map((testimonial, index) => (
              <Reveal as="li" key={testimonial.id} delay={index * 60} className="h-full">
                <TestimonialCard
                  testimonial={testimonial}
                  subjectName={
                    testimonial.subject ? subjectNames[testimonial.subject] : undefined
                  }
                />
              </Reveal>
            ))}
          </ul>
        </Section>
      ) : null}

      {parents.length > 0 ? (
        <Section tone="warm" ariaLabelledBy="parent-stories-heading">
          <SectionHeader
            eyebrow="From parents"
            heading="Parents on how it worked at home"
            highlight="how it worked at home"
            headingId="parent-stories-heading"
            align="left"
          />
          <ul className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-2 lg:grid-cols-3">
            {parents.map((testimonial, index) => (
              <Reveal as="li" key={testimonial.id} delay={index * 60} className="h-full">
                <TestimonialCard
                  testimonial={testimonial}
                  subjectName={
                    testimonial.subject ? subjectNames[testimonial.subject] : undefined
                  }
                />
              </Reveal>
            ))}
          </ul>
        </Section>
      ) : null}

      <FinalCtaSection centre={centre} />

      {structuredDataEnabled() ? (
        <JsonLd
          data={breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Testimonials", path: "/testimonials" },
          ])}
        />
      ) : null}
    </>
  );
}
