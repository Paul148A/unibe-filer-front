import axiosInstance from "../../api/axios";
import { IEnrollment } from "../../interfaces/IEnrollment";

const ENDPOINT = 'api1/enrollments';

interface GetEnrollmentResponse {
  data: IEnrollment[];
  message: string;
  title: string;
}

export const uploadEnrollment = async (enrollment: IEnrollment, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', enrollment.name); 
  formData.append('description', enrollment.description);
  formData.append('semesterId', enrollment.semesterId);
  formData.append('inscriptionDocumentId', enrollment.inscriptionDocumentId);
  
  const response = await axiosInstance.post<GetEnrollmentResponse>(ENDPOINT, formData);
  return response.data;
}

export const getEnrollmentsByInscriptionDocumentsId = async (inscriptionDocumentId: string): Promise<IEnrollment[]> => {
  const response = await axiosInstance.get<GetEnrollmentResponse>(`${ENDPOINT}/inscription/${inscriptionDocumentId}`);
  return response.data.data;
};

