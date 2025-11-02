import axios from "axios";
import { BaseAPI } from "../BaseAPI";
import type {
  AsignaturaToStore,
  ResponseAsignaturas,
  ResponseAsignaturaCreateOrUpdate,
} from "./interfaces/AsignaturasInterfaces";
import { toast } from "sonner";
import type { ResponseError } from "../GeneralErrorInterface";

export const AsignaturasActions = () => {

  const baseAPI = BaseAPI("asignaturas");

  const fetchAsignaturas = async (page: number): Promise<ResponseAsignaturas> => {
    try {
      const response = await baseAPI.get<ResponseAsignaturas>(`/`, {
        params: { page },
      });
      toast.success( response.data.message || "Asignaturas cargadas correctamente.");
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
      const response = await baseAPI.get<ResponseAsignaturaCreateOrUpdate>(`/${id}`);
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
      const response = await baseAPI.post<ResponseAsignaturaCreateOrUpdate>("/", asignatura);
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
      const response = await baseAPI.patch<ResponseAsignaturaCreateOrUpdate>(`/${id}`, asignatura);
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
      const response = await baseAPI.delete<{ message: string }>(`/${id}`);
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
