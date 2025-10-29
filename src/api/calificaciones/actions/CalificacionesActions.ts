import { BaseAPI } from "@/api/BaseAPI";
import type { ResponseCalificaciones } from "../interfaces/CalificacionesInterface";
import type { ResponseEspecialidadDetalle } from "../interfaces/CalificacionesByEspecialidad";

export const CalificacionesActions = () => {
  const getByClase = async (
    idClase: number
  ): Promise<ResponseCalificaciones> => {
    const { data } = await BaseAPI.get(`/clases/${idClase}/calificaciones`);
    return data;
  };

  const update = async (
    idCalificacion: number,
    momentos: { momento1: number; momento2: number; momento3: number }
  ) => {
    const { data } = await BaseAPI.patch(
      `/calificaciones/${idCalificacion}`,
      momentos
    );
    return data;
  };

  const getById = async (id: number): Promise<ResponseEspecialidadDetalle> => {
    const { data } = await BaseAPI.get(`/especialidades/${id}`);
    return data;
  };

  return {
    getByClase,
    update,
    getById,
  };
};
