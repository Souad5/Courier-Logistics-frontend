import type { Metadata } from "next";
import Link from "next/link";

import { DemoLoginButtons } from "@/components/modules/auth/DemoLoginButtons";
import { LoginForm } from "@/components/modules/auth/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Log in",
  description:
    "Log in to book parcels, pay securely and track every delivery — or try a one-click demo account.",
  path: "/login",
});

export default function LoginPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Log in to manage your parcels and deliveries.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <LoginForm />
        <DemoLoginButtons />
        <p className="text-muted-foreground text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
