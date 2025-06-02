import axiosInstance from "../../api/axios";
import { InscriptionDocument } from "../../interfaces/IInscriptionDocument";

const ENDPOINT = 'files';

interface GetInscriptionDocumentsResponse {
  inscriptionForms: InscriptionDocument[];
  message: string;
  title: string;
}

export const getAllInscriptionDocuments = async (): Promise<InscriptionDocument[]> => {
  const response = await axiosInstance.get<GetInscriptionDocumentsResponse>(`${ENDPOINT}/list-inscription-forms`);
  return response.data.inscriptionForms;
};

export const deleteInscriptionDocument = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${ENDPOINT}/delete-inscription-form/${id}`);
};