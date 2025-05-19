import axios from 'axios';
import { IGlobal} from '../global/IGlobal';

const axiosInstance = axios.create({
  baseURL: IGlobal.BACK_ROUTE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default axiosInstance;
