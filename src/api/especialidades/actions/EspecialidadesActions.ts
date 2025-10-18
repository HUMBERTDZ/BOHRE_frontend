import { BaseAPI } from "@/api/BaseAPI";
import type { ResponseEspecialidades } from "../interfaces/EspecialidadesInterfaces";
import axios from "axios";
import { toast } from "sonner";
import type { ResponseError } from "@/api/GeneralInterface";

export const EspecialidadesActions = () => {
  const getAllEspecialidades = async () => {
    try {
      const response = await BaseAPI.get<ResponseEspecialidades>(
        "/especialidades"
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
    getAllEspecialidades,
  };
};
