import axiosInstance from "../../api/axios";
import { IPersonalDocument } from "../../interfaces/IPersonalDocument";

const ENDPOINT = 'api1/personal';

interface GetPersonalDocumentsResponse {
  data: IPersonalDocument[];
  message: string;
  title: string;
}

export const getPersonalDocumentsByRecordId = async (recordId: string): Promise<IPersonalDocument[]> => {
  const response = await axiosInstance.get<GetPersonalDocumentsResponse>(`${ENDPOINT}/record/${recordId}`);
  return response.data.data;
}