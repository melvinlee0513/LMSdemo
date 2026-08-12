import { ArrowRight, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
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
  className?: string;
};

/**
 * Branch card built for local SEO as much as for UX: name, address and phone
 * are rendered as real, consistent, crawlable text inside an <address>.
 */
export function LocationCard({
  location,
  centreName,
  href,
  whatsappHref,
  subjectNames,
  className,
}: LocationCardProps) {
  return (
    <Card
      as="article"
      padding="none"
      interactive={Boolean(href)}
      className={cn("relative flex h-full flex-col overflow-hidden", className)}
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
        <div className="flex flex-wrap items-center gap-2">
          {location.isPrimary ? <Pill tone="brand" size="sm">Main branch</Pill> : null}
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

        <address className="flex flex-col gap-2.5 text-sm text-ink-soft">
          <span className="flex gap-2.5">
            <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
            <span>
              {location.addressLines.join(", ")}, {location.postcode} {location.city},{" "}
              {location.state}
            </span>
          </span>

          {location.phone ? (
            <span className="flex gap-2.5">
              <Phone aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
              <a
                href={`tel:${location.phone.replace(/[^\d+]/g, "")}`}
                className="relative z-10 transition-colors duration-200 hover:text-brand"
              >
                {location.phone}
              </a>
            </span>
          ) : null}

          {location.email ? (
            <span className="flex gap-2.5">
              <Mail aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
              <a
                href={`mailto:${location.email}`}
                className="relative z-10 break-all transition-colors duration-200 hover:text-brand"
              >
                {location.email}
              </a>
            </span>
          ) : null}
        </address>

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

        {subjectNames?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {subjectNames.map((name) => (
              <Pill key={name} tone="neutral" size="sm">
                {name}
              </Pill>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex flex-wrap gap-2.5 pt-1">
          {href ? (
            <Link href={href} className={buttonClasses({ variant: "primary", size: "sm" })}>
              Branch details
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
              WhatsApp this branch
            </a>
          ) : null}
          {location.mapUrl ? (
            <a
              href={location.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex h-11 items-center rounded-full px-3 text-sm font-semibold text-brand transition-colors duration-200 hover:bg-brand-soft"
            >
              Open in maps
            </a>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
