import Link from "next/link";

import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionaries";
import { getI18n } from "@/i18n/server";

import { Logo } from "./Logo";

type FooterLabels = Dictionary["nav"]["footer"] & Dictionary["nav"]["public"] & { login: string };

const COLUMNS: Array<{
  title: keyof FooterLabels;
  links: Array<{ label: keyof FooterLabels; href: string }>;
}> = [
  {
    title: "ship",
    links: [
      { label: "services", href: "/services" },
      { label: "pricing", href: "/pricing" },
      { label: "sendParcel", href: "/register" },
    ],
  },
  {
    title: "help",
    links: [
      { label: "trackParcel", href: "/#track" },
      { label: "deliveryCharges", href: "/#charges" },
      { label: "coverage", href: "/#coverage" },
    ],
  },
  {
    title: "company",
    links: [
      { label: "about", href: "/about" },
      { label: "contact", href: "/contact" },
    ],
  },
  {
    title: "account",
    links: [
      { label: "login", href: "/login" },
      { label: "createAccount", href: "/register" },
    ],
  },
];

export async function Footer() {
  const { t, f } = await getI18n();
  const labels: FooterLabels = { ...t.nav.public, ...t.nav.footer, login: t.nav.account.login };
  return (
    <footer className="border-t">
      <div className="container mx-auto grid grid-cols-2 gap-x-6 gap-y-10 px-4 py-12 sm:grid-cols-4 md:grid-cols-[1.5fr_repeat(4,1fr)]">
        <div className="col-span-2 space-y-3 sm:col-span-4 md:col-span-1">
          <Logo />
          <p className="text-muted-foreground max-w-xs text-sm text-pretty">
            {t.meta.siteDescription}
          </p>
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="text-muted-foreground hover:text-foreground inline-block font-mono text-sm"
          >
            {siteConfig.contactEmail}
          </a>
        </div>
        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={labels[column.title]}>
            <p className="eyebrow mb-3">{labels[column.title]}</p>
            <ul className="space-y-2 text-sm">
              {column.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {labels[link.label]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t">
        <p className="text-muted-foreground container mx-auto px-4 py-5 text-sm">
          © {f.number(new Date().getFullYear(), { useGrouping: false })} {siteConfig.name}.{" "}
          {t.nav.footer.rights}
        </p>
      </div>
    </footer>
  );
}
