"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";

/**
 * Persisted zustand stores use `skipHydration` so the server render and the
 * first client render agree; localStorage state is applied here, after mount.
 */
export function StoreHydrator() {
  useEffect(() => {
    void useUIStore.persist.rehydrate();
    void Promise.resolve(useAuthStore.persist.rehydrate()).finally(() =>
      useAuthStore.setState({ hydrated: true }),
    );
  }, []);

  return null;
}
