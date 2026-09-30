"use client";

import { Power } from "lucide-react";

import { AppButton } from "@/components/shared/AppButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateAvailability } from "@/hooks/useUsers";
import { useAuthStore } from "@/store/auth.store";

export function AvailabilityToggle() {
  const user = useAuthStore((s) => s.user);
  const update = useUpdateAvailability();

  if (!user) return <Skeleton className="h-40 max-w-xl" />;

  const available = user.isAvailable ?? false;

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>{available ? "You are available" : "You are unavailable"}</CardTitle>
        <CardDescription>
          {available
            ? "Admins can assign new parcels to you."
            : "You won't be offered new assignments until you switch back."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AppButton
          variant={available ? "outline" : "default"}
          leftIcon={<Power />}
          loading={update.isPending}
          onClick={() => update.mutate(!available)}
        >
          {available ? "Go unavailable" : "Go available"}
        </AppButton>
      </CardContent>
    </Card>
  );
}
