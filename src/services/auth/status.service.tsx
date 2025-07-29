import axiosInstance from "../../api/axios";
import { IStatus } from "../../interfaces/IStatus";

const ENDPOINT = 'api1/status';

interface GetStatusResponse {
  data: IStatus[];
  message: string;
  title: string;
}

export const getAllStatuses = async (): Promise<IStatus[]> => {
  const response = await axiosInstance.get<GetStatusResponse>(`${ENDPOINT}`);
  return response.data.data;
};