import axios from 'axios';
import { ILogin } from '../../interfaces/ILogin';
import { IGlobal } from '../../global/IGlobal';

export const login = async (login: ILogin) => {
    try {
        const response = await axios.post(
            `${IGlobal.BACK_ROUTE}/auth/login`,
            login,
            {
                withCredentials: true,
            }
        );
        if (response.status === 200) {

            return response.data;
        } else {
            throw new Error('Error de autenticación');
        }
    } catch (error) {
        console.error('Error en el login:', error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Error de autenticación');
        }

        throw new Error('Error de conexión con el servidor');
    }
};

export const logout = async () => {
    try {
        const response = await axios.post(
            `${IGlobal.BACK_ROUTE}/auth/logout`,
            {},
            {
                withCredentials: true  // importante para manejar cookies
            }
        );
        
        if (response.status === 200) {
            localStorage.clear();
            
            return response.data;
        }
    } catch (error) {
        console.error('Error en el logout:', error);
        throw error;
    }
};