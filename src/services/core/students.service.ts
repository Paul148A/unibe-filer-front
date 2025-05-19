import axiosInstance from "../../api/axios";
import { IUser } from "../../interfaces/IUser";

const ENDPOINT = 'api1/users';

export const getAllUsers = async (): Promise<IUser[]> => {
  const response = await axiosInstance.get<IUser[]>(ENDPOINT);
  return response.data;
};

export const getUsersByRole = async (role: string): Promise<IUser[]> => {
  const response = await axiosInstance.get<IUser[]>(`${ENDPOINT}/role/${role}`);
  return response.data;
}