import { axiosInstance } from "@/lib/axios";
import { ApiResponse, User } from "@/types";

export interface UpdateMyProfilePayload {
  name?: string;
  profile_image?: string;
  bio?: string;
}

export const userService = {
  async getMyProfile(): Promise<ApiResponse<User>> {
    const response = await axiosInstance.get<ApiResponse<User>>("/auth/me");
    return response.data;
  },

  async updateMyProfile(
    payload: UpdateMyProfilePayload
  ): Promise<ApiResponse<User>> {
    const response = await axiosInstance.put<ApiResponse<User>>(
      "/auth/me",
      payload
    );
    return response.data;
  },
};
