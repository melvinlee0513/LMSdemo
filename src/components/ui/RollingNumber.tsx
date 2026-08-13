import type { CSSProperties } from "react";

import { MOTION } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * ---------------------------------------------------------------------------
 * RollingNumber
 * ---------------------------------------------------------------------------
 * An odometer: each digit is a vertical reel that rolls a full revolution and
 * lands on its final value. Not a counter interpolating 1 → 27 → 183 → 1,200,
 * which reads as a loading state rather than as a designed moment.
 *
 * The properties that make it safe to ship:
 *
 *   • The reel's *resting* transform is already the final digit. The animation
 *     only ever plays into that position, so with no JavaScript, with reduced
 *     motion, or before the observer fires, the correct number is on screen.
 *   • Every column sizes itself to the widest digit in its strip, identical
 *     for all columns, so the final width is reserved from first paint. No
 *     layout shift and no horizontal jitter as digits change.
 *   • Only digits roll. Separators, decimal points and suffixes such as
 *     `+`, `%` or `hr` are static text.
 *   • The reels are `aria-hidden`; assistive technology reads a single
 *     visually-hidden copy of the finished value, never the intermediate
 *     digits.
 *
 * A `data-anim="run"` ancestor (see <InView />) starts it, once.
 */

/** One full revolution: digits 0-9 twice, landing on the same digit. */
const REVOLUTIONS = 1;
const STRIP = Array.from({ length: (REVOLUTIONS + 1) * 10 }, (_, i) => i % 10);

export function RollingNumber({
  value,
  className,
  /** Stagger between statistic cards, in milliseconds. */
  delay = 0,
  duration = 900,
  animate = true,
}: {
  value: string;
  className?: string;
  delay?: number;
  duration?: number;
  animate?: boolean;
}) {
  if (!animate || !/\d/.test(value)) {
    return <span className={className}>{value}</span>;
  }

  const characters = [...value];
  const isDigit = (character: string) => /\d/.test(character);

  return (
    <span className={cn("inline-flex items-baseline", className)}>
      <span className="sr-only">{value}</span>

      <span aria-hidden="true" className="inline-flex items-baseline">
        {characters.map((character, index) => {
          if (!isDigit(character)) {
            return <span key={index}>{character}</span>;
          }

          const digit = Number(character);
          // Position among the digits only, so separators never shift the
          // stagger. Computed per character rather than accumulated.
          const digitIndex = characters.slice(0, index).filter(isDigit).length;

          const style = {
            // Resting position — the final digit, on the last revolution.
            "--reel-to": `-${REVOLUTIONS * 10 + digit}em`,
            // Start of the roll — the same digit, one revolution earlier.
            "--reel-from": `-${digit}em`,
            "--reel-delay": `${delay + digitIndex * MOTION.stagger.words}ms`,
            "--reel-duration": `${duration}ms`,
          } as CSSProperties;

          return (
            <span key={index} className="reel-column">
              <span className="reel-strip" style={style}>
                {STRIP.map((stripDigit, position) => (
                  <span key={position} className="block">
                    {stripDigit}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
