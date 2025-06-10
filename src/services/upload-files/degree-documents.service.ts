import axiosInstance from "../../api/axios";
import { IDegreeDocument } from "../../interfaces/IDegreeDocument";

const ENDPOINT = 'api1/degree';

interface GetDegreeDocumentsResponse {
  data: IDegreeDocument[];
  message: string;
  title: string;
}

export const getAllDegreeDocuments = async (): Promise<IDegreeDocument[]> => {
  const response = await axiosInstance.get<GetDegreeDocumentsResponse>(`${ENDPOINT}/list-data`, {
    withCredentials: true
  });
  return response.data.data;
};

export const deleteDegreeDocument = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${ENDPOINT}/delete-degree/${id}`);
};

export const getDegreeDocumentsByRecordId = async (recordId: string): Promise<IDegreeDocument[]> => {
  const response = await axiosInstance.get<GetDegreeDocumentsResponse>(`${ENDPOINT}/record/${recordId}`);
  return response.data.data;
}