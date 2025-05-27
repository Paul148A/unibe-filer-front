import axiosInstance from "../../api/axios";
import { IRole } from "../../interfaces/IRole";

const ENDPOINT = 'api1/roles';

interface GetRolesResponse {
  data: IRole[];
  message: string;
  title: string;
}

export const getAllRoles = async (): Promise<IRole[]> => {
  const response = await axiosInstance.get<GetRolesResponse>(`${ENDPOINT}`);
  return response.data.data;
};