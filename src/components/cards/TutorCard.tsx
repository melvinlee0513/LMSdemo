import { MessageCircle } from "lucide-react";
import Image from "next/image";

import { Pill } from "@/components/ui/Pill";
import { Rating } from "@/components/ui/Rating";
import type { Subject, Tutor } from "@/config/types";
import { cn } from "@/lib/utils";

export type TutorCardProps = {
  tutor: Tutor;
  subjects: Subject[];
  whatsappHref?: string;
  variant?: "portrait-card" | "portrait-overlay";
  className?: string;
  imagePriority?: boolean;
};

/**
 * Two genuinely different presentations of the same data:
 *
 *   portrait-card     portrait above, details on a white card below
 *   portrait-overlay  full-bleed portrait with details over a soft scrim
 *
 * Numbers (years, students, rating) render only when the centre supplied
 * them — never invented, never zero-filled.
 */
export function TutorCard({
  tutor,
  subjects,
  whatsappHref,
  variant = "portrait-card",
  className,
  imagePriority = false,
}: TutorCardProps) {
  const subjectNames = subjects.map((subject) => subject.shortName ?? subject.name);

  if (variant === "portrait-overlay") {
    return (
      <article
        className={cn(
          "group relative overflow-hidden rounded-3xl border border-line bg-ink shadow-soft",
          "transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lift",
          className,
        )}
      >
        <Image
          src={tutor.image.src}
          alt={tutor.image.alt}
          width={tutor.image.width}
          height={tutor.image.height}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
          priority={imagePriority}
          className="aspect-4/5 w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 via-black/55 to-transparent p-5 pt-16">
          <div className="flex flex-wrap gap-1.5">
            {subjectNames.slice(0, 2).map((name) => (
              <Pill key={name} tone="inverse" size="sm">
                {name}
              </Pill>
            ))}
          </div>
          <h3 className="mt-3 text-lg font-bold text-white">{tutor.name}</h3>
          {tutor.role ? (
            <p className="text-sm text-white/70">{tutor.role}</p>
          ) : null}
          <TutorFacts tutor={tutor} tone="dark" className="mt-3" />
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-soft",
        "transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-line-warm hover:shadow-lift",
        className,
      )}
    >
      <div className="relative bg-brand-soft-2">
        <Image
          src={tutor.image.src}
          alt={tutor.image.alt}
          width={tutor.image.width}
          height={tutor.image.height}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
          priority={imagePriority}
          className="aspect-4/5 w-full object-cover"
        />
        {tutor.rating !== undefined ? (
          <span className="absolute top-3 right-3 rounded-full bg-white/95 px-2.5 py-1 shadow-soft">
            <Rating value={tutor.rating} size="sm" label={`Rated ${tutor.rating} out of 5`} />
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap gap-1.5">
          {subjectNames.slice(0, 2).map((name) => (
            <Pill key={name} tone="brand" size="sm">
              {name}
            </Pill>
          ))}
        </div>

        <div>
          <h3 className="text-lg font-bold text-ink">{tutor.name}</h3>
          {tutor.role ? <p className="text-sm text-ink-muted">{tutor.role}</p> : null}
        </div>

        <p className="line-clamp-3 text-sm leading-relaxed text-ink-soft">{tutor.bio}</p>

        <TutorFacts tutor={tutor} tone="light" className="mt-auto pt-1" />

        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-1.5 self-start rounded-full px-3 text-sm font-semibold text-brand transition-colors duration-200 hover:bg-brand-soft"
          >
            <MessageCircle aria-hidden="true" className="size-4" />
            <span>
              Ask about {tutor.name.split(" ")[0]}
              <span className="sr-only">&rsquo;s classes</span>
            </span>
          </a>
        ) : null}
      </div>
    </article>
  );
}

function TutorFacts({
  tutor,
  tone,
  className,
}: {
  tutor: Tutor;
  tone: "light" | "dark";
  className?: string;
}) {
  const facts: { label: string; value: string }[] = [];

  if (tutor.yearsExperience !== undefined) {
    facts.push({ label: "Experience", value: `${tutor.yearsExperience} yrs` });
  }
  if (tutor.studentsTaught !== undefined) {
    facts.push({
      label: "Students taught",
      value: `${tutor.studentsTaught.toLocaleString("en-MY")}+`,
    });
  }

  if (facts.length === 0) return null;

  return (
    <dl className={cn("flex flex-wrap gap-x-5 gap-y-1 text-sm", className)}>
      {facts.map((fact) => (
        <div key={fact.label} className="flex items-baseline gap-1.5">
          <dt className={cn(tone === "dark" ? "text-white/60" : "text-ink-muted")}>
            {fact.label}:
          </dt>
          <dd className={cn("font-semibold", tone === "dark" ? "text-white" : "text-ink")}>
            {fact.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
