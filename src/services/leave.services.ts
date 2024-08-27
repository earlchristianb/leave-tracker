import {
  CreateLeaveDto,
  CreateLeaveDtoVariable,
  Leave,
} from "@/types/leave.type";
import axios from "axios";

export const getLeavesByUser = async (userId: string): Promise<Leave[]> => {
  return (await axios.get(`/api/leave?userId=${userId}`)).data;
};
export const createLeave = async ({
  userId,
  body,
}: CreateLeaveDtoVariable): Promise<Leave> => {
  return (await axios.post(`/api/leave?userId=${userId}`, body)).data;
};
