import type { WhatsappConfig } from "@/config/types";

export type WhatsappTemplateKey = keyof WhatsappConfig["templates"];

export type WhatsappVariables = {
  centre?: string;
  subject?: string;
  class?: string;
  tutor?: string;
  branch?: string;
  level?: string;
};

/**
 * Replaces `{{token}}` placeholders. Unknown or missing tokens are removed
 * along with any double spacing they leave behind, so a half-filled template
 * never renders "I am interested in your {{subject}} classes".
 */
export function fillTemplate(
  template: string,
  variables: WhatsappVariables,
): string {
  return template
    .replace(/\{\{(\w+)\}\}/g, (_match, token: string) => {
      const value = variables[token as keyof WhatsappVariables];
      return value ?? "";
    })
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,!?])/g, "$1")
    .trim();
}

/** Builds a properly encoded wa.me deep link. */
export function buildWhatsappUrl(number: string, message: string): string {
  const digits = number.replace(/\D/g, "");
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${query}`;
}

/**
 * The one function components should use. Given the centre's WhatsApp
 * configuration, a template key and some context, it produces a ready link.
 */
export function whatsappHref(
  config: WhatsappConfig | undefined,
  template: WhatsappTemplateKey = "general",
  variables: WhatsappVariables = {},
): string | undefined {
  if (!config) return undefined;

  const message = fillTemplate(config.templates[template], variables);
  return buildWhatsappUrl(config.number, message);
}
