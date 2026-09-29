import Link from "next/link";

import { publicNav, siteConfig } from "@/config/site";

import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto grid gap-8 px-4 py-10 md:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p className="text-muted-foreground max-w-xs text-sm">{siteConfig.description}</p>
        </div>
        <div>
          <p className="mb-3 text-sm font-medium">Company</p>
          <ul className="space-y-2 text-sm">
            {publicNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-muted-foreground hover:text-foreground">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-medium">Get in touch</p>
          <p className="text-muted-foreground text-sm">{siteConfig.contactEmail}</p>
        </div>
      </div>
      <div className="text-muted-foreground border-t py-4 text-center text-xs">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
