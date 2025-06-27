import axios from '../../api/axios';

export interface IRecord {
  id: string;
  code: string;
  user: {
    id: string;
    names: string;
    last_names: string;
    identification: string;
    email: string;
  };
}

export class RecordsService {
  static async getAllRecords(): Promise<{ message: string; data: IRecord[] }> {
    try {
      const response = await axios.get('/api1/records');
      return {
        message: response.data.message || 'Records obtenidos correctamente',
        data: response.data.data || []
      };
    } catch (error: any) {
      console.error('Error getting all records:', error);
      return {
        message: error.response?.data?.message || 'Error al obtener records',
        data: []
      };
    }
  }

  static async getRecordsByDni(dni: string): Promise<{ message: string; data: IRecord[] }> {
    try {
      const response = await axios.get(`/api1/records/filter/search?dni=${dni}`);
      return {
        message: response.data.message || 'Records obtenidos correctamente',
        data: response.data.data || []
      };
    } catch (error: any) {
      console.error('Error getting records by DNI:', error);
      return {
        message: error.response?.data?.message || 'Error al buscar por DNI',
        data: []
      };
    }
  }

  static async getRecordsByName(name: string): Promise<{ message: string; data: IRecord[] }> {
    try {
      const response = await axios.get(`/api1/records/filter/search?name=${name}`);
      return {
        message: response.data.message || 'Records obtenidos correctamente',
        data: response.data.data || []
      };
    } catch (error: any) {
      console.error('Error getting records by name:', error);
      return {
        message: error.response?.data?.message || 'Error al buscar por nombre',
        data: []
      };
    }
  }

  static async searchRecords(searchTerm: string): Promise<{ message: string; data: IRecord[] }> {
    // Si el término de búsqueda parece ser un DNI (solo números)
    if (/^\d+$/.test(searchTerm)) {
      return this.getRecordsByDni(searchTerm);
    }
    // Si no, buscar por nombre
    return this.getRecordsByName(searchTerm);
  }
} 