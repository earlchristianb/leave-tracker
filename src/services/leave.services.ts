import { CreateLeaveDtoVariable, Leave } from "@/types/leave.type";
import axios from "axios";

const BASE_URL = "/api/leave";
export const getAllLeavesService = async (): Promise<Leave[]> => {
  return (await axios.get(BASE_URL)).data;
};

export const getLeavesByUserService = async (
  userId: string,
): Promise<Leave[]> => {
  return (await axios.get(`${BASE_URL}?userId=${userId}`)).data;
};
export const createLeaveService = async ({
  userId,
  body,
}: CreateLeaveDtoVariable): Promise<Leave> => {
  return (await axios.post(`${BASE_URL}?userId=${userId}`, body)).data;
};
