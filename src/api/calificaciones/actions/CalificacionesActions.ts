import { BaseAPI } from "@/api/BaseAPI";
import type { ResponseCalificaciones, ResponseCalificacionesByClase } from "../interfaces/CalificacionesInterface";
import type { ResponseEspecialidadDetalle } from "../interfaces/CalificacionesByEspecialidad";
import type { ResponseError } from "@/api/GeneralErrorInterface";
import { toast } from "sonner";
import axios from "axios";

export const CalificacionesActions = () => {

  const baseAPI = BaseAPI();

  const getByClase = async ( idClase: number ): Promise<ResponseCalificaciones> => {
    const { data } = await baseAPI.get(`/clases/${idClase}/calificaciones`);
    return data;
  };

  const update = async ( idCalificacion: number, momentos: { momento1: number; momento2: number; momento3: number } ) => {
    const { data } = await baseAPI.patch(
      `/calificaciones/${idCalificacion}`,
      momentos
    );
    return data;
  };

  const getById = async (id: number): Promise<ResponseEspecialidadDetalle> => {
    const { data } = await baseAPI.get(`/especialidades/${id}`);
    return data;
  };

  const getCalificacionesByEspecialidad = async ( idEspecialidad: number ): Promise<ResponseEspecialidadDetalle> => {
    const { data } = await baseAPI.get(`/especialidades/${idEspecialidad}/calificaciones`);
    return data;
  }

  const fetchExcelCalificaciones = async (APIurl: string) => {
    try {
      const response = await baseAPI.get(APIurl, { responseType: "blob" }
      );

      // Obtener nombre desde el header Content-Disposition
      const contentDisposition = response.headers["content-disposition"];
      console.log(contentDisposition)
      let fileName = `calificaciones_${0}.xlsx`;

      if (contentDisposition) {
        const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match && match[1]) {
          fileName = match[1].replace(/['"]/g, ""); // limpia comillas
        }
      }

      // Crear el enlace para descargar
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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


  const fetchCalificacionesByClase = async ( idClase: number ): Promise<ResponseCalificacionesByClase> => {
    try {
      const response = await baseAPI.get<ResponseCalificacionesByClase>(`/clases/${idClase}/detalle`);
      toast.success("Calificaciones obtenidas con éxito.");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError<ResponseError>(error)) {
        if (error.response) {
          toast.error(error.response.data.message || "Error del servidor.");
        } else if (error.request) {
          toast.error("No se pudo conectar con el servidor.");
        }
      }
      throw new Error("Ocurrió un error inesperado.")
    }
  }

  const postCalificaciones = async ( idClase: number, calificaciones: Array<{ idAlumno: number; momento1: number; momento2: number; momento3: number }> ) => {
    try {
      const response = await baseAPI.put(`/clases/${idClase}/calificaciones`,  { calificaciones } );
      toast.success("Calificaciones actualizadas con éxito.");
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

  return {
    getByClase,
    update,
    getById,
    getCalificacionesByEspecialidad,
    fetchExcelCalificaciones,
    fetchCalificacionesByClase,
    postCalificaciones,
  };
};
