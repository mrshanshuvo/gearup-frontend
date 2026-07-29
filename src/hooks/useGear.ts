import { useQuery } from "@tanstack/react-query";
import { gearService, GearFilterParams } from "@/services/gear.service";

export function useGearList(params?: GearFilterParams) {
  return useQuery({
    queryKey: ["gear", params],
    queryFn: () => gearService.getAllGear(params),
  });
}

export function useGearDetail(id: string) {
  return useQuery({
    queryKey: ["gear", id],
    queryFn: () => gearService.getGearById(id),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => gearService.getAllCategories(),
  });
}
