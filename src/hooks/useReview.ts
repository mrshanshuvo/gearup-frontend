import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService, CreateReviewPayload } from "@/services/review.service";

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) =>
      reviewService.createReview(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-rentals"] });
    },
  });
}
