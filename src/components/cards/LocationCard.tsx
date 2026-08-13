import { ArrowRight, Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { buttonClasses } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import type { CentreLocation } from "@/config/types";
import { cn } from "@/lib/utils";

export type LocationCardProps = {
  location: CentreLocation;
  centreName: string;
  href?: string;
  whatsappHref?: string;
  subjectNames?: string[];
  classCount?: number;
  className?: string;
};

/**
 * A branch card is a conversion endpoint, not a corporate office listing, so
 * it is ordered the way a parent decides:
 *
 *   1. which branch is this      name + area
 *   2. where exactly             address
 *   3. is my subject taught      subjects and weekly class count
 *   4. when can we come          opening hours
 *   5. how do I get there / ask  directions, WhatsApp, branch details
 *
 * The address stays in a real <address> element with the same wording used in
 * the footer and on the branch page — consistent NAP is what local search
 * actually rewards.
 */
export function LocationCard({
  location,
  centreName,
  href,
  whatsappHref,
  subjectNames,
  classCount,
  className,
}: LocationCardProps) {
  const phoneHref = location.phone
    ? `tel:${location.phone.replace(/[^\d+]/g, "")}`
    : undefined;

  return (
    <Card
      as="article"
      padding="none"
      interactive={Boolean(href)}
      className={cn("flex h-full flex-col overflow-hidden", className)}
    >
      {location.image ? (
        <Image
          src={location.image.src}
          alt={location.image.alt}
          width={location.image.width}
          height={location.image.height}
          sizes="(max-width: 768px) 90vw, 560px"
          className="aspect-3/2 w-full object-cover"
        />
      ) : null}

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        {/* 1 — which branch */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {location.isPrimary ? (
              <Pill tone="brand" size="sm">
                Main branch
              </Pill>
            ) : null}
            <Pill tone="outline" size="sm">
              {location.city}
            </Pill>
          </div>

          <h3 className="text-xl font-bold text-ink">
            {href ? (
              <Link href={href} className="after:absolute after:inset-0">
                {centreName} — {location.name}
              </Link>
            ) : (
              `${centreName} — ${location.name}`
            )}
          </h3>
        </div>

        {/* 2 — where exactly */}
        <address className="flex gap-2.5 text-sm text-ink-soft">
          <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
          <span>
            {location.addressLines.join(", ")}, {location.postcode} {location.city},{" "}
            {location.state}
          </span>
        </address>

        {/* 3 — what runs here */}
        {subjectNames?.length ? (
          <div className="flex flex-col gap-2">
            {typeof classCount === "number" && classCount > 0 ? (
              <p className="text-sm font-medium text-ink">
                {classCount} weekly {classCount === 1 ? "class" : "classes"} across{" "}
                {subjectNames.length} {subjectNames.length === 1 ? "subject" : "subjects"}
              </p>
            ) : null}
            <ul className="flex flex-wrap gap-1.5">
              {subjectNames.map((name) => (
                <li key={name}>
                  <Pill tone="neutral" size="sm">
                    {name}
                  </Pill>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* 4 — when */}
        {location.hours?.length ? (
          <div className="flex gap-2.5 text-sm">
            <Clock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
            <dl className="flex flex-col gap-1">
              {location.hours.map((entry) => (
                <div key={entry.label} className="flex flex-wrap gap-x-2">
                  <dt className="text-ink-muted">{entry.label}</dt>
                  <dd className="font-medium text-ink-soft">{entry.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}

        {/* 5 — act */}
        <div className="mt-auto flex flex-wrap gap-2.5 pt-1">
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonClasses({ size: "sm" }), "relative z-10")}
            >
              <MessageCircle aria-hidden="true" className="size-4" />
              WhatsApp this branch
            </a>
          ) : null}

          {location.mapUrl ? (
            <a
              href={location.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonClasses({ variant: "secondary", size: "sm" }),
                "relative z-10",
              )}
            >
              Get directions
            </a>
          ) : phoneHref ? (
            <a
              href={phoneHref}
              className={cn(
                buttonClasses({ variant: "secondary", size: "sm" }),
                "relative z-10",
              )}
            >
              <Phone aria-hidden="true" className="size-4" />
              {location.phone}
            </a>
          ) : null}

          {href ? (
            <Link
              href={href}
              className="relative z-10 inline-flex h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-brand transition-colors duration-[var(--motion-normal)] hover:bg-brand-soft"
            >
              Branch details
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
