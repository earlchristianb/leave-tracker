import { CreateTeamDto, JoinTeamDto, Team } from "@/types/team.type";
import { User } from "@/types/user.type";
import axios from "axios";

export const getTeamsByOrganizationService = async (
  organizationId: string | undefined,
): Promise<Team[]> => {
  const response = await axios.get(
    `/api/team?organizationId=${organizationId}`,
  );
  return response.data;
};

export const getTeamService = async (teamId: string) => {
  const response = await axios.get(`/api/team/${teamId}`);
  return response.data;
};

export const addTeamService = async (
  organizationId: string | undefined,
  body: CreateTeamDto,
) => {
  const response = await axios.post(
    `/api/team?organizationId=${organizationId}`,
    body,
  );
  return response.data;
};

export const joinTeamService = async (body: JoinTeamDto): Promise<User> => {
  const response = await axios.post(`/api/team/${body.teamId}`, body.body);
  return response.data;
};
