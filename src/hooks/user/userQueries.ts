import { queryClient } from "@/providers/ReactQueryClientProvider";
import { createUser, getUser } from "@/services/user.services";
import { CreateUserDto, User } from "@/types/user.type";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useCurrentUserQuery(
  userId: string | undefined,
  user: KindeUser | null,
) {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => await getUser(userId),
    enabled: !!user,
  });
}

export function useCreateUserMutation() {
  return useMutation({
    mutationFn: async (variables: CreateUserDto): Promise<User> =>
      createUser(variables),
    async onSuccess(data) {
      console.log("Creation Data", data);
      await queryClient.setQueryData(["currentUser"], data);
      await queryClient.refetchQueries({
        queryKey: ["organizations"],
      });
    },
  });
}
