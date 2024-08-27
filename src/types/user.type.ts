import { Organization } from "./organization.type";
import { Team } from "./team.type";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  team?: Team | null;
  organization?: Organization | null;
  accountSetup: boolean;
};

export type CreateUserDto = {
  email: string;
  role: string;
  name: string;
};
