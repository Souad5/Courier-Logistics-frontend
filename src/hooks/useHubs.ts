"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ENDPOINTS } from "@/config/api.config";
import { apiClient, getErrorMessage } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { HubInput, HubPayload, HubsPayload, ListQuery } from "@/types";

/** Public hub list (GET /hubs). */
export function useHubs(query: ListQuery & Record<string, string | number | undefined> = {}) {
  return useQuery({
    queryKey: queryKeys.hubs.list(query),
    queryFn: () => apiClient.get<HubsPayload>(ENDPOINTS.hubs.list, { query, public: true }),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60_000,
  });
}

function useInvalidateHubs() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.hubs.all });
}

export function useCreateHub() {
  const invalidate = useInvalidateHubs();
  return useMutation({
    mutationFn: (input: HubInput) => apiClient.post<HubPayload>(ENDPOINTS.hubs.create, input),
    onSuccess: (result) => {
      toast.success(result.message);
      invalidate();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useUpdateHub() {
  const invalidate = useInvalidateHubs();
  return useMutation({
    mutationFn: ({ id, ...input }: HubInput & { id: string }) =>
      apiClient.patch<HubPayload>(ENDPOINTS.hubs.byId(id), input),
    onSuccess: (result) => {
      toast.success(result.message);
      invalidate();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useDeleteHub() {
  const invalidate = useInvalidateHubs();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<null>(ENDPOINTS.hubs.byId(id)),
    onSuccess: (result) => {
      toast.success(result.message);
      invalidate();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
