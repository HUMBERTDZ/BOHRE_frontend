import { BaseAPI } from "@/api/BaseAPI";
import type { GruposSemestresResponse } from "../interfaces/gruposSemestresInterfaces";
import axios from "axios";
import type { ResponseError } from "@/api/GeneralInterface";
import { toast } from "sonner";
import type { ResponseAlumnosGrupos } from "../interfaces/gruposSemestresExtraInterface";

export const gruposSemestresActions = () => {
  const getData = async (page: number): Promise<GruposSemestresResponse> => {
    try {
      const response = await BaseAPI.get<GruposSemestresResponse>(
        "/gruposemestresinfo",
        { params: { page } }
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

  const getExtraData = async ( idGrupoSemestre: number ): Promise<ResponseAlumnosGrupos> => {
    try {
      const response = await BaseAPI.get<ResponseAlumnosGrupos>(`/gruposemestresinfo/${idGrupoSemestre}`);
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
    getData,
    getExtraData,
  };
};
