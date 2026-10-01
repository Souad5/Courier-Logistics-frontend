import { CircleX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AppButton } from "@/components/shared/AppButton";
import { Card, CardContent } from "@/components/ui/card";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.payments.cancel.metaTitle };
}

export default async function PaymentCancelPage() {
  const { t } = await getI18n();
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="bg-destructive/10 text-destructive rounded-full p-4">
          <CircleX className="size-8" />
        </div>
        <h1 className="text-2xl font-semibold">{t.payments.cancel.title}</h1>
        <p className="text-muted-foreground text-sm">{t.payments.cancel.description}</p>
        <AppButton asChild>
          <Link href="/customer/parcels">{t.payments.cancel.back}</Link>
        </AppButton>
      </CardContent>
    </Card>
  );
}
