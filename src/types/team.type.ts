import { User } from "./user.type";

export type Team = {
  id: string;
  name: string;
  description: string;
  abbreviation: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  users?: User[];
};

export type CreateTeamDto = {
  name: string;
  description: string;
  abbreviation: string;
};

export type UpdateTeamDto = Partial<CreateTeamDto>;

export type JoinTeamDto = {
  teamId: string;
  body: { userId: string };
};
