"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ENDPOINTS } from "@/config/api.config";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { AuditLogsPayload, ListQuery, StatsPayload } from "@/types";

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.admin.stats,
    queryFn: () => apiClient.get<StatsPayload>(ENDPOINTS.admin.stats),
    select: (result) => result.data.stats,
  });
}

export function useAuditLogs(query: ListQuery & Record<string, string | number | undefined>) {
  return useQuery({
    queryKey: queryKeys.admin.auditLogs(query),
    queryFn: () => apiClient.get<AuditLogsPayload>(ENDPOINTS.admin.auditLogs, { query }),
    placeholderData: keepPreviousData,
  });
}
