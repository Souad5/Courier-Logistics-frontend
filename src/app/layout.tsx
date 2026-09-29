import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { RootProvider } from "@/components/providers/root-provider";
import { siteConfig } from "@/config/site";

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

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — Courier & Logistics`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // next-themes sets the `class` attribute on <html> before hydration.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
