import { Team } from "./team.type";

export type Organization = {
  id: string;
  inviteCode: string;
  name: string;
  description: string;
  driveLink: string;
  created_at: string;
  updated_at: string;
  teams: Team[] | null;
};

export type CreateOrganizationDto = {
  name: string;
  driveLink: string;
  inviteCode: string;
  description: string;
};

export type OrgLeaveType = {
  id: string;
  leaveName: string;
  leaveDescription: string;
  additionalInfo?: string;
  isActive?: boolean;
  abbreviation: string;
  maxLeavesPerYear: number;
  monthlyRestriction?: number;
  created_at: string;
  updated_at: string;
  organization: Organization;
};

export type CreateOrgLeaveTypeDto = {
  leaveName: string;
  maxLeavesPerYear: number;
  monthlyRestriction?: number;
  leaveDescription: string;
  abbreviation: string;
  isActive?: boolean;
  additionalInfo?: string;
};
