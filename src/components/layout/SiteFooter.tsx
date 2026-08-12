import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/ui/Container";
import { SocialIcon, socialLabel, type SocialNetwork } from "@/components/ui/SocialIcon";
import { primaryLocation } from "@/lib/content";
import { footerGroups } from "@/lib/navigation";
import { getCentre, isDemo } from "@/lib/site";
import { whatsappHref } from "@/lib/whatsapp";

/**
 * Dark charcoal footer. Groups are derived from enabled features unless the
 * centre configured its own, so a disabled route never leaves a dead link.
 */
export function SiteFooter() {
  const centre = getCentre();
  const groups = footerGroups(centre);
  const branch = primaryLocation(centre);
  const whatsapp = centre.featureFlags.whatsapp ? centre.whatsapp : undefined;
  const chatHref = whatsappHref(whatsapp, "general", { centre: centre.identity.name });

  const socials = Object.entries(centre.social).filter(
    (entry): entry is [SocialNetwork, string] => typeof entry[1] === "string",
  );

  const year = new Date().getFullYear();

  return (
    <footer className="bg-footer text-white/70">
      <Container className="py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)] lg:gap-16">
          {/* Identity */}
          <div className="flex flex-col gap-5">
            <Logo identity={centre.identity} invert />

            {centre.footer.description ? (
              <p className="max-w-sm text-sm leading-relaxed">
                {centre.footer.description}
              </p>
            ) : null}

            <ul className="flex flex-col gap-1.5 text-sm sm:gap-2.5">
              {branch ? (
                <li className="flex gap-2.5">
                  <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-2" />
                  <address>
                    {centre.identity.name} — {branch.name}
                    <br />
                    {branch.addressLines.join(", ")}, {branch.postcode} {branch.city},{" "}
                    {branch.state}
                  </address>
                </li>
              ) : null}

              {centre.contact.phone ? (
                <li className="flex gap-2.5">
                  <Phone aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-2" />
                  <a
                    href={`tel:${centre.contact.phone.replace(/[^\d+]/g, "")}`}
                    className="inline-flex min-h-11 items-center transition-colors duration-200 hover:text-white"
                  >
                    {centre.contact.phone}
                  </a>
                </li>
              ) : null}

              {centre.contact.email ? (
                <li className="flex gap-2.5">
                  <Mail aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-2" />
                  <a
                    href={`mailto:${centre.contact.email}`}
                    className="inline-flex min-h-11 items-center break-all transition-colors duration-200 hover:text-white"
                  >
                    {centre.contact.email}
                  </a>
                </li>
              ) : null}

              {chatHref ? (
                <li className="flex gap-2.5">
                  <MessageCircle
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-brand-2"
                  />
                  <a
                    href={chatHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center transition-colors duration-200 hover:text-white"
                  >
                    Message us on WhatsApp
                  </a>
                </li>
              ) : null}
            </ul>

            {socials.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {socials.map(([network, url]) => (
                  <li key={network}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${centre.identity.name} on ${socialLabel(network)}`}
                      className="inline-flex size-11 items-center justify-center rounded-full bg-white/8 text-white/80 transition-colors duration-200 hover:bg-white/15 hover:text-white"
                    >
                      <SocialIcon network={network} className="size-5" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Link groups */}
          <nav aria-label="Footer" className="grid gap-8 sm:grid-cols-3">
            {groups.map((group) => (
              <div key={group.title} className="flex flex-col gap-3">
                <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
                  {group.title}
                </h2>
                {/* Full-height targets on phones, tighter on desktop where a
                    mouse makes a 20px link perfectly clickable. */}
                <ul className="flex flex-col gap-0.5 text-sm sm:gap-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-11 items-center transition-colors duration-200 hover:text-white sm:min-h-0"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            {centre.footer.copyright ??
              `© ${year} ${centre.identity.legalName ?? centre.identity.name}. All rights reserved.`}
          </p>

          {centre.footer.legalLinks?.length ? (
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {centre.footer.legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center transition-colors duration-200 hover:text-white sm:min-h-0"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {centre.footer.note || isDemo() ? (
          <p className="mt-5 text-xs leading-relaxed text-white/45">
            {isDemo()
              ? "Concept website prepared for demonstration purposes. Forms on this site do not transmit any information. "
              : ""}
            {centre.footer.note}
          </p>
        ) : null}
      </Container>
    </footer>
  );
}
