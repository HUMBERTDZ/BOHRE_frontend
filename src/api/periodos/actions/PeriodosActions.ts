import axios from "axios";
import type {
  GeneracionCreateResponse,
  GeneracionesResponse,
  GenerationsAlumnosResponse,
  ResponseGrupoSemestres,
  ResponseSemestres,
  ResponseSemestresRaw,
} from "./interfaces/PeriodosInterfaces";
import { toast } from "sonner";
import type { ResponseError } from "@/api/GeneralErrorInterface";
import { BaseAPI } from "@/api/BaseAPI";

export const PeriodosActions = () => {
  const PeriodosAPI = BaseAPI({ prefix: "periodos" });

  // Obtener todas las generaciones
  const fetchAllGenerations = async (): Promise<GeneracionesResponse> => {
    try {
      const response = await PeriodosAPI.get<GeneracionesResponse>(
        "/generaciones"
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

  // Obtener las generaciones activas
  const fetchCurrentGenerations = async (
    current: boolean
  ): Promise<GeneracionesResponse> => {
    try {
      const response = await PeriodosAPI.get<GeneracionesResponse>(
        "/generaciones",
        { params: { current } }
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

  const fetchGeneracionesAlumnosCount =
    async (): Promise<GeneracionesResponse> => {
      try {
        const response = await PeriodosAPI.get<GeneracionesResponse>(
          "/generacionesAlumnos"
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

  const fetchGenerationsWithAlumnos = async (
    id: number
  ): Promise<GenerationsAlumnosResponse> => {
    try {
      const response = await PeriodosAPI.get<GenerationsAlumnosResponse>(
        `/generacionesAlumnos/${id}`
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

  const createGeneration = async ({
    fechaIngreso,
    fechaEgreso,
  }: {
    fechaIngreso: Date | string;
    fechaEgreso: Date | string;
  }): Promise<GeneracionCreateResponse> => {
    try {
      const response = await PeriodosAPI.post<GeneracionCreateResponse>(
        "/generaciones",
        { fechaIngreso, fechaEgreso }
      );
      toast.success(response.data.message ?? "Generación creada con éxito.");
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

  const fetchSemestresRaw = async (): Promise<ResponseSemestresRaw> => {
    try {
      const response = await PeriodosAPI.get<ResponseSemestresRaw>(
        "/semestresRAW"
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

  type SemestreForm = {
    mesInicio: number;
    diaInicio: number;
    mesFin: number;
    diaFin: number;
    semestres: number;
  };

  const updatePeriodsSemestres = async (data: SemestreForm) => {
    try {
      const response = await PeriodosAPI.patch("/semestres", data);
      toast.success("Semestres actualizados correctamente.");
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
    fetchGeneracionesAlumnosCount,
    fetchGenerationsWithAlumnos,
    createGeneration,
    fetchSemestresRaw,
    updatePeriodsSemestres,
  };
};
