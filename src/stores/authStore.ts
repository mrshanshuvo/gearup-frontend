import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { User } from "@/types";
import { authService } from "@/services/auth.service";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  _hasHydrated: boolean;
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  setHydrated: () => void;
  checkAndRefreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      _hasHydrated: false,
      setAuth: (user, accessToken) => set({ user, accessToken }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setUser: (user) => set({ user }),
      clearAuth: () => set({ user: null, accessToken: null }),
      setHydrated: () => set({ _hasHydrated: true }),
      checkAndRefreshToken: async () => {
        const currentToken = get().accessToken;
        const cookieToken = Cookies.get("accessToken");

        // If access token is missing in store or cookies, but refreshToken exists, attempt silent refresh
        if (!currentToken || !cookieToken) {
          try {
            const res = await authService.refreshToken();
            if (res.data?.accessToken) {
              set({ accessToken: res.data.accessToken });
            }
          } catch {
            get().clearAuth();
          }
        }
      },
    }),
    {
      name: "gearup-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
        state?.checkAndRefreshToken();
      },
    }
  )
);

export default useAuthStore;
