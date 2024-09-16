import { queryClient } from "@/providers/ReactQueryClientProvider";
import {
  createLeaveService,
  getAllLeavesService,
  getLeavesByPaginationAndFilterService,
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

export function useGetLeavesWithPaginationAndFilterQuery({
  userId,
  skip,
  limit,
  leaveTypeId,
}: {
  userId: string | undefined;
  skip: number;
  limit: number;
  leaveTypeId: string;
}) {
  return useQuery({
    queryKey: ["leaves", { userId, skip, limit, leaveTypeId }],
    queryFn: async () =>
      getLeavesByPaginationAndFilterService({
        userId,
        skip,
        limit,
        leaveTypeId,
      }),
    enabled: true,
    retry: 3,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
  });
}

export function useCreateLeaveMutation() {
  return useMutation({
    mutationFn: async (variables: CreateLeaveDtoVariable) =>
      createLeaveService(variables),
    async onSuccess(data: Leave) {
      console.log("Creation Data", data);
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "leaves",
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["all_leaves"],
      });
    },
    async onError(error) {
      console.log("Error", error);
    },
  });
}
