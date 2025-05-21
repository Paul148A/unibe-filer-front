import axiosInstance from "../../api/axios";
import { IUser } from "../../interfaces/IUser";

const ENDPOINT = 'api1/users';

interface GetUsersResponse {
  data: IUser[];
  message: string;
  title: string;
}

export const getAllUsers = async (): Promise<IUser[]> => {
  const response = await axiosInstance.get<GetUsersResponse>(ENDPOINT);
  return response.data.data;
};

export const getUsersByRole = async (role: string): Promise<IUser[]> => {
  const response = await axiosInstance.get<IUser[]>(`${ENDPOINT}/role/${role}`);
  return response.data;
}