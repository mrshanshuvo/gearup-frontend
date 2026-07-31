import Cookies from "js-cookie";
import { axiosInstance } from "@/lib/axios";
import { ApiResponse, User } from "@/types";
import { LoginInput, RegisterInput } from "@/validations/auth.schema";

export interface AuthResponseData {
  accessToken: string;
  user?: User;
}

export const authService = {
  async login(data: LoginInput): Promise<ApiResponse<AuthResponseData>> {
    const response = await axiosInstance.post<ApiResponse<AuthResponseData>>(
      "/auth/login",
      data
    );
    if (response.data.data?.accessToken) {
      // Sync cookie for Next.js Middleware
      Cookies.set("accessToken", response.data.data.accessToken, {
        expires: 7,
      });
    }
    return response.data;
  },

  async register(data: RegisterInput): Promise<ApiResponse<User>> {
    const response = await axiosInstance.post<ApiResponse<User>>(
      "/auth/register",
      data
    );
    return response.data;
  },

  async getMe(): Promise<ApiResponse<User>> {
    const response = await axiosInstance.get<ApiResponse<User>>("/auth/me");
    return response.data;
  },

  async updateMe(data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await axiosInstance.put<ApiResponse<User>>(
      "/auth/me",
      data
    );
    return response.data;
  },

  logout(): void {
    Cookies.remove("accessToken", { path: "/" });
    Cookies.remove("accessToken");
    if (typeof document !== "undefined") {
      document.cookie =
        "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  },
};
