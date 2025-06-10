import axiosInstance from "../../api/axios";
import { IRecord } from "../../interfaces/IRecord";

const ENDPOINT = 'api1/records';

interface GetRecordsResponse {
  data: IRecord[];
  message: string;
  title: string;
}

export const getAllRecords = async (): Promise<IRecord[]> => {
  const response = await axiosInstance.get<GetRecordsResponse>(`${ENDPOINT}`);
  return response.data.data;
};

export const getRecordById = async (id: string): Promise<IRecord[]> => {
  const response = await axiosInstance.get<GetRecordsResponse>(`${ENDPOINT}/${id}`);
  return response.data.data;
};

export const getRecordByUserId = async (userId: string): Promise<IRecord[]> => {
  const response = await axiosInstance.get<GetRecordsResponse>(`${ENDPOINT}/user/${userId}`);
  return response.data.data;
}