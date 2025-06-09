import axiosInstance from "../../api/axios";
import { IDegreeDocument } from "../../interfaces/IDegreeDocument";

const ENDPOINT = 'api1/degree';

interface GetDegreeDocumentsResponse {
  data: IDegreeDocument[];
  message: string;
  title: string;
}

export const getDegreeDocumentsByRecordId = async (recordId: string): Promise<IDegreeDocument[]> => {
  const response = await axiosInstance.get<GetDegreeDocumentsResponse>(`${ENDPOINT}/degree-docs/${recordId}`);
  return response.data.data;
}
