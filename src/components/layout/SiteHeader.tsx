import { Logo } from "@/components/layout/Logo";
import { HeaderNav } from "@/components/navigation/HeaderNav";
import { navCta, primaryNav } from "@/lib/navigation";
import { getCentre } from "@/lib/site";
import { whatsappHref } from "@/lib/whatsapp";

/**
 * Server wrapper: resolves navigation against feature flags and hands the
 * client component only the handful of values it needs. The centre
 * configuration itself never crosses into the browser bundle.
 */
export function SiteHeader() {
  const centre = getCentre();
  const whatsapp = centre.featureFlags.whatsapp ? centre.whatsapp : undefined;
  const href = whatsappHref(whatsapp, "general", { centre: centre.identity.name });

  return (
    <HeaderNav
      logo={<Logo identity={centre.identity} />}
      links={primaryNav(centre)}
      cta={navCta(centre)}
      mobileSecondaryCta={
        centre.featureFlags.studentRegistration
          ? centre.navigation.mobileSecondaryCta
          : undefined
      }
      whatsapp={href ? { href, display: whatsapp?.displayNumber } : undefined}
      phone={centre.contact.phone}
      centreName={centre.identity.name}
    />
  );
}
