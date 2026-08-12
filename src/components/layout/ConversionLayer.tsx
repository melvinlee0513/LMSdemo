import { MessageCircle } from "lucide-react";

import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { getCentre } from "@/lib/site";
import { whatsappHref } from "@/lib/whatsapp";

/**
 * The always-available conversion affordances:
 *   desktop  a small floating WhatsApp action (no JavaScript at all)
 *   mobile   a two-action sticky bar
 *
 * Both are opt-in through the centre's `whatsapp` configuration.
 */
export function ConversionLayer() {
  const centre = getCentre();
  const whatsapp = centre.featureFlags.whatsapp ? centre.whatsapp : undefined;
  const href = whatsappHref(whatsapp, "general", { centre: centre.identity.name });

  const cta = centre.featureFlags.trialRegistration
    ? { label: "Book a Trial", href: "/trial" }
    : centre.featureFlags.studentRegistration
      ? { label: "Register", href: "/register" }
      : undefined;

  return (
    <>
      {href && whatsapp?.floatingButton ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Message ${centre.identity.name} on WhatsApp`}
          className="fixed right-6 bottom-6 z-40 hidden size-14 items-center justify-center rounded-full bg-[#1faa5a] text-white shadow-lift transition-transform duration-200 hover:-translate-y-0.5 md:inline-flex"
        >
          <MessageCircle aria-hidden="true" className="size-6" />
        </a>
      ) : null}

      {whatsapp?.mobileStickyBar ? (
        <MobileStickyCta
          whatsappHref={href}
          cta={cta}
          centreName={centre.identity.name}
        />
      ) : null}
    </>
  );
}
