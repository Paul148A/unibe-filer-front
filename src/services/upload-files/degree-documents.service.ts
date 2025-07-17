import axiosInstance from "../../api/axios";
import { IDegreeDocument } from "../../interfaces/IDegreeDocument";

const ENDPOINT = 'api1/degree';
const STATUS_ENDPOINT = 'api1/document-status';

interface GetDegreeDocumentsResponse {
  data: IDegreeDocument[];
  message: string;
  title: string;
}

export const getAllDegreeDocuments = async (): Promise<IDegreeDocument[]> => {
  const response = await axiosInstance.get<GetDegreeDocumentsResponse>(`${ENDPOINT}/list-degrees`, {
    withCredentials: true
  });
  return response.data.data;
};

export const deleteDegreeDocument = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${ENDPOINT}/delete-degree/${id}`);
};

export const deleteDegreeDocumentFile = async (id: string, field: string): Promise<void> => {
  await axiosInstance.delete(`${ENDPOINT}/delete-file/${id}/${field}`);
};

export const getDegreeDocumentsByRecordId = async (recordId: string): Promise<IDegreeDocument> => {
  const response = await axiosInstance.get<{ message: string, data: IDegreeDocument }>(`${ENDPOINT}/record/${recordId}`);
  return response.data.data;
};

export const updateDegree = async (id: string, formData: FormData): Promise<void> => {
  await axiosInstance.put(`${ENDPOINT}/update-degree/${id}`, formData,{
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
};

export const updateDegreeStatus = async (id: string, field: string, statusId: string): Promise<void> => {
  await axiosInstance.patch(`api1/degree/update-degree-status/${id}`,
    { field, statusId },
    { withCredentials: true }
  );
};

export const getDocumentStatuses = async (): Promise<{ id: string, name: string }[]> => {
  const response = await axiosInstance.get<{ id: string, name: string }[]>(`${STATUS_ENDPOINT}`);
  return response.data;
};