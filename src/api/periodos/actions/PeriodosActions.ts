import axios from "axios";
import { PeriodosAPI } from "../PeriodosAPI";
import type { PeriodosResponse, ResponseGrupoSemestres } from "./interfaces/PeriodosInterfaces";
import { toast } from "sonner";
import type { ResponseError } from "@/api/GeneralInterface";

export const PeriodosActions = () => {
  // Obtener todas las generaciones
  const getAllGenerations = async () => {
    try {
      const response = await PeriodosAPI.get<PeriodosResponse>("/generaciones");
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
  const getCurrentGenerations = async (current: boolean) => {
    try {
      const response = await PeriodosAPI.get<PeriodosResponse>("/generaciones", {
        params: { current },
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

      throw new Error("Ocurrió un error inesperado.");
    }
  };

  // Obtener todos los grupos de semestres
  const getAllGrupoSemestres = async () => {
    try {
      const response = await PeriodosAPI.get<ResponseGrupoSemestres>(
        "/gruposemestres"
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

  return {
    getAllGenerations,
    getCurrentGenerations,
    getAllGrupoSemestres,
  };
};
