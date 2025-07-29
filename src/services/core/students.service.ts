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
  const response = await axiosInstance.get<GetUsersResponse>(`${ENDPOINT}/role/${role}`);
  return response.data.data;

  // const response = await axiosInstance.get<IUser[]>(`${ENDPOINT}/role/${role}`);
  // return response.data;
}

export const updateUserStatus = async (userId: string, statusId: string): Promise<void> => {
  await axiosInstance.patch(`${ENDPOINT}/${userId}/status`, 
    { status: statusId },
    { withCredentials: true }
  );
};
