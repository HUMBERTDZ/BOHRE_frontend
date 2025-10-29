// hooks/useCalificaciones.ts

import { CalificacionesActions } from "@/api/calificaciones/actions/CalificacionesActions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useCalificaciones = () => {
  const queryClient = useQueryClient();

  const { getByClase, getById, update } = CalificacionesActions();

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

  return {
    getCalificacionesByClase,
    updateCalificacion,
  };
};
