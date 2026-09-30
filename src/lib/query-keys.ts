import type { ListQuery } from "@/types";

/** Central React Query key factory — invalidate by prefix, e.g. queryKeys.parcels.all. */
export const queryKeys = {
  me: ["me"] as const,
  parcels: {
    all: ["parcels"] as const,
    list: (query: ListQuery & Record<string, unknown>) => ["parcels", "list", query] as const,
    mine: (query: ListQuery & Record<string, unknown>) => ["parcels", "mine", query] as const,
    detail: (id: string) => ["parcels", "detail", id] as const,
    track: (trackingNumber: string) => ["parcels", "track", trackingNumber] as const,
  },
  hubs: {
    all: ["hubs"] as const,
    list: (query: ListQuery & Record<string, unknown>) => ["hubs", "list", query] as const,
  },
  users: {
    all: ["users"] as const,
    list: (query: ListQuery & Record<string, unknown>) => ["users", "list", query] as const,
  },
  payments: {
    detail: (id: string) => ["payments", id] as const,
  },
  admin: {
    stats: (days: number) => ["admin", "stats", days] as const,
    auditLogs: (query: ListQuery & Record<string, unknown>) =>
      ["admin", "audit-logs", query] as const,
  },
};
