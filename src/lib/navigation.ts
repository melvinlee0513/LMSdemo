import type { FeatureFlag } from "@/config/constants";
import type { Centre } from "@/config/types";

export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type FooterGroup = {
  title: string;
  links: NavLink[];
};

function isEnabled(centre: Centre, flag?: string): boolean {
  if (!flag) return true;
  const flags = centre.featureFlags as Record<string, boolean | undefined>;
  return flags[flag] !== false;
}

/**
 * Primary navigation, with anything gated by a disabled feature flag removed.
 * A disabled feature must never leave a link behind.
 */
export function primaryNav(centre: Centre): NavLink[] {
  return centre.navigation.primary
    .filter((item) => isEnabled(centre, item.flag))
    .map(({ label, href, external }) => ({ label, href, external }));
}

export function navCta(centre: Centre): NavLink | undefined {
  const cta = centre.navigation.cta;
  if (!cta) return undefined;
  if (cta.href === "/trial" && !centre.featureFlags.trialRegistration) {
    return undefined;
  }
  if (cta.href === "/register" && !centre.featureFlags.studentRegistration) {
    return undefined;
  }
  return cta;
}

/**
 * Footer groups. A centre may specify them explicitly; otherwise the engine
 * derives a sensible set from the enabled features, so adding a centre does
 * not require writing out a footer.
 */
export function footerGroups(centre: Centre): FooterGroup[] {
  if (centre.footer.groups) {
    return centre.footer.groups
      .map((group) => ({
        title: group.title,
        links: group.links
          .filter((link) => isEnabled(centre, link.flag))
          .map(({ label, href, external }) => ({ label, href, external })),
      }))
      .filter((group) => group.links.length > 0);
  }

  const flags = centre.featureFlags;

  const groups: FooterGroup[] = [
    {
      title: "Centre",
      links: compact([
        flags.about && { label: "About us", href: "/about" },
        flags.tutors && { label: "Our tutors", href: "/tutors" },
        flags.locations && { label: "Branches", href: "/locations" },
        flags.testimonials && {
          label: "Student & parent stories",
          href: "/testimonials",
        },
      ]),
    },
    {
      title: "Learning",
      links: compact([
        flags.subjects && { label: "Subjects", href: "/subjects" },
        flags.classes && { label: "Classes", href: "/classes" },
        flags.timetable && { label: "Weekly timetable", href: "/timetable" },
      ]),
    },
    {
      title: "Get started",
      links: compact([
        flags.trialRegistration && { label: "Book a trial class", href: "/trial" },
        flags.studentRegistration && {
          label: "Register a student",
          href: "/register",
        },
        { label: "Contact the centre", href: "/contact" },
      ]),
    },
  ];

  return groups.filter((group) => group.links.length > 0);
}

function compact(items: (NavLink | false | undefined)[]): NavLink[] {
  return items.filter((item): item is NavLink => Boolean(item));
}

/**
 * True when `href` is the current page or one of its detail routes, so
 * `/subjects/physics` still highlights "Subjects" in the header.
 */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Route guard used by page components to 404 disabled features. */
export function featureEnabled(centre: Centre, flag: FeatureFlag): boolean {
  return centre.featureFlags[flag];
}
