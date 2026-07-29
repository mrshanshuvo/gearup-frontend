import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  paymentService,
  ConfirmPaymentPayload,
} from "@/services/payment.service";

export function useCreatePaymentIntent() {
  return useMutation({
    mutationFn: (rentalOrderId: string) =>
      paymentService.createPaymentIntent(rentalOrderId),
  });
}

export function useConfirmPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ConfirmPaymentPayload) =>
      paymentService.confirmPayment(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customer-rentals"] });
      queryClient.invalidateQueries({
        queryKey: ["rental", variables.rentalOrderId],
      });
    },
  });
}

export function useCustomerPayments() {
  return useQuery({
    queryKey: ["customer-payments"],
    queryFn: () => paymentService.getCustomerPayments(),
  });
}
