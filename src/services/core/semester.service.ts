import axiosInstance from "../../api/axios";
import { ISemester } from "../../interfaces/ISemester";

const ENDPOINT = 'api1/semesters';

interface GetSemesterResponse {
  data: ISemester[];
  message: string;
  title: string;
}

export const getAllSemesters = async (): Promise<ISemester[]> => {
  const response = await axiosInstance.get<GetSemesterResponse>(ENDPOINT);
  return response.data.data;
};