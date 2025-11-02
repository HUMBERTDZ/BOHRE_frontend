import { BaseAPI } from "@/api/BaseAPI";
import type { AsignaturasEspecialidades, Especialidad, ResponseCreateEspecialidad, ResponseEspecialidades } from "../interfaces/EspecialidadesInterfaces";
import axios from "axios";
import { toast } from "sonner";
import type { ResponseError } from "@/api/GeneralErrorInterface";

export const EspecialidadesActions = () => {

  const baseAPI = BaseAPI({ prefix: "especialidades" });

  const fetchEspecialidades = async (): Promise<ResponseEspecialidades> => {
    try {
      const response = await baseAPI.get<ResponseEspecialidades>("/");
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

  const createEspecialidad = async (data: { nombre: string }): Promise<ResponseCreateEspecialidad> => {
    try {
      const response = await baseAPI.post<ResponseCreateEspecialidad>("/", data);
      toast.success("Especialidad creada exitosamente.");
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

  const updateEspecialidad = async (id: number, data: Especialidad): Promise<ResponseCreateEspecialidad> => {
    try {
      const response = await baseAPI.put<ResponseCreateEspecialidad>(`/${id}`, data);
      toast.success("Especialidad actualizada exitosamente.");
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

  const getAsignaturasByEspecialidad = async (id: number) => {
    try {
      const response = await baseAPI.get<AsignaturasEspecialidades>(`/asignaturas/${id}`);
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
    fetchEspecialidades,
    getAsignaturasByEspecialidad,
    createEspecialidad,
    updateEspecialidad,
  };
};
