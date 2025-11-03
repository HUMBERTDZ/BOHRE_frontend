import { BaseAPI } from "@/api/BaseAPI";
import { toast } from "sonner";
import type { MateriasDocenteResponse } from "../interfaces/docentesMateriasInterfaces";
import axios from "axios";
import type { ResponseError } from "@/api/GeneralErrorInterface";

export const docentesMateriasActions = () => {
  const baseApi = BaseAPI({ prefix: "docentes" });

  const fetchDocenteMaterias = async (
    idDocente: number
  ): Promise<MateriasDocenteResponse> => {
    try {
      const response = await baseApi.get<MateriasDocenteResponse>(
        `/${idDocente}/materias`
      );
      toast.success("Materias obtenidas correctamente");
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
    fetchDocenteMaterias,
  };
};
