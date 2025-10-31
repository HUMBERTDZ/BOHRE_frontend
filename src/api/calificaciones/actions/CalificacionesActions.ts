import { BaseAPI } from "@/api/BaseAPI";
import type { ResponseCalificaciones } from "../interfaces/CalificacionesInterface";
import type { ResponseEspecialidadDetalle } from "../interfaces/CalificacionesByEspecialidad";

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

  return {
    getByClase,
    update,
    getById,
  };
};
