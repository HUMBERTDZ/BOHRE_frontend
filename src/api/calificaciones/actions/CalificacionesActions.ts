import { BaseAPI } from "@/api/BaseAPI";
import type { ResponseCalificaciones } from "../interfaces/CalificacionesInterface";

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

  return {
    getByClase,
    update,
  };
};
