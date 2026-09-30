import type { Metadata } from "next";
import Link from "next/link";

import { RegisterForm } from "@/components/modules/auth/RegisterForm";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Create account",
  description:
    "Create a free account to send parcels as a customer, or sign up to deliver as a courier.",
  path: "/register",
});

export default function RegisterPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-muted-foreground text-sm">
          Send parcels as a customer, or sign up to deliver as a courier.
        </p>
      </div>
      <RegisterForm />
      <p className="text-muted-foreground text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-foreground font-medium hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
