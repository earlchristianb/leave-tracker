import { OrgLeaveType } from "./organization.type";
import { User } from "./user.type";

export type Leave = {
  id: string;
  createdBy: User;
  leaveType: OrgLeaveType;
  dates: string[];
  fileLink: string;
  reason?: string;
  created_at: Date;
  updated_At: Date;
};
export type CreateLeaveDto = {
  leaveTypeId: string;
  //Frontend Choose date=> convert to iso string =>make a api request => store in db
  dates: string[];
  fileLink: string;
  reason?: string;
};

export type CreateLeaveDtoVariable = {
  userId: string;
  body: CreateLeaveDto;
};
