import { Info } from "lucide-react";

import { Container } from "@/components/ui/Container";

/**
 * Demo deployments say so, plainly and on every page.
 *
 * A concept site built for a prospect must never read as that centre's
 * official website, and any form on it must never look like it collects real
 * data. Paired with `noindex, nofollow`, a disallow-all robots.txt and an
 * `X-Robots-Tag` response header.
 */
export function DemoNotice({ centreName }: { centreName: string }) {
  return (
    <div className="border-b border-line bg-ink text-white">
      <Container className="flex items-center justify-center gap-2.5 py-2 text-center">
        <Info aria-hidden="true" className="hidden size-4 shrink-0 text-white/70 sm:block" />
        <p className="text-xs leading-snug text-white/85 sm:text-[0.8125rem]">
          <span className="font-semibold text-white">Concept website</span> prepared
          for demonstration purposes.
          <span className="hidden sm:inline">
            {" "}
            {centreName} is a sample centre — forms do not send any information.
          </span>
          <span className="sm:hidden"> Forms do not send anything.</span>
        </p>
      </Container>
    </div>
  );
}
