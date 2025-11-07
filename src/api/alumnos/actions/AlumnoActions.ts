import { BaseAPI } from "@/api/BaseAPI";
import type { AlumnoSemestreResponse } from "../interfaces/AlumnoInterfaces";
import axios from "axios";
import type { ResponseError } from "@/api/GeneralErrorInterface";
import { toast } from "sonner";

export const AlumnoActions = () => {
  const baseUAPI = BaseAPI({ prefix: "usuarios" });
  const baseAPI = BaseAPI({ prefix: "alumnos" });
  const fetchAlumnoSemestres = async (idAlumno: number) => {
    try {
      const response = await baseAPI.get<AlumnoSemestreResponse>(`/${idAlumno}/semestres`);
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

  const fetchBoleta = async (idPersona: number, idGrupoSemestre: number) => {
    // ← Corregido: ifGrupoSemestre → idGrupoSemestre
    try {
      const response = await baseAPI.get(
        `/${idPersona}/boleta/${idGrupoSemestre}`,
        { responseType: "blob" }
      );

      // Obtener nombre desde el header Content-Disposition
      const contentDisposition = response.headers["content-disposition"];
      console.log(contentDisposition);
      let fileName = `boleta_${idPersona}_${idGrupoSemestre}.pdf`; // ← Mejor nombre por defecto

      if (contentDisposition) {
        const match = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
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

      // Liberar memoria
      window.URL.revokeObjectURL(url);

      toast.success("Boleta descargada correctamente");
    } catch (error) {
      if (axios.isAxiosError<ResponseError>(error)) {
        if (error.response) {
          toast.error(
            error.response.data.message || "Error al descargar la boleta."
          );
        } else if (error.request) {
          toast.error("No se pudo conectar con el servidor.");
        }
      } else {
        toast.error("Ocurrió un error inesperado.");
      }
      throw error;
    }
  };

  const asignarEspecialidadAlumno = async ( idAlumno: number, idEspecialidad: number | null) => {
    try {
      const { data } = await baseUAPI.patch(`/alumnos/asignarEspecialidad`, {
        idAlumno,
        idEspecialidad,
      });
      return data;
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
    fetchAlumnoSemestres,
    fetchBoleta,
    asignarEspecialidadAlumno,
  };
};
