import { PackageX } from "lucide-react";
import Link from "next/link";

import { AppButton } from "@/components/shared/AppButton";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <div className="bg-muted rounded-full p-4">
        <PackageX className="text-muted-foreground size-8" />
      </div>
      <p className="text-primary text-sm font-medium">404</p>
      <h1 className="text-3xl font-semibold tracking-tight">This page got lost in transit</h1>
      <p className="text-muted-foreground max-w-md text-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-2">
        <AppButton asChild>
          <Link href="/">Back to home</Link>
        </AppButton>
        <AppButton asChild variant="outline">
          <Link href="/contact">Contact support</Link>
        </AppButton>
      </div>
    </div>
  );
}
