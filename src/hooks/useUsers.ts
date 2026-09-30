"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ENDPOINTS } from "@/config/api.config";
import { apiClient, getErrorMessage } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { ListQuery, UsersPayload } from "@/types";
import type { Role } from "@/types/enums";

export function useUsers(query: ListQuery & Record<string, string | number | undefined> = {}) {
  return useQuery({
    queryKey: queryKeys.users.list(query),
    queryFn: () => apiClient.get<UsersPayload>(ENDPOINTS.users.list, { query }),
    placeholderData: keepPreviousData,
  });
}

function useInvalidateUsers() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
}

export function useChangeUserRole() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: Role }) =>
      apiClient.patch<null>(ENDPOINTS.users.role(userId), { role }),
    onSuccess: (result) => {
      toast.success(result.message);
      invalidate();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
