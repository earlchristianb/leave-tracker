import { CreateLeaveDtoVariable, Leave } from "@/types/leave.type";
import axios from "axios";

const BASE_URL = "/api/leave";
export const getAllLeavesService = async (): Promise<{
  data: Leave[];
  total: number;
}> => {
  return (await axios.get(BASE_URL)).data;
};

export const getLeavesByUserService = async (
  userId: string,
): Promise<{ data: Leave[]; total: number }> => {
  return (await axios.get(`${BASE_URL}?userId=${userId}`)).data;
};
export const createLeaveService = async ({
  userId,
  body,
}: CreateLeaveDtoVariable): Promise<Leave> => {
  return (await axios.post(`${BASE_URL}?userId=${userId}`, body)).data;
};

export const getLeavesByPaginationAndFilterService = async ({
  userId = "",
  skip,
  limit,
  leaveTypeId = "",
}: {
  userId?: string;
  skip: number;
  limit: number;
  leaveTypeId?: string;
}): Promise<{
  data: Leave[];
  total: number;
}> => {
  return (
    await axios.get(
      `${BASE_URL}?userId=${userId}&skip=${skip}&limit=${limit}&leaveTypeId=${leaveTypeId}`,
    )
  ).data;
};
