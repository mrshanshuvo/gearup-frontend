import { axiosInstance } from "@/lib/axios";
import { ApiResponse, Category, GearItem } from "@/types";

export interface GearFilterParams {
  categoryId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  availableOnly?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export const gearService = {
  async getAllGear(
    params?: GearFilterParams
  ): Promise<ApiResponse<GearItem[]>> {
    const response = await axiosInstance.get<ApiResponse<GearItem[]>>("/gear", {
      params,
    });
    return response.data;
  },

  async getGearById(id: string): Promise<ApiResponse<GearItem>> {
    const response = await axiosInstance.get<ApiResponse<GearItem>>(
      `/gear/${id}`
    );
    return response.data;
  },

  async getAllCategories(): Promise<ApiResponse<Category[]>> {
    const response =
      await axiosInstance.get<ApiResponse<Category[]>>("/categories");
    return response.data;
  },
};
