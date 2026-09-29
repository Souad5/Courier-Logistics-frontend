"use client";

import { useQuery } from "@tanstack/react-query";
import { type ReactNode, useEffect } from "react";

import { ENDPOINTS } from "@/config/api.config";
import { apiClient, onSessionExpired } from "@/lib/api-client";
import { authStorage } from "@/lib/auth-storage";
import { queryKeys } from "@/lib/query-keys";
import { useAuthStore } from "@/store/auth.store";
import type { UserPayload } from "@/types";

/**
 * Keeps the persisted user profile in sync with the backend:
 * - with a token, fetches GET /users/me once and stores the fresh profile;
 * - without a token (e.g. cookies cleared), drops any stale persisted user;
 * - when the api client gives up on a 401, clears the store.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const clear = useAuthStore((s) => s.clear);
  const hydrated = useAuthStore((s) => s.hydrated);
  // `hydrated` only flips on the client, so the cookie is never read during SSR.
  const hasToken = hydrated && Boolean(authStorage.getAccessToken());

  useEffect(() => {
    if (hydrated && !hasToken) clear();
  }, [hydrated, hasToken, clear]);

  useEffect(() => onSessionExpired(() => clear()), [clear]);

  const me = useQuery({
    queryKey: queryKeys.me,
    queryFn: () => apiClient.get<UserPayload>(ENDPOINTS.users.me),
    enabled: hasToken,
    staleTime: 5 * 60_000,
  });

  useEffect(() => {
    if (me.data) setUser(me.data.data.user);
  }, [me.data, setUser]);

  return children;
}
