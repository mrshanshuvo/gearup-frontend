import { useQuery } from "@tanstack/react-query";
import { adminGearService } from "@/services/adminGear.service";

export function useAdminGearList() {
  return useQuery({
    queryKey: ["admin-gear"],
    queryFn: () => adminGearService.getAllGearAdmin(),
  });
}

export function useAllRentalsAdmin() {
  return useQuery({
    queryKey: ["admin-rentals"],
    queryFn: () => adminGearService.getAllRentalsAdmin(),
  });
}
