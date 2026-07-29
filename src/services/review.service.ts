import { axiosInstance } from "@/lib/axios";
import { ApiResponse, Review } from "@/types";

export interface CreateReviewPayload {
  gearItemId: string;
  rating: number;
  comment?: string;
}

export const reviewService = {
  async createReview(
    payload: CreateReviewPayload
  ): Promise<ApiResponse<Review>> {
    const response = await axiosInstance.post<ApiResponse<Review>>(
      "/reviews",
      payload
    );
    return response.data;
  },
};
