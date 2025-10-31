import axios, { type AxiosInstance } from "axios";

// crea una instancia de axios con la ruta comun entre todas
// la ruta base esta en .env
export const BaseAPI = (prefix?: string): AxiosInstance => {
  const base = import.meta.env.VITE_API_BASE;
  return axios.create({
    baseURL: `${base}${prefix ? `/${prefix}` : ""}`,
  });
};
