import axios from 'axios';
import { API_BASE_URL } from '@/constants';

const api = axios.create({
  baseURL: API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 second timeout
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Do not automatically clear tokens or redirect on 401.
    // Let calling code (hooks/pages) handle 401 responses so that
    // a single unauthorized error does not log the user out.
    return Promise.reject(error);
  },
);

export default api;
