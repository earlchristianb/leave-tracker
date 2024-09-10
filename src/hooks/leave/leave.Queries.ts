import { queryClient } from "@/providers/ReactQueryClientProvider";
import {
  createLeaveService,
  getAllLeavesService,
  getLeavesByUserService,
} from "@/services/leave.services";
import { CreateLeaveDtoVariable, Leave } from "@/types/leave.type";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useGetAllLeavesQuery() {
  return useQuery({
    queryKey: ["all_leaves"],
    queryFn: async () => getAllLeavesService(),
    retry: 3,
  });
}

export function useGetLeavesByUserQuery(userId: string | undefined) {
  return useQuery({
    queryKey: ["leaves", userId],
    queryFn: async () => getLeavesByUserService(userId!),
    enabled: !!userId,
    retry: 3,
  });
}

export function useCreateLeaveMutation() {
  return useMutation({
    mutationFn: async (variables: CreateLeaveDtoVariable) =>
      createLeaveService(variables),
    async onSuccess(data: Leave, variables: CreateLeaveDtoVariable) {
      console.log("Creation Data", data);
      await queryClient.setQueryData(
        ["leaves", variables.userId],
        (oldData: Leave[]) => {
          return [...oldData, data];
        },
      );
    },
    async onError(error) {
      console.log("Error", error);
    },
  });
}
