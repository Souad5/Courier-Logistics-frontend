import { DashboardShell } from "@/components/shared/DashboardShell";

// Access control happens in src/proxy.ts before any of these pages render.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
