import axiosInstance from "../../api/axios";
import { IPersonalDocument } from "../../interfaces/IPersonalDocument";

const ENDPOINT = 'api1/personal';
const STATUS_ENDPOINT = 'api1/document-status';

interface GetPersonalDocumentsResponse {
  data: IPersonalDocument[];
  message: string;
  title: string;
}

export const getAllPersonalDocuments = async (): Promise<IPersonalDocument[]> => {
  const response = await axiosInstance.get<GetPersonalDocumentsResponse>(`${ENDPOINT}/list-personal-documents`, {
    withCredentials: true
  });
  return response.data.data;
};

export const deletePersonalDocument = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${ENDPOINT}/delete-personal-documents/${id}`);
};

export const deletePersonalDocumentFile = async (id: string, field: string): Promise<void> => {
  await axiosInstance.delete(`${ENDPOINT}/delete-file/${id}/${field}`);
};

export const getPersonalDocumentsByRecordId = async (recordId: string): Promise<IPersonalDocument> => {
  const response = await axiosInstance.get<{ message: string, data: IPersonalDocument }>(`${ENDPOINT}/record/${recordId}`);
  return response.data.data;
};

export const updatePersonalDocuments = async ( id: string, formData: FormData ): Promise<void> => {
  await axiosInstance.put(`${ENDPOINT}/update-personal-documents/${id}`, 
    formData,{
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    }
  );
};

export const getDocumentStatuses = async (): Promise<{ id: string, name: string }[]> => {
  const response = await axiosInstance.get<{ id: string, name: string }[]>(`${STATUS_ENDPOINT}`);
  return response.data;
};