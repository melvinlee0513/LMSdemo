import { ArrowRight, MessageCircle, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { IconBox } from "@/components/ui/IconBox";
import { Pill } from "@/components/ui/Pill";
import { buttonClasses } from "@/components/ui/Button";
import { SUBJECT_CATEGORY_LABELS } from "@/config/constants";
import type { Subject } from "@/config/types";
import { cn, listToSentence } from "@/lib/utils";

export type SubjectCardProps = {
  subject: Subject;
  /** Detail page link. Omitted when subject detail pages are disabled. */
  href?: string;
  whatsappHref?: string;
  tutorCount?: number;
  classCount?: number;
  /** Drives the large watermark sequence number in the split variant. */
  index?: number;
  variant?: "split" | "grid";
  className?: string;
  imagePriority?: boolean;
};

/**
 * The reference subject presentation: a pale warm illustration panel with a
 * subtle sequence watermark on the left, content and CTA on the right.
 *
 * Desktop  illustration | content
 * Mobile   illustration
 *          content
 */
export function SubjectCard({
  subject,
  href,
  whatsappHref,
  tutorCount,
  classCount,
  index,
  variant = "split",
  className,
  imagePriority = false,
}: SubjectCardProps) {
  const isSplit = variant === "split";

  return (
    <Card
      as="article"
      padding="none"
      interactive={Boolean(href)}
      className={cn("overflow-hidden", className)}
    >
      <div className={cn(isSplit && "grid gap-0 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]")}>
        {/* Illustration panel */}
        <div
          className={cn(
            "relative flex items-center justify-center overflow-hidden bg-brand-soft-2 p-6",
            isSplit ? "min-h-[200px] md:min-h-full" : "min-h-[180px]",
          )}
        >
          {typeof index === "number" ? (
            <span
              aria-hidden="true"
              className="absolute top-2 left-4 text-[5.5rem] leading-none font-extrabold text-brand/8 select-none sm:text-[7rem]"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          ) : null}

          {subject.image ? (
            <Image
              src={subject.image.src}
              alt=""
              width={subject.image.width}
              height={subject.image.height}
              sizes="(max-width: 768px) 90vw, 340px"
              priority={imagePriority}
              className="relative h-auto w-full max-w-[260px] object-contain"
            />
          ) : (
            <IconBox name={subject.icon} tone="primary" size="lg" />
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 p-5 sm:p-6 lg:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="brand" size="sm">
              {SUBJECT_CATEGORY_LABELS[subject.category]}
            </Pill>
            {typeof tutorCount === "number" && tutorCount > 0 ? (
              <Pill tone="neutral" size="sm" icon={<Users className="size-3.5" />}>
                {tutorCount} {tutorCount === 1 ? "tutor" : "tutors"}
              </Pill>
            ) : null}
            {typeof classCount === "number" && classCount > 0 ? (
              <Pill tone="neutral" size="sm">
                {classCount} weekly {classCount === 1 ? "class" : "classes"}
              </Pill>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-ink sm:text-2xl">
              {href ? (
                <Link href={href} className="after:absolute after:inset-0">
                  {subject.name}
                </Link>
              ) : (
                subject.name
              )}
            </h3>
            <p className="text-sm leading-relaxed text-ink-soft sm:text-[0.9375rem]">
              {subject.summary}
            </p>
          </div>

          <p className="text-sm text-ink-muted">
            <span className="font-medium text-ink-soft">Levels:</span>{" "}
            {listToSentence(subject.levels)}
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-1">
            {href ? (
              <Link
                href={href}
                className={buttonClasses({ variant: "primary", size: "sm" })}
              >
                Explore {subject.shortName ?? subject.name}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            ) : null}
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonClasses({ variant: "secondary", size: "sm" }),
                  "relative z-10",
                )}
              >
                <MessageCircle aria-hidden="true" className="size-4" />
                Ask about {subject.shortName ?? subject.name}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}
