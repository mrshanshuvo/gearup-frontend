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
        } catch (err: unknown) {
          const error = err as { response?: { data?: { message?: string } } };
          toast.error(
            error.response?.data?.message || "Failed to load user profile"
          );
        }
      }
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Invalid email or password");
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
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return async () => {
    // 1. Navigate away FIRST so the layout never sees user=null (prevents white flash)
    window.location.href = "/auth/login";

    // 2. Clear state + cookies in the background while navigating
    clearAuth();
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("gearup-auth");
    }

    try {
      await authService.logout();
    } catch {
      // ignore — cookie will expire naturally
    }

    toast.info("Logged out successfully");
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
