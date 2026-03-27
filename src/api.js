import axios from 'axios';

export const HR_BASE_URL = process.env.REACT_APP_BACKEND_HR_BASE_URL;

const api = axios.create({
  baseURL: HR_BASE_URL,
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration/unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized (e.g., redirect to login or clear storage)
      // localStorage.clear();
      // window.location.href = '/HR/';
    }
    return Promise.reject(error);
  }
);

export default api;
