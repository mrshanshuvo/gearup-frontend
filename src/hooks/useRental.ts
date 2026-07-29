import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rentalService, GetRentalsParams } from "@/services/rental.service";

export function useCustomerRentals(params?: GetRentalsParams) {
  return useQuery({
    queryKey: ["customer-rentals", params],
    queryFn: () => rentalService.getCustomerRentals(params),
  });
}

export function useRentalDetail(id: string) {
  return useQuery({
    queryKey: ["rental", id],
    queryFn: () => rentalService.getRentalById(id),
    enabled: !!id,
  });
}

export function useCancelRental() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => rentalService.cancelRental(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["customer-rentals"] });
      queryClient.invalidateQueries({ queryKey: ["rental", id] });
    },
  });
}
