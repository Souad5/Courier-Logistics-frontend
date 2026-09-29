/**
 * Renders schema.org structured data. `<` is escaped so no string inside the
 * payload can close the <script> tag (per the Next.js JSON-LD guide).
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inline; `<` is escaped so the payload can't close the tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
