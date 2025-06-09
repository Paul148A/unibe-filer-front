import axiosInstance from "../../api/axios";
import { PersonalDocument } from "../../interfaces/IPersonalDocument";

const ENDPOINT = 'api1/personal';

interface GetPersonalDocumentsResponse {
  personalDocuments: PersonalDocument[];
  message: string;
  title: string;
}

export const getAllPersonalDocuments = async (): Promise<PersonalDocument[]> => {
  const response = await axiosInstance.get<GetPersonalDocumentsResponse>(`${ENDPOINT}/list-personal-documents`, {
    withCredentials: true
  });
  return response.data.personalDocuments;
};

export const deletePersonalDocument = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${ENDPOINT}/delete-personal-documents/${id}`);
};

export const updatePersonalDocuments = async (
  id: string, 
  formData: FormData
): Promise<void> => {
  await axiosInstance.put(
    `${ENDPOINT}/update-personal-documents/${id}`, 
    formData,{
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
};