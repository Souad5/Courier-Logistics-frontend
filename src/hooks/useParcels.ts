"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ENDPOINTS } from "@/config/api.config";
import { apiClient, getErrorMessage } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type {
  AssignParcelInput,
  CreateParcelInput,
  ListQuery,
  ParcelPayload,
  ParcelsPayload,
  TrackingPayload,
  UpdateParcelStatusInput,
} from "@/types";

type ParcelListQuery = ListQuery & Record<string, string | number | undefined>;

/** Admin: every parcel (GET /parcels). */
export function useParcels(query: ParcelListQuery) {
  return useQuery({
    queryKey: queryKeys.parcels.list(query),
    queryFn: () => apiClient.get<ParcelsPayload>(ENDPOINTS.parcels.list, { query }),
    placeholderData: keepPreviousData,
  });
}

/** Customer: parcels I sent. Courier: parcels assigned to me. */
export function useMyParcels(query: ParcelListQuery) {
  return useQuery({
    queryKey: queryKeys.parcels.mine(query),
    queryFn: () => apiClient.get<ParcelsPayload>(ENDPOINTS.parcels.mine, { query }),
    placeholderData: keepPreviousData,
  });
}

export function useParcel(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.parcels.detail(id ?? ""),
    queryFn: () => apiClient.get<ParcelPayload>(ENDPOINTS.parcels.byId(id!)),
    enabled: Boolean(id),
    select: (result) => result.data.parcel,
  });
}

/** Public tracking — no auth header. */
export function useTrackParcel(trackingNumber: string | undefined) {
  return useQuery({
    queryKey: queryKeys.parcels.track(trackingNumber ?? ""),
    queryFn: () =>
      apiClient.get<TrackingPayload>(ENDPOINTS.parcels.track(trackingNumber!), { public: true }),
    enabled: Boolean(trackingNumber),
    select: (result) => result.data,
  });
}

function useInvalidateParcels() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.parcels.all });
}

export function useCreateParcel() {
  const invalidate = useInvalidateParcels();
  return useMutation({
    mutationFn: (input: CreateParcelInput) =>
      apiClient.post<ParcelPayload>(ENDPOINTS.parcels.create, input),
    onSuccess: (result) => {
      toast.success(result.message);
      invalidate();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useAssignParcel() {
  const invalidate = useInvalidateParcels();
  return useMutation({
    mutationFn: ({ id, ...input }: AssignParcelInput & { id: string }) =>
      apiClient.patch<ParcelPayload>(ENDPOINTS.parcels.assign(id), input),
    onSuccess: (result) => {
      toast.success(result.message);
      invalidate();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useUpdateParcelStatus() {
  const invalidate = useInvalidateParcels();
  return useMutation({
    mutationFn: ({ id, ...input }: UpdateParcelStatusInput & { id: string }) =>
      apiClient.patch<ParcelPayload>(ENDPOINTS.parcels.status(id), input),
    onSuccess: (result) => {
      toast.success(result.message);
      invalidate();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useUploadProofOfDelivery() {
  const invalidate = useInvalidateParcels();
  return useMutation({
    mutationFn: ({ id, photo }: { id: string; photo: File }) => {
      const formData = new FormData();
      formData.append("photo", photo);
      return apiClient.upload<ParcelPayload>(ENDPOINTS.parcels.proofOfDelivery(id), formData);
    },
    onSuccess: (result) => {
      toast.success(result.message);
      invalidate();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useDeleteParcel() {
  const invalidate = useInvalidateParcels();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<null>(ENDPOINTS.parcels.byId(id)),
    onSuccess: (result) => {
      toast.success(result.message);
      invalidate();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
