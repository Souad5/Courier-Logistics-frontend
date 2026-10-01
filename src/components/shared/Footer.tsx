import Link from "next/link";

import { siteConfig } from "@/config/site";

import { Logo } from "./Logo";

const COLUMNS = [
  {
    title: "Ship",
    links: [
      { title: "Services", href: "/services" },
      { title: "Pricing", href: "/pricing" },
      { title: "Send a parcel", href: "/register" },
    ],
  },
  {
    title: "Help",
    links: [
      { title: "Track a parcel", href: "/#track" },
      { title: "Delivery charges", href: "/#charges" },
      { title: "Coverage", href: "/#coverage" },
      { title: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { title: "About", href: "/about" },
      { title: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { title: "Log in", href: "/login" },
      { title: "Create account", href: "/register" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto grid grid-cols-2 gap-x-6 gap-y-10 px-4 py-12 sm:grid-cols-4 md:grid-cols-[1.5fr_repeat(4,1fr)]">
        <div className="col-span-2 space-y-3 sm:col-span-4 md:col-span-1">
          <Logo />
          <p className="text-muted-foreground max-w-xs text-sm text-pretty">
            {siteConfig.description}
          </p>
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="text-muted-foreground hover:text-foreground inline-block font-mono text-sm"
          >
            {siteConfig.contactEmail}
          </a>
        </div>
        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="eyebrow mb-3">{column.title}</p>
            <ul className="space-y-2 text-sm">
              {column.links.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t">
        <p className="text-muted-foreground container mx-auto px-4 py-5 text-sm">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
