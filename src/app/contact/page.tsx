import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SocialIcon, socialLabel, type SocialNetwork } from "@/components/ui/SocialIcon";
import { buildMetadata, pageDescription } from "@/lib/seo";
import { getCentre, getSiteMode } from "@/lib/site";
import { breadcrumbSchema, structuredDataEnabled } from "@/lib/structured-data";
import { subjectOptions } from "@/lib/view-models";
import { whatsappHref } from "@/lib/whatsapp";

export function generateMetadata(): Metadata {
  const centre = getCentre();
  const where = centre.identity.city ? ` in ${centre.identity.city}` : "";

  return buildMetadata({
    title: "Contact the Centre",
    description: pageDescription(
      "contact",
      `Get in touch with ${centre.identity.name}${where} — WhatsApp, phone, email or the enquiry form. Branch addresses and opening hours included.`,
    ),
    path: "/contact",
  });
}

export default function ContactPage() {
  const centre = getCentre();
  const whatsapp = centre.featureFlags.whatsapp ? centre.whatsapp : undefined;
  const chatHref = whatsappHref(whatsapp, "general", { centre: centre.identity.name });

  /**
   * Channels are rendered in the centre's configured priority order. Most
   * Malaysian tuition centres want WhatsApp first — but it stays configurable.
   */
  const channels = centre.contact.priority
    .map((channel) => {
      switch (channel) {
        case "whatsapp":
          return chatHref
            ? {
                key: channel,
                icon: MessageCircle,
                title: "WhatsApp",
                value: whatsapp?.displayNumber ?? "Message us",
                href: chatHref,
                external: true,
                hint: "Usually the fastest way to reach us.",
              }
            : null;
        case "phone":
          return centre.contact.phone
            ? {
                key: channel,
                icon: Phone,
                title: "Phone",
                value: centre.contact.phone,
                href: `tel:${centre.contact.phone.replace(/[^\d+]/g, "")}`,
                external: false,
                hint: "During centre opening hours.",
              }
            : null;
        case "form":
          return centre.featureFlags.enquiryForm
            ? {
                key: channel,
                icon: Send,
                title: "Enquiry form",
                value: "Send us a message",
                href: "#enquiry",
                external: false,
                hint: "We reply within one working day.",
              }
            : null;
        case "email":
          return centre.contact.email
            ? {
                key: channel,
                icon: Mail,
                title: "Email",
                value: centre.contact.email,
                href: `mailto:${centre.contact.email}`,
                external: false,
                hint: "Best for longer questions.",
              }
            : null;
        default:
          return null;
      }
    })
    .filter((channel): channel is NonNullable<typeof channel> => channel !== null);

  const socials = Object.entries(centre.social).filter(
    (entry): entry is [SocialNetwork, string] => typeof entry[1] === "string",
  );

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Not sure which class is the right fit?"
        highlight="the right fit?"
        highlightAnimation="drop"
        description="Tell us your child's form and subject. We'll point you in the right direction — including when we're not the right centre for what you need."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />

      {/* Channels */}
      <Section tone="surface" spacing="compact">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((channel) => (
            <li key={channel.key} className="h-full">
              <Card padding="md" interactive className="relative h-full">
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <channel.icon aria-hidden="true" className="size-5" />
                </span>
                <h2 className="mt-4 text-base font-bold text-ink">
                  {channel.external ? (
                    <a
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="after:absolute after:inset-0"
                    >
                      {channel.title}
                    </a>
                  ) : (
                    <Link href={channel.href} className="after:absolute after:inset-0">
                      {channel.title}
                    </Link>
                  )}
                </h2>
                <p className="mt-1 text-sm font-medium break-words text-ink-soft">
                  {channel.value}
                </p>
                <p className="mt-1 text-xs text-ink-muted">{channel.hint}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      {/* Form + branch details */}
      <Section tone="warm" id="enquiry">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
          {centre.featureFlags.enquiryForm ? (
            <div className="flex flex-col gap-6">
              <SectionHeader
                eyebrow="Enquiry form"
                heading="Send an enquiry"
                highlight="an enquiry"
                description="Prefer to type it out? Tell us what you need and we'll reply on WhatsApp."
                align="left"
                headingId="enquiry-heading"
              />

              <EnquiryForm
                chrome={{
                  mode: getSiteMode(),
                  privacyNotice: centre.forms.privacyNotice,
                  successTitle: centre.forms.successTitle,
                  successBody: centre.forms.successBody,
                  whatsappHref: chatHref,
                }}
                subjectOptions={subjectOptions(centre)}
                consentLabel={centre.forms.consentLabel}
              />
            </div>
          ) : null}

          <div className="flex flex-col gap-5">
            {centre.contact.hours?.length ? (
              <Card padding="md">
                <h2 className="text-base font-bold text-ink">Opening hours</h2>
                <dl className="mt-3 flex flex-col gap-1.5 text-sm">
                  {centre.contact.hours.map((entry) => (
                    <div key={entry.label} className="flex justify-between gap-4">
                      <dt className="text-ink-muted">{entry.label}</dt>
                      <dd className="font-medium text-ink-soft">{entry.value}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
            ) : null}

            {centre.featureFlags.locations && centre.locations.length > 0 ? (
              <Card padding="md">
                <h2 className="text-base font-bold text-ink">
                  {centre.locations.length > 1 ? "Our branches" : "Find us"}
                </h2>
                <ul className="mt-3 flex flex-col gap-4">
                  {centre.locations.map((location) => (
                    <li key={location.slug} className="flex gap-3 text-sm">
                      <MapPin
                        aria-hidden="true"
                        className="mt-0.5 size-4.5 shrink-0 text-brand"
                      />
                      <address className="text-ink-soft">
                        <span className="font-semibold text-ink">{location.name}</span>
                        <br />
                        {location.addressLines.join(", ")}, {location.postcode}{" "}
                        {location.city}, {location.state}
                        {centre.featureFlags.locationDetailPages ? (
                          <>
                            <br />
                            <Link
                              href={`/locations/${location.slug}`}
                              className="font-semibold text-brand underline underline-offset-4"
                            >
                              Branch details
                            </Link>
                          </>
                        ) : null}
                      </address>
                    </li>
                  ))}
                </ul>
              </Card>
            ) : null}

            {socials.length > 0 ? (
              <Card padding="md">
                <h2 className="text-base font-bold text-ink">Follow the centre</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {socials.map(([network, url]) => (
                    <li key={network}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-semibold text-ink-soft transition-colors duration-200 hover:bg-brand-soft hover:text-brand"
                      >
                        <SocialIcon network={network} className="size-4" />
                        {socialLabel(network)}
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            ) : null}
          </div>
        </div>
      </Section>

      {structuredDataEnabled() ? (
        <JsonLd
          data={breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ])}
        />
      ) : null}
    </>
  );
}
