import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUserService, GetUsersParams } from "@/services/adminUser.service";

export function useAllUsers(params?: GetUsersParams) {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => adminUserService.getAllUsers(params),
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      active_status,
    }: {
      id: string;
      active_status: string;
    }) => adminUserService.updateUserStatus(id, active_status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}
