import axios from 'axios';
import { API_URL } from '../BusquedaContribuyente/config';
import getToken from './getToken';

interface RequestParams {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete'; // métodos requeridos
  data?: any;
}

const useApiRequest = () => {
  const makeRequest = (
    { url, method, data }: RequestParams,
  ) => {
    // console.log({ token })
    const token = getToken();
    if (!token) {
      console.log('Token not found');
      throw new Error('Token not found');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const urlRequest = `${API_URL}/${url}`

    const response = axios.request({
      url: urlRequest,
      method,
      data,
      ...config,
    });
    return response;
  };

  return makeRequest;
};
export default useApiRequest;