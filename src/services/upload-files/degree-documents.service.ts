import axiosInstance from "../../api/axios";
import { IDegreeDocument } from "../../interfaces/IDegreeDocument";

const ENDPOINT = 'api1/degree';

interface GetDegreeDocumentsResponse {
  degrees: IDegreeDocument[];
  message: string;
  title: string;
}

export const getAllDegreeDocuments = async (): Promise<IDegreeDocument[]> => {
  const response = await axiosInstance.get<GetDegreeDocumentsResponse>(`${ENDPOINT}/list-degrees`, {
    withCredentials: true
  });
  return response.data.degrees;
};

export const deleteDegreeDocument = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${ENDPOINT}/delete-degree/${id}`);
};