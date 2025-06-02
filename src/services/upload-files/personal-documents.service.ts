import axiosInstance from "../../api/axios";
import { PersonalDocument } from "../../interfaces/IPersonalDocument";

const ENDPOINT = 'files';

interface GetPersonalDocumentsResponse {
  personalDocuments: PersonalDocument[];
  message: string;
  title: string;
}

export const getAllPersonalDocuments = async (): Promise<PersonalDocument[]> => {
  const response = await axiosInstance.get<GetPersonalDocumentsResponse>(`${ENDPOINT}/list-personal-documents`);
  return response.data.personalDocuments;
};

export const deletePersonalDocument = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${ENDPOINT}/delete-personal-documents/${id}`);
};