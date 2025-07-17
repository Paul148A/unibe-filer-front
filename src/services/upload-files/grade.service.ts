import axiosInstance from "../../api/axios";
import { IGrade } from "../../interfaces/IGrade";

const ENDPOINT = 'api1/grade';

interface GetGradeResponse {
  data: IGrade[];
  message: string;
  title: string;
}

export const getAllGrades = async (): Promise<IGrade[]> => {
  const response = await axiosInstance.get<GetGradeResponse>(`${ENDPOINT}`);
  return response.data.data;
};

export const uploadGrade = async (grade: IGrade, file: File): Promise<IGrade> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', grade.name);
  formData.append('description', grade.description);
  formData.append('semesterId', grade.semesterId);
  formData.append('inscriptionDocumentId', grade.inscriptionDocumentId);
  const response = await axiosInstance.post<IGrade>(`${ENDPOINT}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export const getGradesByInscriptionDocumentsId = async (inscriptionDocumentId: string): Promise<IGrade[]> => {
  const response = await axiosInstance.get<GetGradeResponse>(`${ENDPOINT}/inscription/${inscriptionDocumentId}`);
  return response.data.data;
};