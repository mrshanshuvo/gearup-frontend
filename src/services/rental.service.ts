import { axiosInstance } from "@/lib/axios";
import { ApiResponse, RentalOrder } from "@/types";

export interface GetRentalsParams {
  page?: number;
  limit?: number;
  status?: string;
}

export const rentalService = {
  async getCustomerRentals(
    params?: GetRentalsParams
  ): Promise<ApiResponse<RentalOrder[]>> {
    const response = await axiosInstance.get<ApiResponse<RentalOrder[]>>(
      "/rentals",
      { params }
    );
    return response.data;
  },

  async getRentalById(id: string): Promise<ApiResponse<RentalOrder>> {
    const response = await axiosInstance.get<ApiResponse<RentalOrder>>(
      `/rentals/${id}`
    );
    return response.data;
  },

  async cancelRental(id: string): Promise<ApiResponse<RentalOrder>> {
    const response = await axiosInstance.patch<ApiResponse<RentalOrder>>(
      `/provider/orders/${id}`,
      {
        status: "CANCELLED",
      }
    );
    return response.data;
  },
};
