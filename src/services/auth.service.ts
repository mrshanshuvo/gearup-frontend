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
      // Sync cookie for Next.js Middleware with explicit path='/'
      Cookies.set("accessToken", response.data.data.accessToken, {
        expires: 7,
        path: "/",
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

  async logout(): Promise<void> {
    try {
      await axiosInstance.post("/auth/logout");
    } catch {
      // Ignore network/auth errors during logout call
    }

    // Remove cookies across all possible path variations
    Cookies.remove("accessToken", { path: "/" });
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken", { path: "/" });
    Cookies.remove("refreshToken");

    if (typeof document !== "undefined") {
      document.cookie =
        "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      document.cookie =
        "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }
  },
};
