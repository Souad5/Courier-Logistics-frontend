"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ROLE_HOME } from "@/config/api.config";
import { publicNav } from "@/config/site";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";

import { AppButton } from "./AppButton";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";

export function Navbar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {publicNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "hover:text-foreground rounded-md px-3 py-2 text-sm transition-colors",
                isActive(item.href) ? "text-foreground font-medium" : "text-muted-foreground",
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <AppButton asChild size="sm" className="hidden sm:inline-flex">
                <Link href={ROLE_HOME[user.role]}>Dashboard</Link>
              </AppButton>
              <UserMenu />
            </>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <AppButton asChild variant="ghost" size="sm">
                <Link href="/login">Log in</Link>
              </AppButton>
              <AppButton asChild size="sm">
                <Link href="/register">Get started</Link>
              </AppButton>
            </div>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <AppButton variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu />
              </AppButton>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {publicNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "hover:bg-muted rounded-md px-3 py-2 text-sm",
                      isActive(item.href) && "bg-muted font-medium",
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
                {!user && (
                  <div className="mt-4 flex flex-col gap-2">
                    <AppButton asChild variant="outline">
                      <Link href="/login" onClick={() => setOpen(false)}>
                        Log in
                      </Link>
                    </AppButton>
                    <AppButton asChild>
                      <Link href="/register" onClick={() => setOpen(false)}>
                        Get started
                      </Link>
                    </AppButton>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
