import type { Metadata } from "next";

import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { Logo } from "@/components/shared/Logo";
import { noIndexRobots } from "@/lib/seo";

// Stripe return pages are only meaningful right after checkout.
export const metadata: Metadata = { robots: noIndexRobots };

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted/40 flex min-h-svh flex-1 flex-col">
      <header className="flex items-center justify-between p-4">
        <Logo />
        <LanguageToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
