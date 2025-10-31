import axios from "axios";
import type { GeneracionesResponse, ResponseGrupoSemestres, ResponseSemestres, } from "./interfaces/PeriodosInterfaces";
import { toast } from "sonner";
import type { ResponseError } from "@/api/GeneralErrorInterface";
import { BaseAPI } from "@/api/BaseAPI";

export const PeriodosActions = () => {
  const PeriodosAPI = BaseAPI("periodos");

  // Obtener todas las generaciones
  const fetchAllGenerations = async (): Promise<GeneracionesResponse> => {
    try {
      const response = await PeriodosAPI.get<GeneracionesResponse>("/generaciones");
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

      throw new Error("Ocurrió un error inesperado.");
    }
  };

  // Obtener las generaciones activas
  const fetchCurrentGenerations = async (current: boolean): Promise<GeneracionesResponse> => {
    try {
      const response = await PeriodosAPI.get<GeneracionesResponse>("/generaciones",
        { params: { current }, }
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

      throw new Error("Ocurrió un error inesperado.");
    }
  };

  // Obtener todos los grupos de semestres
  const fetchAllGrupoSemestres = async (): Promise<ResponseGrupoSemestres> => {
    try {
      const response = await PeriodosAPI.get<ResponseGrupoSemestres>("/gruposemestres");
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

      throw new Error("Ocurrió un error inesperado.");
    }
  };

  const fetchSemestres = async (): Promise<ResponseSemestres> => {
    try {
      const response = await PeriodosAPI.get<ResponseSemestres>("/semestres");
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

  return {
    fetchAllGenerations,
    fetchCurrentGenerations,
    fetchAllGrupoSemestres,
    fetchSemestres,
  };
};
