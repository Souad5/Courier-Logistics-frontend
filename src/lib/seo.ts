import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

/** Brand title used on the home page and as the site-wide default. */
export const defaultTitle = `${siteConfig.name} Courier & Logistics`;

/** Served by app/og/route.tsx (1200×630 PNG). */
export const defaultOgImage = {
  url: "/og",
  width: 1200,
  height: 630,
  alt: `${siteConfig.name} — courier & logistics`,
};

/**
 * Next merges metadata SHALLOWLY: a page that sets `openGraph` replaces the
 * layout's whole `openGraph` object. Every segment spreads this base in so the
 * image, siteName, locale and type survive.
 */
export const baseOpenGraph = {
  type: "website",
  siteName: siteConfig.name,
  locale: siteConfig.locale,
  images: [defaultOgImage],
} satisfies Metadata["openGraph"];

export const noIndexRobots = {
  index: false,
  follow: false,
} satisfies Metadata["robots"];

interface PageMetadataInput {
  /** Page title; the root layout's template appends " · SwiftParcel". */
  title: string;
  description?: string;
  /** Route path, e.g. "/pricing" — becomes the canonical URL and og:url. */
  path?: string;
  /** Keep the page out of search results. */
  noIndex?: boolean;
  /** Use `title` verbatim everywhere, without the " · SwiftParcel" suffix. */
  absoluteTitle?: boolean;
}

/**
 * Builds a page's `metadata` export — Next's server-rendered replacement for
 * react-helmet. Tags land in the initial HTML, so crawlers and link-preview
 * bots see them without running JavaScript.
 *
 *   export const metadata = pageMetadata({ title: "Pricing", description: "…", path: "/pricing" });
 */
export function pageMetadata({
  title,
  description,
  path,
  noIndex,
  absoluteTitle,
}: PageMetadataInput): Metadata {
  const desc = description ?? siteConfig.description;
  // The title template only applies to <title>, so social titles get the brand explicitly.
  const socialTitle = absoluteTitle ? title : `${title} · ${siteConfig.name}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: desc,
    ...(path && { alternates: { canonical: path } }),
    openGraph: {
      ...baseOpenGraph,
      title: socialTitle,
      description: desc,
      ...(path && { url: path }),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: desc,
      images: [defaultOgImage.url],
    },
    ...(noIndex && { robots: noIndexRobots }),
  };
}
