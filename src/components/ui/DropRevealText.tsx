import { Fragment, type CSSProperties } from "react";

import { InView } from "@/components/ui/InView";
import type { HighlightAnimation } from "@/config/types";
import { MOTION } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * ---------------------------------------------------------------------------
 * DropRevealText
 * ---------------------------------------------------------------------------
 * The animated highlight used on a small number of deliberate headings: the
 * words drop into their final baseline from behind a clip box, one after the
 * other.
 *
 * It is a server component. The phrase is split per word and rendered as real
 * text in the HTML — a crawler, a screen reader and a browser with JavaScript
 * disabled all see the finished heading. The animation is purely additive CSS
 * that a `data-anim="run"` ancestor switches on.
 *
 * Per word rather than per phrase for two reasons: the clip box then follows
 * natural line wrapping, and the small stagger is what makes the effect read
 * as typography rather than as one sliding block.
 *
 * The markup is identical whether or not the animation is enabled, so turning
 * it off changes the entrance and nothing else.
 *
 * Generic by design — `text` and `animation` come from centre configuration.
 * No phrase is ever hardcoded in animation logic.
 */
export function DropRevealText({
  text,
  animation = "drop",
  className,
  /** Delay before the first word, for sequencing against other hero elements. */
  baseDelay = 0,
  /**
   * `load` starts immediately (above-the-fold hero); `view` waits until the
   * heading is scrolled into view.
   */
  trigger = "view",
}: {
  text: string;
  animation?: HighlightAnimation;
  className?: string;
  baseDelay?: number;
  trigger?: "load" | "view";
}) {
  const isSpace = (part: string) => /^\s+$/.test(part);

  // Whitespace is kept as its own token so the words keep their natural
  // spacing, and each word carries the count of words before it as its
  // stagger index. Computed rather than accumulated: no mutation during render.
  const parts = text.split(/(\s+)/).filter((part) => part.length > 0);

  const content = parts.map((part, index) => {
    if (isSpace(part)) return <Fragment key={index}> </Fragment>;

    const wordIndex = parts.slice(0, index).filter((token) => !isSpace(token)).length;
    const style = { "--i": String(wordIndex) } as CSSProperties;

    return (
      <span key={index} className="drop-clip">
        <span className={cn("drop-word", className)} style={style}>
          {part}
        </span>
      </span>
    );
  });

  if (animation === "none") {
    return <span>{content}</span>;
  }

  const style = { "--drop-base": `${baseDelay}ms` } as CSSProperties;

  if (trigger === "load") {
    // Above the fold: the attribute is server-rendered, so the animation plays
    // from first paint with no JavaScript involved at all.
    return (
      <span data-anim="run" style={style}>
        {content}
      </span>
    );
  }

  return (
    <InView as="span" style={style}>
      {content}
    </InView>
  );
}

/**
 * Splits a heading around its highlighted fragment and animates only that
 * fragment. A highlight that does not appear in the heading degrades to plain
 * text rather than breaking the page.
 */
export function AnimatedHeading({
  heading,
  highlight,
  animation = "none",
  trigger = "view",
  baseDelay = MOTION.stagger.words,
  highlightClassName = "text-gradient-brand",
}: {
  heading: string;
  highlight?: string;
  animation?: HighlightAnimation;
  trigger?: "load" | "view";
  baseDelay?: number;
  highlightClassName?: string;
}) {
  if (!highlight) return <>{heading}</>;

  const index = heading.indexOf(highlight);
  if (index === -1) return <>{heading}</>;

  return (
    <>
      {heading.slice(0, index)}
      <DropRevealText
        text={highlight}
        animation={animation}
        trigger={trigger}
        baseDelay={baseDelay}
        className={highlightClassName}
      />
      {heading.slice(index + highlight.length)}
    </>
  );
}
