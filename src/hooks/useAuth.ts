import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import useAuthStore from "@/stores/authStore";
import { LoginInput, RegisterInput } from "@/validations/auth.schema";

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: async (res) => {
      if (res.success && res.data) {
        const { accessToken } = res.data;

        try {
          // Immediately store token so axiosInstance request interceptor attaches Bearer token to getMe()
          useAuthStore.getState().setAccessToken(accessToken);

          const profileRes = await authService.getMe();
          if (profileRes.success && profileRes.data) {
            setAuth(profileRes.data, accessToken);
            toast.success("Login successful!");

            switch (profileRes.data.role) {
              case "Admin":
                router.push("/dashboard/admin");
                break;
              case "Provider":
                router.push("/dashboard/provider");
                break;
              default:
                router.push("/dashboard/customer");
                break;
            }
          }
        } catch (err: any) {
          toast.error(
            err.response?.data?.message || "Failed to load user profile"
          );
        }
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Invalid email or password");
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Account created successfully! Please log in.");
        router.push("/auth/login");
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Registration failed");
    },
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return async () => {
    // 1. Clear Zustand state first synchronously
    clearAuth();

    // 2. Clear backend session & cookies
    await authService.logout();

    // 3. Clear Zustand persisted localStorage backup explicitly
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("gearup-auth");
    }

    toast.info("Logged out successfully");

    // 4. Force browser navigation to login page
    window.location.href = "/auth/login";
  };
}

export function useMe() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await authService.getMe();
      if (res.data) {
        setUser(res.data);
      }
      return res.data;
    },
    enabled: !!accessToken,
  });
}
