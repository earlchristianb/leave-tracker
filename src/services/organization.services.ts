import {
  CreateOrgLeaveTypeDto,
  Organization,
  OrgLeaveType,
} from "@/types/organization.type";
import { User } from "@/types/user.type";
import axios from "axios";

export const getOrganizations = async (): Promise<Organization[]> => {
  const response = await axios.get(`/api/organization`);
  return response.data;
};

export const getOrganization = async (
  organizationId: string,
): Promise<Organization> => {
  const response = await axios.get(`/api/organization/${organizationId}`);
  return response.data;
};

export const createOrganization = async (body: {
  name: string;
  driveLink: string;
  inviteCode: string;
  description: string;
}): Promise<Organization> => {
  const response = await axios.post(`/api/organization`, body);
  return response.data;
};

export const joinOrganization = async (inviteCode: string): Promise<User> => {
  const response = await axios.post(`/api/organization/join`, {
    inviteCode: inviteCode,
  });
  return response.data;
};

export const getOrgLeaveType = async (
  organizationId: string,
): Promise<OrgLeaveType[]> => {
  return (await axios.get(`/api/leaveType/${organizationId}`)).data;
};

export const createOrgLeaveType = async (
  organizationId: string,
  body: CreateOrgLeaveTypeDto,
): Promise<OrgLeaveType> => {
  const response = await axios.post(`/api/leaveType/${organizationId}`, body);
  return response.data;
};
