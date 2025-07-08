import axiosInstance from "../../api/axios";
import { IPersonalDocument } from "../../interfaces/IPersonalDocument";

const ENDPOINT = 'api1/personal';

interface GetPersonalDocumentsResponse {
  data: IPersonalDocument[];
  message: string;
  title: string;
}

export const getAllPersonalDocuments = async (): Promise<IPersonalDocument[]> => {
  const response = await axiosInstance.get<GetPersonalDocumentsResponse>(`${ENDPOINT}/list-personal-documents`, {
    withCredentials: true
  });
  console.log(response.data);
  return response.data.data;
};

export const deletePersonalDocument = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${ENDPOINT}/delete-personal-documents/${id}`);
};

export const getPersonalDocumentsByRecordId = async (recordId: string): Promise<IPersonalDocument> => {
  const response = await axiosInstance.get<{ message: string, data: IPersonalDocument }>(`${ENDPOINT}/record/${recordId}`);
  return response.data.data;
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