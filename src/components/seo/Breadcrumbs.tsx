import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export type Crumb = { name: string; path: string };

/**
 * Visible breadcrumbs. The matching BreadcrumbList JSON-LD is emitted by the
 * page alongside this component, so the markup always mirrors what a visitor
 * can actually see.
 */
export function Breadcrumbs({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  const last = items.length - 1;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-muted">
        {items.map((item, index) => (
          <li key={item.path} className="flex items-center gap-1.5">
            {index > 0 ? (
              <ChevronRight aria-hidden="true" className="size-3.5 shrink-0" />
            ) : null}
            {index === last ? (
              <span aria-current="page" className={cn("font-medium text-ink-soft")}>
                {item.name}
              </span>
            ) : (
              <Link
                href={item.path}
                className="inline-flex min-h-9 items-center transition-colors duration-200 hover:text-brand"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
