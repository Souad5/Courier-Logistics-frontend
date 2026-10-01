"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ENDPOINTS, ROLE_HOME } from "@/config/api.config";
import { useI18n } from "@/i18n/client";
import { apiClient, getErrorMessage } from "@/lib/api-client";
import { authStorage } from "@/lib/auth-storage";
import { useAuthStore } from "@/store/auth.store";
import type { AuthPayload, LoginInput, RegisterInput, Role } from "@/types";

/** Only follow a ?redirect= that stays on-site and inside the user's own area. */
function resolveRedirect(role: Role, redirect: string | null): string {
  const home = ROLE_HOME[role];
  if (redirect?.startsWith("/") && !redirect.startsWith("//") && redirect.startsWith(home)) {
    return redirect;
  }
  return home;
}

export function useAuth() {
  const router = useRouter();
  const { t, format } = useI18n();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const setSession = useAuthStore((s) => s.setSession);
  const clear = useAuthStore((s) => s.clear);

  const onAuthenticated = ({ user, tokens }: AuthPayload, message: string) => {
    queryClient.clear();
    setSession(user, tokens);
    toast.success(message);
    // Read at call time (not via useSearchParams) so this hook can be used in any
    // component — e.g. the navbar — without forcing a Suspense boundary.
    const redirect = new URLSearchParams(window.location.search).get("redirect");
    router.replace(resolveRedirect(user.role, redirect));
    router.refresh();
  };

  const login = useMutation({
    mutationFn: (input: LoginInput) =>
      apiClient.post<AuthPayload>(ENDPOINTS.auth.login, input, { public: true }),
    onSuccess: (result) =>
      onAuthenticated(
        result.data,
        format(t.nav.account.welcomeBack, { name: result.data.user.name }),
      ),
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const register = useMutation({
    mutationFn: (input: RegisterInput) =>
      apiClient.post<AuthPayload>(ENDPOINTS.auth.register, input, { public: true }),
    onSuccess: (result) => onAuthenticated(result.data, t.nav.account.accountCreated),
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const logout = useMutation({
    mutationFn: async () => {
      const refreshToken = authStorage.getRefreshToken();
      // Best effort: revoke the refresh token server-side, but always log out locally.
      if (refreshToken) {
        await apiClient
          .post(ENDPOINTS.auth.logout, { refreshToken }, { public: true })
          .catch(() => undefined);
      }
    },
    onSettled: () => {
      clear();
      queryClient.clear();
      toast.success(t.nav.account.loggedOut);
      router.replace("/login");
      router.refresh();
    },
  });

  return {
    user,
    role: user?.role ?? null,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
  };
}
