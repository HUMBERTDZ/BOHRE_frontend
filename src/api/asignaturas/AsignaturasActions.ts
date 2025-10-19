import axios from "axios";
import { BaseAPI } from "../BaseAPI";
import type {
  AsignaturaToStore,
  ResponseAsignaturas,
  ResponseAsignaturaCreateOrUpdate,
} from "./interfaces/AsignaturasInterfaces";
import { toast } from "sonner";
import type { ResponseError } from "../GeneralInterface";

export const AsignaturasActions = () => {
  const fetchAsignaturas = async (page: number): Promise<ResponseAsignaturas> => {
    try {
      const response = await BaseAPI.get<ResponseAsignaturas>(`/asignaturas`, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError<ResponseError>(error)) {
        if (error.response) {
          toast.error(error.response.data.message || "Error del servidor.");
        } else if (error.request) {
          // Error de red (no hubo respuesta)
          toast.error("No se pudo conectar con el servidor.");
        }
      }

      // Error desconocido
      throw new Error("Ocurrió un error inesperado.");
    }
  };

  const fetchAsignatura = async (id: number): Promise<ResponseAsignaturaCreateOrUpdate> => {
    try {
      const response = await BaseAPI.get<ResponseAsignaturaCreateOrUpdate>(`/asignaturas/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError<ResponseError>(error)) {
        if (error.response) {
          toast.error(error.response.data.message || "Error del servidor.");
        } else if (error.request) {
          // Error de red (no hubo respuesta)
          toast.error("No se pudo conectar con el servidor.");
        }
      }

      // Error desconocido
      throw new Error("Ocurrió un error inesperado.");
    }
  };

  const createAsignatura = async ( asignatura: AsignaturaToStore ): Promise<ResponseAsignaturaCreateOrUpdate> => {
    try {
      const response = await BaseAPI.post<ResponseAsignaturaCreateOrUpdate>(
        "/asignaturas",
        asignatura
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError<ResponseError>(error)) {
        if (error.response) {
          toast.error(error.response.data.message || "Error del servidor.");
        } else if (error.request) {
          // Error de red (no hubo respuesta)
          toast.error("No se pudo conectar con el servidor.");
        }
      }

      // Error desconocido
      throw new Error("Ocurrió un error inesperado.");
    }
  };

  const updateAsignatura = async ( id: number, asignatura: AsignaturaToStore ): Promise<ResponseAsignaturaCreateOrUpdate> => {
    try {
      const response = await BaseAPI.patch<ResponseAsignaturaCreateOrUpdate>(`/asignaturas/${id}`, asignatura);
      return response.data;
  } catch (error) {
      if (axios.isAxiosError<ResponseError>(error)) {
        if (error.response) {
          toast.error(error.response.data.message || "Error del servidor.");
        } else if (error.request) {
          // Error de red (no hubo respuesta)
          toast.error("No se pudo conectar con el servidor.");
        }
      }

      // Error desconocido
      throw new Error("Ocurrió un error inesperado.");
    }
  };

  const deleteAsignatura = async (id: number): Promise<{ message: string }> => {
    try {
      const response = await BaseAPI.delete<{ message: string }>(`/asignaturas/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError<ResponseError>(error)) {
        if (error.response) {
          toast.error(error.response.data.message || "Error del servidor.");
        } else if (error.request) {
          toast.error("No se pudo conectar con el servidor.");
        }
      }
      throw new Error("Ocurrió un error inesperado.");
    }
  };

  return { fetchAsignaturas, fetchAsignatura, createAsignatura, updateAsignatura, deleteAsignatura };
};
