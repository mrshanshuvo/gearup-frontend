import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  providerGearService,
  CreateGearPayload,
  UpdateGearPayload,
} from "@/services/providerGear.service";

export function useProviderGearList(providerId?: string) {
  return useQuery({
    queryKey: ["provider-gear", providerId],
    queryFn: () => providerGearService.getProviderGear(providerId),
    enabled: !!providerId,
  });
}

export function useCreateGear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateGearPayload) =>
      providerGearService.createGear(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-gear"] });
      queryClient.invalidateQueries({ queryKey: ["gear"] });
    },
  });
}

export function useUpdateGear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGearPayload }) =>
      providerGearService.updateGear(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["provider-gear"] });
      queryClient.invalidateQueries({ queryKey: ["gear", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["gear"] });
    },
  });
}

export function useDeleteGear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => providerGearService.deleteGear(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-gear"] });
      queryClient.invalidateQueries({ queryKey: ["gear"] });
    },
  });
}

export function useProviderOrders() {
  return useQuery({
    queryKey: ["provider-orders"],
    queryFn: () => providerGearService.getProviderOrders(),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      providerGearService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-orders"] });
    },
  });
}
