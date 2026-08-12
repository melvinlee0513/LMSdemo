import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "dark"
  | "whatsapp";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold " +
  "transition-[transform,box-shadow,background-color,color,border-color] duration-200 " +
  "select-none whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60 " +
  "active:translate-y-px";

const variants: Record<ButtonVariant, string> = {
  primary:
    "gradient-brand text-white shadow-brand hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0",
  secondary:
    "border border-line-warm bg-surface text-brand hover:bg-brand-soft hover:-translate-y-0.5 active:translate-y-0",
  ghost: "text-ink-soft hover:bg-surface-muted hover:text-ink",
  dark: "bg-ink text-white hover:-translate-y-0.5 hover:bg-ink/90 active:translate-y-0",
  whatsapp:
    "bg-[#1faa5a] text-white shadow-soft hover:-translate-y-0.5 hover:bg-[#1b9750] active:translate-y-0",
};

/** Every size clears the 44×44px minimum touch target. */
const sizes: Record<ButtonSize, string> = {
  sm: "h-11 px-4 text-sm",
  md: "h-12 px-5 text-[0.95rem]",
  lg: "h-13 px-7 text-base",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);
}

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export function Button({
  variant,
  size,
  fullWidth,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...props}
    >
      {children}
    </button>
  );
}

type ButtonLinkProps = CommonProps & {
  href: string;
  external?: boolean;
  prefetch?: boolean;
  "aria-label"?: string;
  onClick?: () => void;
};

/**
 * Links that look like buttons stay real links: right-click, middle-click and
 * "open in new tab" all keep working, which matters for conversion paths.
 */
export function ButtonLink({
  href,
  external,
  variant,
  size,
  fullWidth,
  className,
  children,
  prefetch,
  onClick,
  ...props
}: ButtonLinkProps) {
  const classes = buttonClasses({ variant, size, fullWidth, className });

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} prefetch={prefetch} onClick={onClick} {...props}>
      {children}
    </Link>
  );
}
