import { queryClient } from "@/providers/ReactQueryClientProvider";
import {
  createOrganization,
  createOrgLeaveType,
  getOrganization,
  getOrganizations,
  getOrgLeaveType,
  joinOrganization,
} from "@/services/organization.services";
import {
  CreateOrganizationDto,
  CreateOrgLeaveTypeDto,
  Organization,
  OrgLeaveType,
} from "@/types/organization.type";
import { User } from "@/types/user.type";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useOrganizationsQuery() {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: async () => getOrganizations(),
    retry: 3,
  });
}

export function useCreateOrgMutation() {
  return useMutation({
    mutationFn: async (variables: CreateOrganizationDto) =>
      createOrganization(variables),
    async onSuccess(data: Organization) {
      queryClient.setQueryData(["currentUser"], (cachedData: User) => {
        console.log("cachedData", cachedData);
        console.log("data", { ...cachedData, organization: data });
        return { ...cachedData, organization: data };
      });

      queryClient.setQueryData(
        ["organizations"],
        (cachedData: Organization[]) => {
          return [cachedData, data];
        },
      );
    },
  });
}

export function useJoinOrgMutation() {
  return useMutation({
    mutationFn: async (variables: { inviteCode: string }) =>
      joinOrganization(variables.inviteCode),
    async onSuccess(data: User) {
      queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });
      await queryClient.setQueryData(["currentUser"], (cachedData: User) => {
        console.log("cachedData", cachedData);
        return data;
      });
    },
  });
}

export function useGetOrgLeaveTypeQuery(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["orgleaveType", organizationId],
    queryFn: async () => getOrgLeaveType(organizationId!),
    enabled: !!organizationId,
  });
}

export function useCreateOrgLeaveTypeMutation() {
  return useMutation({
    mutationFn: async (variables: {
      organizationId: string;
      body: CreateOrgLeaveTypeDto;
    }) => createOrgLeaveType(variables.organizationId, variables.body),
    async onSuccess(
      data: OrgLeaveType,
      variables: { organizationId: string; body: CreateOrgLeaveTypeDto },
    ) {
      await queryClient.setQueryData(
        ["orgleaveType", variables.organizationId],
        (oldData: OrgLeaveType[]) => {
          return [...oldData, data];
        },
      );
    },
  });
}
