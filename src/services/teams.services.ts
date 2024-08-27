import { Organization } from "@/types/organization.type";
import { CreateTeamDto, JoinTeamDto, Team } from "@/types/team.type";
import { User } from "@/types/user.type";
import axios from "axios";

export const getTeamsByOrganization = async (
  organizationId: string | undefined,
): Promise<Team[]> => {
  const response = await axios.get(
    `/api/team?organizationId=${organizationId}`,
  );
  return response.data;
};

export const getTeam = async (teamId: string) => {
  const response = await axios.get(`/api/team/${teamId}`);
  return response.data;
};

export const addTeam = async (
  organizationId: string | undefined,
  body: CreateTeamDto,
) => {
  const response = await axios.post(
    `/api/team?organizationId=${organizationId}`,
    body,
  );
  return response.data;
};

export const joinTeam = async (body: JoinTeamDto): Promise<User> => {
  const response = await axios.post(`/api/team/${body.teamId}`, body.body);
  return response.data;
};
