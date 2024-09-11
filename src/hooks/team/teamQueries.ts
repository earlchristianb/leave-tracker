import { queryClient } from "@/providers/ReactQueryClientProvider";
import {
  addTeamService,
  getTeamsByOrganizationService,
  joinTeamService,
  updateTeamService,
} from "@/services/teams.services";
import {
  CreateTeamDto,
  JoinTeamDto,
  Team,
  UpdateTeamDto,
} from "@/types/team.type";
import { User } from "@/types/user.type";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useTeamsByOrgQuery = (organizationId: string | undefined) => {
  return useQuery({
    queryKey: ["teams", organizationId],
    queryFn: async () => getTeamsByOrganizationService(organizationId),
    enabled: !!organizationId,
    retry: 3,
  });
};

export const useAddTeamMutation = () => {
  return useMutation({
    mutationFn: async (variables: {
      organizationId: string | undefined;
      teamData: CreateTeamDto;
    }) => addTeamService(variables.organizationId, variables.teamData),
    async onSuccess(data, variables, context) {
      await queryClient.setQueryData(
        ["teams", variables.organizationId],
        (oldData: any) => {
          return [...oldData, data];
        },
      );
      return true;
    },
    onError(error, variables, context) {
      console.log("Error adding team", error);
      return false;
    },
  });
};

export const useJoinTeamMutation = () => {
  return useMutation({
    mutationFn: async (variables: JoinTeamDto) => joinTeamService(variables),
    async onSuccess(data: User, variables: JoinTeamDto, context) {
      console.log("Joined team", data);
      queryClient.setQueryData(["currentUser"], (oldData: User) => {
        return data;
      });
    },
    onError(error, variables, context) {
      console.log("Error joining team", error);
    },
  });
};

export const useUpdateTeamMutation = () => {
  return useMutation({
    mutationFn: async (variables: {
      id: string;
      body: UpdateTeamDto;
      organizationId: string;
    }) => updateTeamService(variables.id, variables.body),
    async onSuccess(data, variables, context) {
      console.log("Updated team", data);
      await queryClient.setQueryData(
        ["teams", variables.organizationId],
        (oldData: any) => {
          return oldData.map((team: Team) => {
            if (team.id === variables.id) {
              return { ...team, ...variables.body };
            }
            return team;
          });
        },
      );
    },
    onError(error, variables, context) {
      console.log("Error updating team", error);
    },
  });
};
