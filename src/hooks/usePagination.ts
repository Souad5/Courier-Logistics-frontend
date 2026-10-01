"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import type { ListQuery } from "@/types";

const MAX_LIMIT = 100; // backend QueryBuilder cap

/**
 * Keeps list state (page, limit, search, sort and any extra filters) in the URL
 * so lists are shareable and survive reloads. Pages that use this must render
 * inside a <Suspense> boundary (useSearchParams requirement).
 */
export function usePagination(defaults: { limit?: number } = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = useMemo<ListQuery & Record<string, string | number | undefined>>(() => {
    const params = Object.fromEntries(searchParams.entries());
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(MAX_LIMIT, Math.max(1, Number(params.limit) || defaults.limit || 10));
    return { ...params, page, limit };
  }, [searchParams, defaults.limit]);

  const setParams = useCallback(
    (updates: Record<string, string | number | null | undefined>, resetPage = true) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === undefined || value === "") next.delete(key);
        else next.set(key, String(value));
      }
      if (resetPage && !("page" in updates)) next.delete("page");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  // Everything except paging is a filter the user chose (search, status, sort…).
  const filterKeys = [...searchParams.keys()].filter((key) => key !== "page" && key !== "limit");

  return {
    query,
    hasFilters: filterKeys.length > 0,
    clearFilters: () => setParams(Object.fromEntries(filterKeys.map((key) => [key, null]))),
    setPage: (page: number) => setParams({ page }, false),
    setLimit: (limit: number) => setParams({ limit }),
    setSearch: (search: string) => setParams({ search }),
    setFilter: (key: string, value: string | null) => setParams({ [key]: value }),
    setParams,
  };
}
