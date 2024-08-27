import { queryClient } from "@/providers/ReactQueryClientProvider";
import { createLeave, getLeavesByUser } from "@/services/leave.services";
import {
  CreateLeaveDto,
  CreateLeaveDtoVariable,
  Leave,
} from "@/types/leave.type";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useGetLeavesByUserQuery(userId: string | undefined) {
  return useQuery({
    queryKey: ["leaves", userId],
    queryFn: async () => getLeavesByUser(userId!),
    enabled: !!userId,
    retry: 3,
  });
}

export function useCreateLeaveMutation() {
  return useMutation({
    mutationFn: async (variables: CreateLeaveDtoVariable) =>
      createLeave(variables),
    async onSuccess(data: Leave, variables: CreateLeaveDtoVariable) {
      console.log("Creation Data", data);
      await queryClient.setQueryData(
        ["leaves", variables.userId],
        (oldData: Leave[]) => {
          return [...oldData, data];
        },
      );
    },
  });
}
