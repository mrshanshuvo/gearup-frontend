import { axiosInstance } from "@/lib/axios";
import { ApiResponse, GearItem, RentalOrder } from "@/types";

export interface CreateGearPayload {
  name: string;
  description: string;
  brand: string;
  pricePerDay: number;
  stock: number;
  imageUrl?: string;
  categoryId: string;
}

export interface UpdateGearPayload {
  name?: string;
  description?: string;
  brand?: string;
  pricePerDay?: number;
  stock?: number;
  imageUrl?: string;
  categoryId?: string;
}

export const providerGearService = {
  async getProviderGear(providerId?: string): Promise<ApiResponse<GearItem[]>> {
    const response = await axiosInstance.get<ApiResponse<GearItem[]>>("/gear", {
      params: { providerId },
    });
    return response.data;
  },

  async createGear(payload: CreateGearPayload): Promise<ApiResponse<GearItem>> {
    const response = await axiosInstance.post<ApiResponse<GearItem>>(
      "/provider/gear",
      payload
    );
    return response.data;
  },

  async updateGear(
    id: string,
    payload: UpdateGearPayload
  ): Promise<ApiResponse<GearItem>> {
    const response = await axiosInstance.put<ApiResponse<GearItem>>(
      `/provider/gear/${id}`,
      payload
    );
    return response.data;
  },

  async deleteGear(id: string): Promise<ApiResponse<GearItem>> {
    const response = await axiosInstance.delete<ApiResponse<GearItem>>(
      `/provider/gear/${id}`
    );
    return response.data;
  },

  async getProviderOrders(): Promise<ApiResponse<RentalOrder[]>> {
    const response =
      await axiosInstance.get<ApiResponse<RentalOrder[]>>("/provider/orders");
    return response.data;
  },

  async updateOrderStatus(
    id: string,
    status: string
  ): Promise<ApiResponse<RentalOrder>> {
    const response = await axiosInstance.patch<ApiResponse<RentalOrder>>(
      `/provider/orders/${id}`,
      {
        status,
      }
    );
    return response.data;
  },
};
