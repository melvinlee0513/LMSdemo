import type { SVGProps } from "react";

/**
 * Brand marks are not part of the Lucide set, so the four channels Malaysian
 * tuition centres actually use are drawn inline. Decorative by default — the
 * link that wraps them carries the accessible name.
 */
export type SocialNetwork =
  | "facebook"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "linkedin";

const paths: Record<SocialNetwork, string> = {
  facebook:
    "M14 8.5V7c0-.8.2-1.2 1.3-1.2H17V3h-2.5C11.9 3 11 4.4 11 6.6v1.9H9V11h2v10h3V11h2.2l.3-2.5H14Z",
  instagram:
    "M12 7.4a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2Zm0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm5.9-7.8a1.07 1.07 0 1 1-2.14 0 1.07 1.07 0 0 1 2.14 0ZM21 8.1c-.05-1.4-.37-2.65-1.4-3.67C18.58 3.4 17.34 3.08 15.94 3 14.5 2.93 10.5 2.93 9.06 3c-1.4.08-2.63.4-3.66 1.42C4.37 5.45 4.05 6.7 4 8.1c-.08 1.44-.08 5.76 0 7.2.05 1.4.37 2.65 1.4 3.67 1.03 1.03 2.26 1.35 3.66 1.43 1.44.08 5.44.08 6.88 0 1.4-.08 2.64-.4 3.66-1.43 1.03-1.02 1.35-2.27 1.4-3.67.08-1.44.08-5.76 0-7.2Zm-1.9 8.74a3.04 3.04 0 0 1-1.71 1.71c-1.18.47-4 .36-5.31.36-1.31 0-4.14.1-5.32-.36a3.04 3.04 0 0 1-1.7-1.71c-.47-1.18-.36-3.98-.36-5.29 0-1.31-.1-4.11.36-5.29a3.04 3.04 0 0 1 1.7-1.71c1.18-.47 4.01-.36 5.32-.36 1.31 0 4.13-.1 5.31.36a3.04 3.04 0 0 1 1.71 1.71c.47 1.18.36 3.98.36 5.29 0 1.31.11 4.11-.36 5.29Z",
  tiktok:
    "M16.6 3h-2.9v12.3a2.5 2.5 0 1 1-2.5-2.5c.26 0 .5.04.74.11V9.9a5.6 5.6 0 1 0 4.76 5.53V9.2a6.3 6.3 0 0 0 3.7 1.2V7.5a3.5 3.5 0 0 1-3.5-3.5V3Z",
  youtube:
    "M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77C22 15.2 22 12 22 12s0-3.2-.4-4.8ZM10 15.1V8.9l5.2 3.1-5.2 3.1Z",
  linkedin:
    "M6.94 5.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.2 8.9h3.5V21H3.2V8.9Zm5.9 0h3.35v1.65h.05c.47-.85 1.6-1.75 3.3-1.75 3.53 0 4.18 2.24 4.18 5.15V21h-3.5v-5.35c0-1.28-.03-2.92-1.83-2.92-1.83 0-2.11 1.39-2.11 2.83V21H9.1V8.9Z",
};

const labels: Record<SocialNetwork, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  linkedin: "LinkedIn",
};

export function socialLabel(network: SocialNetwork): string {
  return labels[network];
}

export function SocialIcon({
  network,
  ...props
}: { network: SocialNetwork } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d={paths[network]} />
    </svg>
  );
}
