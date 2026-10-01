"use client";

import { PackageSearch, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AppButton } from "@/components/shared/AppButton";
import { AppInput } from "@/components/shared/form";
import { useI18n } from "@/i18n/client";

export function TrackParcelForm({
  defaultValue = "",
  className = "max-w-lg",
}: {
  defaultValue?: string;
  /** Width constraint for the form; defaults to max-w-lg. */
  className?: string;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const [trackingNumber, setTrackingNumber] = useState(defaultValue);
  const [isNavigating, setIsNavigating] = useState(false);

  return (
    <search className={`w-full ${className}`}>
      <form
        className="flex w-full items-start gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          const value = trackingNumber.trim().toUpperCase();
          if (!value || value === defaultValue) return;
          setIsNavigating(true);
          router.push(`/track/${encodeURIComponent(value)}`);
        }}
      >
        <AppInput
          value={trackingNumber}
          onChange={(event) => setTrackingNumber(event.target.value)}
          placeholder={t.tracking.form.placeholder}
          aria-label={t.tracking.form.label}
          autoComplete="off"
          spellCheck={false}
          leftIcon={<PackageSearch />}
          className="h-11"
          containerClassName="flex-1"
        />
        <AppButton
          type="submit"
          size="lg"
          className="h-11"
          leftIcon={<Search />}
          loading={isNavigating}
        >
          {t.tracking.form.submit}
        </AppButton>
      </form>
    </search>
  );
}
