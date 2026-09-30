import { Check } from "lucide-react";

import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

const POINTS = [
  "Customers book, pay by card and track every scan",
  "Couriers update status and upload delivery photos",
  "Admins assign couriers, manage hubs and audit actions",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh flex-1 lg:grid-cols-[1fr_minmax(0,0.9fr)]">
      <div className="flex flex-col">
        <header className="flex items-center justify-between p-4 md:p-6">
          <Logo />
          <ThemeToggle />
        </header>
        <main className="flex flex-1 items-center justify-center px-4 pb-16">
          <div className="w-full max-w-sm">{children}</div>
        </main>
      </div>

      <aside className="surface-ink m-3 hidden flex-col justify-between rounded-2xl p-10 lg:flex xl:p-14">
        <p className="font-mono text-xs tracking-widest uppercase opacity-60">
          Courier & logistics platform
        </p>
        <div className="space-y-8">
          <p className="max-w-md text-3xl leading-tight font-semibold tracking-tight text-balance">
            Every parcel, every status change, on the record.
          </p>
          <ul className="space-y-3 text-sm">
            {POINTS.map((point) => (
              <li key={point} className="flex gap-3 opacity-80">
                <Check className="text-signal mt-0.5 size-4 shrink-0" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs opacity-50">Payments are processed by Stripe in test mode.</p>
      </aside>
    </div>
  );
}
