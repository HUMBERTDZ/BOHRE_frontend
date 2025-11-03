// hooks/useCalificaciones.ts

import { CalificacionesActions } from "@/api/calificaciones/actions/CalificacionesActions";
import type { ResponseCalificacionesByClase } from "@/api/calificaciones/interfaces/CalificacionesInterface";
import { useQuery, useMutation, useQueryClient, type UseQueryResult } from "@tanstack/react-query";

export const useCalificaciones = () => {
  const queryClient = useQueryClient();

  const { getByClase, update, fetchCalificacionesByClase, postCalificaciones  } = CalificacionesActions();

  const getCalificacionesByClase = (idClase: number) => {
    return useQuery({
      queryKey: ["calificaciones", idClase],
      queryFn: () => getByClase(idClase),
      enabled: idClase > 0,
    });
  };

  const updateCalificacion = useMutation({
    mutationFn: ({
      idCalificacion,
      momentos,
    }: {
      idCalificacion: number;
      momentos: { momento1: number; momento2: number; momento3: number };
    }) => update(idCalificacion, momentos),
    onSuccess: (data, variables) => {
      // Invalidar la query de calificaciones
      queryClient.invalidateQueries({ queryKey: ["calificaciones"] });
    },
  });

  const getCalificacionesByClaseDoc = ( idClase: number ): UseQueryResult<ResponseCalificacionesByClase, Error> => {
    return useQuery({
      queryKey: ["calificacionesDetalle", idClase],
      queryFn: () => fetchCalificacionesByClase(idClase),
      staleTime: 5 * 60 * 1000, // 5 minutos
    });
  };

  const getPostCalificaciones = useMutation({
    mutationFn: ( { idClase, calificaciones }: { idClase: number; calificaciones: Array<{ idAlumno: number; momento1: number; momento2: number; momento3: number }> } ) => postCalificaciones( idClase, calificaciones ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calificacionesDetalle"] });
    },
  });


  return {
    getCalificacionesByClase,
    updateCalificacion,
    getCalificacionesByClaseDoc,
    getPostCalificaciones,
  };
};
