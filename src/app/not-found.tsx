import { PackageX } from "lucide-react";
import Link from "next/link";

import { AppButton } from "@/components/shared/AppButton";
import { getI18n } from "@/i18n/server";

export default async function NotFound() {
  const { t } = await getI18n();
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <div className="bg-muted rounded-full p-4">
        <PackageX className="text-muted-foreground size-8" />
      </div>
      <p className="text-foreground text-sm font-medium">404</p>
      <h1 className="text-3xl font-semibold tracking-tight">{t.errors.notFound.title}</h1>
      <p className="text-muted-foreground max-w-md text-sm">{t.errors.notFound.description}</p>
      <div className="flex gap-2">
        <AppButton asChild>
          <Link href="/">{t.errors.notFound.home}</Link>
        </AppButton>
        <AppButton asChild variant="outline">
          <Link href="/contact">{t.errors.notFound.contact}</Link>
        </AppButton>
      </div>
    </div>
  );
}
