import { axiosInstance } from "@/lib/axios";
import { ApiResponse, User } from "@/types";

export interface GetUsersParams {
  page?: number;
  limit?: number;
  role?: string;
  active_status?: string;
}

export const adminUserService = {
  async getAllUsers(params?: GetUsersParams): Promise<ApiResponse<User[]>> {
    const response = await axiosInstance.get<ApiResponse<User[]>>(
      "/admin/users",
      { params }
    );
    return response.data;
  },

  async updateUserStatus(
    id: string,
    active_status: string
  ): Promise<ApiResponse<User>> {
    const response = await axiosInstance.patch<ApiResponse<User>>(
      `/admin/users/${id}`,
      {
        active_status,
      }
    );
    return response.data;
  },
};
