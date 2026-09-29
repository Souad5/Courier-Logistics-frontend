import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Dashboards only ever answer crawlers with a redirect to /login.
      // /track, /success and /cancel are NOT listed: a disallowed URL can't be
      // crawled, so Google would never see their `noindex` and could still list
      // them from external links. They rely on the noindex meta tag instead.
      disallow: ["/admin", "/customer", "/courier"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
