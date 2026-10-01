"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ArrowRight, Menu } from "lucide-react";
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

/**
 * Floating glass navbar: a rounded bar that tightens and turns more opaque once the
 * page scrolls, with an active-link pill that slides between items (layoutId).
 */
export function Navbar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  // Only re-renders when crossing the threshold, not on every scroll frame.
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));

  // Anchor links (/#coverage) are never "active" — they're sections of the home page.
  const isActive = (href: string) =>
    href.includes("#") ? false : href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-4">
      <div
        className={cn(
          "container mx-auto flex items-center justify-between gap-4 rounded-2xl px-3 transition-all duration-300 sm:px-4",
          "ring-1 backdrop-blur-xl backdrop-saturate-150",
          scrolled
            ? "bg-background/90 h-14 shadow-lg shadow-black/5 ring-black/10 dark:shadow-black/40 dark:ring-white/10"
            : "bg-background/80 h-16 shadow-sm ring-black/5 dark:ring-white/10",
        )}
      >
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {publicNav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "focus-visible:ring-ring relative isolate rounded-full px-3.5 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
                  active
                    ? "text-foreground"
                    : "text-foreground/70 hover:bg-muted/60 hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active-pill"
                    aria-hidden
                    className="bg-muted absolute inset-0 -z-10 rounded-full ring-1 ring-black/5 dark:ring-white/10"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 420, damping: 34 }
                    }
                  />
                )}
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <AppButton asChild className="hidden rounded-full px-4 sm:inline-flex">
                <Link href={ROLE_HOME[user.role]}>Dashboard</Link>
              </AppButton>
              <UserMenu />
            </>
          ) : (
            <div className="hidden items-center gap-1.5 sm:flex">
              <AppButton asChild variant="ghost" className="rounded-full px-4">
                <Link href="/login">Log in</Link>
              </AppButton>
              <AppButton asChild className="group rounded-full px-4">
                <Link href="/register">
                  Get started
                  <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </AppButton>
            </div>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <AppButton
                variant="ghost"
                size="icon"
                className="rounded-full md:hidden"
                aria-label="Open menu"
              >
                <Menu />
              </AppButton>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-80 flex-col">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
                {publicNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-4 py-3 text-base transition-colors",
                      isActive(item.href)
                        ? "bg-muted font-medium"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}
                  >
                    {item.title}
                    <ArrowRight className="size-4 opacity-40" aria-hidden />
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2 border-t p-4">
                {user ? (
                  <AppButton asChild>
                    <Link href={ROLE_HOME[user.role]} onClick={() => setOpen(false)}>
                      Go to dashboard
                    </Link>
                  </AppButton>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
