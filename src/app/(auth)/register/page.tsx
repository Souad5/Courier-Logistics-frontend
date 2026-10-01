import type { Metadata } from "next";
import Link from "next/link";

import { RegisterForm } from "@/components/modules/auth/RegisterForm";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return pageMetadata({
    title: t.auth.register.metaTitle,
    description: t.auth.register.metaDescription,
    path: "/register",
  });
}

export default async function RegisterPage() {
  const { t } = await getI18n();
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t.auth.register.title}</h1>
        <p className="text-muted-foreground text-sm">{t.auth.register.subtitle}</p>
      </div>
      <RegisterForm />
      <p className="text-muted-foreground text-center text-sm">
        {t.auth.register.haveAccount}{" "}
        <Link href="/login" className="text-foreground font-medium hover:underline">
          {t.auth.register.logIn}
        </Link>
      </p>
    </div>
  );
}
