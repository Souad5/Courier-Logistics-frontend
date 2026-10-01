"use client";

import { X } from "lucide-react";

import type { usePagination } from "@/hooks/usePagination";

import { AppButton } from "./AppButton";

/** Resets search, filters and sort in the URL; hidden while nothing is applied. */
export function ClearFiltersButton({
  pagination,
}: {
  pagination: ReturnType<typeof usePagination>;
}) {
  if (!pagination.hasFilters) return null;
  return (
    <AppButton variant="ghost" leftIcon={<X />} onClick={pagination.clearFilters}>
      Clear filters
    </AppButton>
  );
}
