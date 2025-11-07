import { BaseAPI } from "@/api/BaseAPI";
import type { GruposSemestresResponse, ResponseAsignarDocente } from "../interfaces/clasesInterfaces";
import axios from "axios";
import type { ResponseError } from "@/api/GeneralErrorInterface";
import { toast } from "sonner";
import type { ResponseAlumnosGrupos } from "../interfaces/gruposSemestresExtraInterface";
import { useQueryClient } from "@tanstack/react-query";

export const ClasesActions = () => {
  
  const queryClient = useQueryClient();
  const baseAPI = BaseAPI({ prefix: "clases" });

  const getData = async (page: number): Promise<GruposSemestresResponse> => {
    try {
      const response = await baseAPI.get<GruposSemestresResponse>("/details",{ params: { page } });
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

  const getExtraData = async (idGrupoSemestre: number): Promise<ResponseAlumnosGrupos> => {
    try {
      const response = await baseAPI.get<ResponseAlumnosGrupos>(`/details/${idGrupoSemestre}`);
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

  const getGenerateClases = async (): Promise<void> => {
    try {
      await baseAPI.post("/generar");
      await queryClient.invalidateQueries({ queryKey: ["gruposSemestres"] });
      await queryClient.invalidateQueries({queryKey: ["usuarios-eliminados"],});
      toast.success("Clases generadas correctamente.");
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

  const getAsignarDocente = async (idClase: number, idDocente: number | null): Promise<ResponseAsignarDocente> => {
    const { data } = await baseAPI.patch(`/${idClase}/asignar-docente`,
      { idDocente }
    );
    return data;
  };

  return {
    getData,
    getExtraData,
    getGenerateClases,
    getAsignarDocente,
  };
};
