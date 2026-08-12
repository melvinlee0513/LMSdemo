import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { primaryNav } from "@/lib/navigation";
import { getCentre } from "@/lib/site";

/**
 * 404 that helps rather than apologises: it offers the enabled routes for
 * this centre, so a wrong URL still leads somewhere useful.
 */
export default function NotFound() {
  const centre = getCentre();
  const links = primaryNav(centre).filter((link) => link.href !== "/");

  return (
    <Container className="flex flex-col items-center gap-6 py-20 text-center sm:py-28">
      <SectionLabel>404</SectionLabel>

      <h1 className="max-w-2xl text-3xl leading-[1.15] font-extrabold text-ink sm:text-5xl">
        We could not find that page
      </h1>

      <p className="max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg">
        The link may be out of date, or the page may have moved. Here is where most
        visitors are heading.
      </p>

      <ButtonLink href="/" size="lg">
        Back to the homepage
        <ArrowRight aria-hidden="true" className="size-4" />
      </ButtonLink>

      {links.length > 0 ? (
        <nav aria-label="Popular pages" className="mt-4">
          <ul className="flex flex-wrap justify-center gap-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex h-11 items-center rounded-full border border-line bg-surface px-4 text-sm font-semibold text-ink-soft transition-colors duration-200 hover:bg-brand-soft hover:text-brand"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </Container>
  );
}
