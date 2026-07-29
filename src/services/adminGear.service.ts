import { axiosInstance } from "@/lib/axios";
import { ApiResponse, GearItem, RentalOrder } from "@/types";

export const adminGearService = {
  async getAllGearAdmin(): Promise<ApiResponse<GearItem[]>> {
    const response =
      await axiosInstance.get<ApiResponse<GearItem[]>>("/admin/gear");
    return response.data;
  },

  async getAllRentalsAdmin(): Promise<ApiResponse<RentalOrder[]>> {
    const response =
      await axiosInstance.get<ApiResponse<RentalOrder[]>>("/admin/rentals");
    return response.data;
  },
};
