import axios from "axios";
import Cookies from "js-cookie";
import useAuthStore from "@/stores/authStore";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token and ensure cookie stays in sync
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

      // Ensure cookie is synced with memory token during SPA client navigation
      if (!Cookies.get("accessToken")) {
        Cookies.set("accessToken", token, {
          expires: 7,
          path: "/",
        });
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for silent refresh token retry
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        if (data?.data?.accessToken) {
          const newAccessToken = data.data.accessToken;
          useAuthStore.getState().setAccessToken(newAccessToken);

          // Sync cookie so proxy.ts (middleware) also gets updated token
          Cookies.set("accessToken", newAccessToken, {
            expires: 7,
            path: "/",
          });

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch {
        useAuthStore.getState().clearAuth();
        Cookies.remove("accessToken", { path: "/" });
      }
    }

    return Promise.reject(error);
  }
);
