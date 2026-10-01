import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";

import { RootProvider } from "@/components/providers/root-provider";
import { siteConfig } from "@/config/site";
import { getI18n } from "@/i18n/server";
import { baseOpenGraph, defaultOgImage } from "@/lib/seo";

import "./globals.css";

// globals.css builds --font-sans / --font-mono from these variables (Geist first, Bengali fallback).
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Geist has no Bengali glyphs; the font stack falls back to this for Bangla text.
const notoBengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Site-wide SEO defaults. Pages refine these via pageMetadata() (src/lib/seo.ts);
// The preview image is served by app/og/route.tsx. No canonical or
// og:url here: they'd be inherited by every page and point them all at "/".
export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return {
    // Resolves relative canonical/og:url/og:image paths to absolute URLs.
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t.meta.defaultTitle,
      template: `%s · ${siteConfig.name}`,
    },
    description: t.meta.siteDescription,
    applicationName: siteConfig.name,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    openGraph: {
      ...baseOpenGraph,
      locale: locale === "bn" ? "bn_BD" : "en_US",
      title: t.meta.defaultTitle,
      description: t.meta.siteDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.defaultTitle,
      description: t.meta.siteDescription,
      images: [defaultOgImage.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    // Stop iOS from auto-linking tracking numbers and fees as phone numbers.
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { locale, t } = await getI18n();
  return (
    // next-themes sets the `class` attribute on <html> before hydration.
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${notoBengali.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans" suppressHydrationWarning>
        <RootProvider locale={locale} dictionary={t}>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
