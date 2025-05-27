import axiosInstance from "../../api/axios";
import { IRecord } from "../../interfaces/IRecord";

const ENDPOINT = 'api1/records';

interface GetRolesResponse {
  data: IRecord[];
  message: string;
  title: string;
}

export const getAllRecords = async (): Promise<IRecord[]> => {
  const response = await axiosInstance.get<GetRolesResponse>(`${ENDPOINT}`);
  return response.data.data;
};

export const getRecordById = async (id: string): Promise<IRecord[]> => {
  const response = await axiosInstance.get<GetRolesResponse>(`${ENDPOINT}/${id}`);
  return response.data.data;
};