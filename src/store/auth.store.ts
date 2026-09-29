import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { authStorage } from "@/lib/auth-storage";
import type { AuthTokens, Role, User } from "@/types";

interface AuthState {
  user: User | null;
  /**
   * True once the persisted state has been read from localStorage. Rehydration
   * is triggered after mount by StoreHydrator (skipHydration), so the first
   * client render matches the server render.
   */
  hydrated: boolean;
  setSession: (user: User, tokens: AuthTokens) => void;
  setUser: (user: User) => void;
  clear: () => void;
}

/**
 * Tokens are stored in cookies (lib/auth-storage.ts); only the non-secret user
 * profile is persisted here so the UI can render instantly on reload.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hydrated: false,
      setSession: (user, tokens) => {
        authStorage.setTokens(tokens);
        set({ user });
      },
      setUser: (user) => set({ user }),
      clear: () => {
        authStorage.clear();
        set({ user: null });
      },
    }),
    {
      name: "courier-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
      skipHydration: true,
    },
  ),
);

export const selectRole = (state: AuthState): Role | null => state.user?.role ?? null;
