import axiosInstance from "../../api/axios";
import { IInscriptionDocument } from "../../interfaces/IInscriptionDocument";

const ENDPOINT = 'api1/inscription';

interface GetInscriptionDocumentsResponse {
  data: IInscriptionDocument[];
  message: string;
  title: string;
}

export const getAllInscriptionDocuments = async (): Promise<IInscriptionDocument[]> => {
  const response = await axiosInstance.get<GetInscriptionDocumentsResponse>(`${ENDPOINT}/list-inscription-forms`, {
    withCredentials: true
  });
  return response.data.data;
};

export const deleteInscriptionDocument = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${ENDPOINT}/delete-inscription-form/${id}`);
};

export const getInscriptionDocumentsByRecordId = async (recordId: string): Promise<IInscriptionDocument[]> => {
  const response = await axiosInstance.get<GetInscriptionDocumentsResponse>(`${ENDPOINT}/record/${recordId}`);
  return response.data.data;
}