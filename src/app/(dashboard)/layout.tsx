import type { Metadata } from "next";

import { DashboardShell } from "@/components/shared/DashboardShell";
import { noIndexRobots } from "@/lib/seo";

// Private, per-user pages: keep every dashboard route out of search results.
export const metadata: Metadata = { robots: noIndexRobots };

// Access control happens in src/proxy.ts before any of these pages render.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
