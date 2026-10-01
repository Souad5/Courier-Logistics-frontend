"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import type { MouseEvent } from "react";
import { flushSync } from "react-dom";

import { AppButton } from "./AppButton";

const REVEAL_MS = 600;

/**
 * Light/dark toggle. Where the View Transitions API is available, the new theme
 * spreads out in a circle from the button; otherwise (or with reduced motion) it
 * switches instantly. The icon spins in via a keyframe animation (see globals.css).
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!document.startViewTransition || reduceMotion) {
      setTheme(next);
      return;
    }

    // Circle origin = button centre; radius reaches the farthest viewport corner.
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    const transition = document.startViewTransition(() => {
      // next-themes applies the class in an effect; set it now so the browser
      // captures the new theme, and keep next-themes' state/storage in sync.
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(next);
      root.style.colorScheme = next;
      flushSync(() => setTheme(next));
    });

    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: REVEAL_MS,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      // The browser skips the animation (hidden tab, a second click mid-transition);
      // the theme has still switched, so there's nothing to recover.
      .catch(() => undefined);
  };

  return (
    <AppButton
      variant="ghost"
      size="icon"
      className="rounded-full"
      aria-label="Toggle theme"
      onClick={toggle}
    >
      <Sun className="animate-theme-icon size-4 dark:hidden" aria-hidden />
      <Moon className="animate-theme-icon hidden size-4 dark:block" aria-hidden />
    </AppButton>
  );
}
