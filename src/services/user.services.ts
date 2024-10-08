import { CreateUserDto, User } from "@/types/user.type";
import axios from "axios";

const BASE_URL = "/api/user";
export const getAllUserService = async (
  organizationId: string,
  skip: number,
  limit: number,
  search: string,
): Promise<{ data: User[]; total: number }> => {
  return (
    await axios.get(
      `${BASE_URL}?organizationId=${organizationId}&skip=${skip}&limit=${limit}&search=${search}`,
    )
  ).data;
};

export const getUserService = async (id: string | undefined): Promise<User> => {
  return (await axios.get(`${BASE_URL}/${id}`)).data;
};

export const createUserService = async (body: CreateUserDto): Promise<User> => {
  return (await axios.post(BASE_URL, body)).data;
};
