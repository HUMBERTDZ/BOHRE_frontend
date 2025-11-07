// src/api/BaseAPI.ts
import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "@/store/AuthStore";

interface BaseAPIOptions {
  prefix?: string;
  isPrivate?: boolean;
}

export const BaseAPI = ({ prefix, isPrivate = true }: BaseAPIOptions = {}): AxiosInstance => {
  const base = import.meta.env.VITE_API_BASE;
  const instance = axios.create({
    baseURL: `${base}${prefix ? `/${prefix}` : ""}`,
  });

  // Si la API es privada, agrega interceptores
  if (isPrivate) {
    instance.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        config.headers.Accept = "application/json";
        return config;
      },
      (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          const logout = useAuthStore.getState().logout;
          logout();
          window.location.href = "/auth"; // redirige al login
        }
        return Promise.reject(error);
      }
    );
  }

  return instance;
};
