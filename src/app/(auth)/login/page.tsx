import type { Metadata } from "next";
import Link from "next/link";

import { DemoLoginButtons } from "@/components/modules/auth/DemoLoginButtons";
import { LoginForm } from "@/components/modules/auth/LoginForm";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return pageMetadata({
    title: t.auth.login.metaTitle,
    description: t.auth.login.metaDescription,
    path: "/login",
  });
}

export default async function LoginPage() {
  const { t } = await getI18n();
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t.auth.login.title}</h1>
        <p className="text-muted-foreground text-sm">{t.auth.login.subtitle}</p>
      </div>
      <LoginForm />
      <DemoLoginButtons />
      <p className="text-muted-foreground text-center text-sm">
        {t.auth.login.noAccount}{" "}
        <Link href="/register" className="text-foreground font-medium hover:underline">
          {t.auth.login.signUp}
        </Link>
      </p>
    </div>
  );
}
