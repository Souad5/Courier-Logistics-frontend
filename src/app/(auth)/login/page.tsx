import type { Metadata } from "next";
import Link from "next/link";

import { DemoLoginButtons } from "@/components/modules/auth/DemoLoginButtons";
import { LoginForm } from "@/components/modules/auth/LoginForm";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Log in",
  description:
    "Log in to book parcels, pay securely and track every delivery — or try a one-click demo account.",
  path: "/login",
});

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground text-sm">
          Log in to manage your parcels and deliveries.
        </p>
      </div>
      <LoginForm />
      <DemoLoginButtons />
      <p className="text-muted-foreground text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-foreground font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
