import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Fragment } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { IconBox } from "@/components/ui/IconBox";
import { Rating } from "@/components/ui/Rating";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Hero as HeroConfig } from "@/config/types";
import { cn } from "@/lib/utils";

export type HeroVariant =
  | "split-preview"
  | "split-illustration"
  | "split-photo"
  | "centered";

/**
 * ---------------------------------------------------------------------------
 * Hero
 * ---------------------------------------------------------------------------
 * Four reusable compositions of the same configured content. A centre picks
 * one through `componentVariants.hero` — no component edits required.
 *
 *   split-preview       text | image with a lesson-preview panel  (reference)
 *   split-photo         text | photography, plain frame
 *   split-illustration  text | illustration on a soft brand panel
 *   centered            centred text, media below
 *
 * Mobile always collapses to: text → CTAs → visual.
 */
export function Hero({
  hero,
  variant = "split-preview",
}: {
  hero: HeroConfig;
  variant?: HeroVariant;
}) {
  const centered = variant === "centered";

  return (
    <section className="relative overflow-hidden bg-surface-warm">
      <div
        aria-hidden="true"
        className="surface-glow pointer-events-none absolute inset-x-0 top-0 h-[420px]"
      />

      <Container className="relative py-12 sm:py-16 lg:py-20">
        <div
          className={cn(
            centered
              ? "flex flex-col items-center gap-10 text-center"
              : "grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14",
          )}
        >
          {/* Copy */}
          <div
            className={cn(
              "flex flex-col gap-6",
              centered ? "max-w-3xl items-center" : "items-start",
            )}
          >
            {hero.eyebrow ? <SectionLabel>{hero.eyebrow}</SectionLabel> : null}

            <h1
              // 38px on phones → 56px on large desktops, the readable end of
              // the reference range. Line length stays comfortable at every step.
              className={cn(
                "text-[2.375rem] leading-[1.08] font-extrabold text-ink",
                "sm:text-[2.75rem] lg:text-5xl xl:text-[3.5rem]",
              )}
            >
              <HeroHeadline fragments={hero.headline} />
            </h1>

            <p
              className={cn(
                "max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg",
                centered && "mx-auto",
              )}
            >
              {hero.description}
            </p>

            <div
              className={cn(
                "flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center",
                centered && "sm:justify-center",
              )}
            >
              <ButtonLink href={hero.primaryCta.href} size="lg" className="w-full sm:w-auto">
                {hero.primaryCta.label}
                <ArrowRight aria-hidden="true" className="size-4" />
              </ButtonLink>

              {hero.secondaryCta ? (
                <ButtonLink
                  href={hero.secondaryCta.href}
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  {hero.secondaryCta.label}
                </ButtonLink>
              ) : null}
            </div>

            {hero.trust ? <HeroTrust trust={hero.trust} centered={centered} /> : null}
          </div>

          {/* Visual */}
          <HeroMedia hero={hero} variant={variant} />
        </div>
      </Container>
    </section>
  );
}

function HeroHeadline({ fragments }: { fragments: HeroConfig["headline"] }) {
  return (
    <>
      {fragments.map((fragment, index) => (
        <Fragment key={`${fragment.text}-${index}`}>
          {index > 0 ? " " : null}
          {fragment.highlight ? (
            <span className="text-gradient-brand">{fragment.text}</span>
          ) : (
            fragment.text
          )}
          {fragment.break ? <br className="hidden sm:block" /> : null}
        </Fragment>
      ))}
    </>
  );
}

function HeroTrust({
  trust,
  centered,
}: {
  trust: NonNullable<HeroConfig["trust"]>;
  centered: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-2xl border border-line-warm bg-surface px-4 py-3 shadow-soft sm:flex-row sm:items-center sm:gap-4",
        centered && "sm:self-center",
      )}
    >
      {trust.avatars?.length ? (
        <ul className="flex -space-x-2.5">
          {trust.avatars.map((avatar) => (
            <li key={avatar.src}>
              <Image
                src={avatar.src}
                alt={avatar.alt}
                width={36}
                height={36}
                sizes="36px"
                className="size-9 rounded-full border-2 border-surface object-cover"
              />
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex flex-col gap-0.5">
        {trust.rating !== undefined ? (
          <Rating
            value={trust.rating}
            size="sm"
            label={trust.ratingLabel ?? `Rated ${trust.rating} out of 5`}
          />
        ) : null}
        {trust.text ? (
          <p className="text-xs leading-relaxed text-ink-soft sm:text-sm">{trust.text}</p>
        ) : null}
      </div>
    </div>
  );
}

function HeroMedia({ hero, variant }: { hero: HeroConfig; variant: HeroVariant }) {
  const { image, badge, chip, preview } = hero.media;
  const illustration = variant === "split-illustration";

  return (
    <div className={cn("relative", variant === "centered" && "w-full max-w-4xl")}>
      <div
        className={cn(
          "relative overflow-hidden rounded-[2rem] border shadow-lift",
          illustration ? "border-line-warm bg-brand-soft-2 p-6" : "border-line bg-surface",
        )}
      >
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          // The hero image is the LCP element on almost every visit — and the
          // only image on the site marked priority.
          priority
          fetchPriority="high"
          sizes="(max-width: 1024px) 100vw, 560px"
          className={cn(
            "h-auto w-full",
            illustration ? "object-contain" : "aspect-4/3 object-cover",
          )}
        />

        {/* Lesson-preview panel (split-preview only) */}
        {variant === "split-preview" && preview ? (
          <div className="absolute inset-x-3 bottom-3 rounded-3xl border border-line bg-surface/95 p-4 shadow-soft backdrop-blur-sm sm:inset-x-4 sm:bottom-4 sm:p-5">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-brand uppercase">
              <span
                aria-hidden="true"
                className="inline-block size-1.5 rounded-full bg-brand"
              />
              {preview.label}
            </p>
            <p className="mt-1.5 text-base font-bold text-ink sm:text-lg">
              {preview.title}
            </p>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft sm:text-sm">
              {preview.meta.map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="inline-block size-1 rounded-full bg-ink-muted"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {/* Floating badge */}
      {badge ? (
        <div className="absolute -top-3 -left-3 hidden items-center gap-2.5 rounded-2xl border border-line bg-surface px-3.5 py-2.5 shadow-lift sm:flex lg:-left-6">
          <IconBox name={badge.icon} tone="primary" size="sm" />
          <div>
            <p className="text-sm leading-tight font-bold text-ink">{badge.title}</p>
            {badge.subtitle ? (
              <p className="text-xs text-ink-muted">{badge.subtitle}</p>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Floating stat chip */}
      {chip ? (
        <div className="absolute -right-2 bottom-16 hidden items-center gap-2.5 rounded-2xl border border-line bg-surface px-3.5 py-2.5 shadow-lift lg:flex xl:-right-6">
          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <Icon name={chip.icon} className="size-4.5" />
          </span>
          <div>
            <p className="text-sm leading-tight font-bold text-ink">{chip.value}</p>
            <p className="text-xs text-ink-muted">{chip.label}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
