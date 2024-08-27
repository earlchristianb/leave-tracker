import { CreateUserDto, User } from "@/types/user.type";
import axios from "axios";

export const getUser = async (id: string | undefined): Promise<User> => {
  return (await axios.get(`api/user/${id}`)).data;
};

export const createUser = async (body: CreateUserDto): Promise<User> => {
  return (await axios.post(`api/user`, body)).data;
};
