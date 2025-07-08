import axiosInstance from "../../api/axios";
import { IInscriptionDocument } from "../../interfaces/IInscriptionDocument";
import { IGlobal } from "../../global/IGlobal";

const ENDPOINT = 'api1/inscription';

interface GetInscriptionDocumentsResponse {
  data: IInscriptionDocument[];
  message: string;
  title: string;
}

export const getAllInscriptionDocuments = async (): Promise<IInscriptionDocument[]> => {
  const response = await axiosInstance.get<GetInscriptionDocumentsResponse>(`${ENDPOINT}/list-inscription-forms`, {
    withCredentials: true
  });
  return response.data.data;
};

export const deleteInscriptionDocument = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${ENDPOINT}/delete-inscription-form/${id}`);
};

export const getInscriptionDocumentsByRecordId = async (recordId: string): Promise<IInscriptionDocument> => {
  const response = await axiosInstance.get<{ message: string, data: IInscriptionDocument }>(`${ENDPOINT}/record/${recordId}`);
  return response.data.data;
};

export const downloadInscriptionDocument = async (id: string, documentType: string) => {
  try {
    const response = await fetch(`${IGlobal.BACK_ROUTE}/api1/inscription/download/${id}/${documentType}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Error al descargar el documento');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'certificado_ingles.pdf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error en la descarga:', error);
    throw error;
  }
};

export const updateInscriptionDocuments = async (
  id: string, 
  formData: FormData
): Promise<void> => {
  await axiosInstance.put(
    `${ENDPOINT}/update-inscription-form/${id}`, 
    formData,{
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
};

export const updateInscriptionDocumentStatus = async (documentId: string, status: 'approved' | 'rejected' | 'pending'): Promise<void> => {
  await axiosInstance.patch(`${ENDPOINT}/update-status/${documentId}`, { status }, {
    withCredentials: true
  });
};