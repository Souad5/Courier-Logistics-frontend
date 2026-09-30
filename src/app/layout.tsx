import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { RootProvider } from "@/components/providers/root-provider";
import { siteConfig } from "@/config/site";
import { baseOpenGraph, defaultOgImage, defaultTitle } from "@/lib/seo";

import "./globals.css";

// globals.css (shadcn) maps --font-sans / --font-geist-mono into the Tailwind theme.
const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Site-wide SEO defaults. Pages refine these via pageMetadata() (src/lib/seo.ts);
// The preview image is served by app/og/route.tsx. No canonical or
// og:url here: they'd be inherited by every page and point them all at "/".
export const metadata: Metadata = {
  // Resolves relative canonical/og:url/og:image paths to absolute URLs.
  metadataBase: new URL(siteConfig.url),
  title: {
    default: defaultTitle,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  openGraph: {
    ...baseOpenGraph,
    title: defaultTitle,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: siteConfig.description,
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // next-themes sets the `class` attribute on <html> before hydration.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans" suppressHydrationWarning>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
