"use client";

import type { ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";

import { AuthProvider } from "./auth-provider";
import { QueryProvider } from "./query-provider";
import { StoreHydrator } from "./store-hydrator";
import { ThemeProvider } from "./theme-provider";

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <StoreHydrator />
        <AuthProvider>{children}</AuthProvider>
        <Toaster richColors closeButton position="top-right" />
      </QueryProvider>
    </ThemeProvider>
  );
}
