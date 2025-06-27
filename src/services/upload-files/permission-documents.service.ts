import axios from '../../api/axios';
import { IPermissionDocument } from '../../interfaces/IPermissionDocument';

export class PermissionDocumentsService {
  static async uploadPermissionDocument(
    recordId: string,
    file: File
  ): Promise<{ message: string; data: IPermissionDocument }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(
      `/api1/permission/upload-permission-document/${recordId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  static async updatePermissionDocument(
    id: string,
    file: File
  ): Promise<{ message: string; data: IPermissionDocument }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.put(
      `/api1/permission/update-permission-document/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  static async listPermissionDocuments(): Promise<{
    message: string;
    data: IPermissionDocument[];
  }> {
    const response = await axios.get('/api1/permission/list-permission-documents');
    return response.data;
  }

  static async getPermissionDocumentById(
    id: string
  ): Promise<{ message: string; data: IPermissionDocument }> {
    const response = await axios.get(`/api1/permission/permission-document/${id}`);
    return response.data;
  }

  static async deletePermissionDocument(
    id: string
  ): Promise<{ message: string }> {
    const response = await axios.delete(`/api1/permission/delete-permission-document/${id}`);
    return response.data;
  }

  static async downloadDocument(
    id: string
  ): Promise<Blob> {
    const response = await axios.get(
      `/api1/permission/download/${id}`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  }

  static async getPermissionDocumentsByRecordId(
    recordId: string
  ): Promise<{ message: string; data: IPermissionDocument[] }> {
    const response = await axios.get(`/api1/permission/record/${recordId}`);
    return response.data;
  }

  static async getStudentPermissions(): Promise<{
    message: string;
    data: IPermissionDocument[];
  }> {
    const response = await axios.get('/api1/permission/student-permissions');
    return response.data;
  }
} 