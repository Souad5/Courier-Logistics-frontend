import { CircleX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AppButton } from "@/components/shared/AppButton";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Payment cancelled" };

export default function PaymentCancelPage() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="bg-destructive/10 text-destructive rounded-full p-4">
          <CircleX className="size-8" />
        </div>
        <h1 className="text-2xl font-semibold">Payment cancelled</h1>
        <p className="text-muted-foreground text-sm">
          No charge was made. Your parcel is saved as pending — you can pay for it any time.
        </p>
        <AppButton asChild>
          <Link href="/customer/parcels">Back to my parcels</Link>
        </AppButton>
      </CardContent>
    </Card>
  );
}
