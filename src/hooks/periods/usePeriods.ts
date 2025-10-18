import { PeriodosActions } from "@/api/periodos/actions/PeriodosActions";
import { useQuery } from "@tanstack/react-query";

export const usePeriods = () => {
  const { getAllGenerations, getCurrentGenerations, getAllGrupoSemestres } = PeriodosActions();

  /**
   * obtener todas las generaciones
   * @returns 
   */
  const fetchAllGenerations = () => {
    return useQuery({
      queryKey: ["periods"],
      queryFn: getAllGenerations,
      staleTime: 1000 * 60 * 30, // 30 minutos
    });
  };

  /**
   * obtener todas las generaciones
   * @returns 
   */
  const fetchCurrentGenerations = (current: boolean) => {
    return useQuery({
      queryKey: ["periods", "current", current],
      queryFn: () => getCurrentGenerations(current),
      staleTime: 1000 * 60 * 30, // 30 minutos
    });
  };

  /**
   * obtener todos los grupos de semestres
   * @returns 
   */
  const fetchAllGrupoSemestres = () => {
    return useQuery({
      queryKey: ["grupoSemestres"],
      queryFn: getAllGrupoSemestres,
      staleTime: 1000 * 60 * 30, // 30 minutos
    });
  };

  return {
    fetchAllGenerations,
    fetchAllGrupoSemestres,
    fetchCurrentGenerations,
  };
};
