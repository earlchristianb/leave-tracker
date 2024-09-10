import { queryClient } from "@/providers/ReactQueryClientProvider";
import { createUserService, getAllUserService, getUserService } from "@/services/user.services";
import { CreateUserDto, User } from "@/types/user.type";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useCurrentUserQuery(
  userId: string | undefined,
  user: KindeUser | null
) {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => await getUserService(userId),
    enabled: !!user
  });
}

export function useGetUserQuery(userId: string | undefined) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => await getUserService(userId),
    enabled: !!userId
  });
}

export function useGetAllUserByOrgQuery(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["all_users", organizationId],
    queryFn: async () => await getAllUserService(organizationId!),
    enabled: !!organizationId
  });
}

export function useCreateUserMutation() {
  return useMutation({
    mutationFn: async (variables: CreateUserDto): Promise<User> =>
      createUserService(variables),
    async onSuccess(data) {
      console.log("Creation Data", data);
      await queryClient.setQueryData(["currentUser"], data);
      await queryClient.refetchQueries({
        queryKey: ["organizations"]
      });
    }
  });
}
