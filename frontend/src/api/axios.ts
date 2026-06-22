// frontend/src/api/axios.ts
import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

export const TOKEN_STORAGE_KEY = 'opkit_token';

export const api = axios.create({
  baseURL: '/api',  // ← относительный путь, Vite proxy подхватит
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);

      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }

    return Promise.reject(error);
  },
);
