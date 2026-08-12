/**
 * Renders JSON-LD.
 *
 * The payload is produced by `src/lib/structured-data.ts` from validated
 * configuration only — never from user input — and is serialised with `<`
 * escaped so it cannot terminate the script element early.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | null }) {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
