import { BaseAPI } from "@/api/BaseAPI";
import type { ResponseError } from "@/api/GeneralInterface";
import axios from "axios";
import { toast } from "sonner";
import type { ResponseSemestres } from "../interfaces/SemestresInterfaces";

export const SemestresActions = () => {
  const fetchSemestres = async (): Promise<ResponseSemestres> => {
    try {
      const response = await BaseAPI.get("/semestres");
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

  return { fetchSemestres };
};
