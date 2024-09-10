import {
  CreateOrgLeaveTypeDto,
  Organization,
  OrgLeaveType,
  UpdateOrganizationDto,
} from "@/types/organization.type";
import { User } from "@/types/user.type";
import axios from "axios";

export const getAllOrganizationsService = async (): Promise<Organization[]> => {
  const response = await axios.get(`/api/organization`);
  return response.data;
};

export const getOrganizationService = async (
  organizationId: string,
): Promise<Organization> => {
  const response = await axios.get(`/api/organization/${organizationId}`);
  return response.data;
};

export const createOrganizationService = async (body: {
  name: string;
  driveLink: string;
  inviteCode: string;
  description: string;
}): Promise<Organization> => {
  const response = await axios.post(`/api/organization`, body);
  return response.data;
};

export const joinOrganizationService = async (
  inviteCode: string,
): Promise<User> => {
  const response = await axios.post(`/api/organization/join`, {
    inviteCode: inviteCode,
  });
  return response.data;
};

export const getOrgLeaveTypeService = async (
  organizationId: string,
): Promise<OrgLeaveType[]> => {
  return (await axios.get(`/api/leaveType/${organizationId}`)).data;
};

export const createOrgLeaveTypeService = async (
  organizationId: string,
  body: CreateOrgLeaveTypeDto,
): Promise<OrgLeaveType> => {
  const response = await axios.post(`/api/leaveType/${organizationId}`, body);
  return response.data;
};

export const updateOrganizationService = async ({
  organizationId,
  data,
}: {
  organizationId: string;
  data: UpdateOrganizationDto;
}): Promise<Organization> => {
  const response = await axios.patch(
    `/api/organization/${organizationId}`,
    data,
  );
  return response.data;
};
