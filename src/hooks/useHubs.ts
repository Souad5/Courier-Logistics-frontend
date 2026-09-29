"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ENDPOINTS } from "@/config/api.config";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { HubsPayload, ListQuery } from "@/types";

/** Public hub list (GET /hubs). */
export function useHubs(query: ListQuery & Record<string, string | number | undefined> = {}) {
  return useQuery({
    queryKey: queryKeys.hubs.list(query),
    queryFn: () => apiClient.get<HubsPayload>(ENDPOINTS.hubs.list, { query, public: true }),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60_000,
  });
}
