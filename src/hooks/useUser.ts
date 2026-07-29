import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService, UpdateMyProfilePayload } from "@/services/user.service";
import useAuthStore from "@/stores/authStore";

export function useMyProfile() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => userService.getMyProfile(),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);
  const accessToken = useAuthStore((state) => state.accessToken);

  return useMutation({
    mutationFn: (payload: UpdateMyProfilePayload) =>
      userService.updateMyProfile(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      if (response.data && accessToken) {
        setAuth(response.data, accessToken);
      }
    },
  });
}
