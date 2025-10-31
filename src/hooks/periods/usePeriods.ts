import type { GeneracionesResponse, ResponseGrupoSemestres, ResponseSemestres, } from "@/api/periodos/actions/interfaces/PeriodosInterfaces";
import { PeriodosActions } from "@/api/periodos/actions/PeriodosActions";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export const usePeriods = () => {
  const {
    fetchAllGenerations,
    fetchCurrentGenerations,
    fetchAllGrupoSemestres,
    fetchSemestres,
  } = PeriodosActions();

  /**
   * obtener todas las generaciones
   * @returns
   */
  const getAllGenerations = (): UseQueryResult<GeneracionesResponse, Error> => {
    return useQuery({
      queryKey: ["periods"],
      queryFn: fetchAllGenerations,
      staleTime: 1000 * 60 * 30, // 30 minutos
    });
  };

  /**
   * obtener todas las generaciones
   * @returns
   */
  const getCurrentGenerations = (current: boolean): UseQueryResult<GeneracionesResponse, Error> => {
    return useQuery({
      queryKey: ["periods", "current", current],
      queryFn: () => fetchCurrentGenerations(current),
      staleTime: 1000 * 60 * 30, // 30 minutos
    });
  };

  /**
   * obtener todos los grupos de semestres
   * @returns
   */
  const getAllGrupoSemestres = (): UseQueryResult<ResponseGrupoSemestres, Error> => {
    return useQuery({
      queryKey: ["grupoSemestres"],
      queryFn: fetchAllGrupoSemestres,
      staleTime: 1000 * 60 * 30, // 30 minutos
    });
  };

  const getSemestres = (): UseQueryResult<ResponseSemestres, Error> => {
    return useQuery({
      queryKey: ["semestres"],
      queryFn: fetchSemestres,
      staleTime: 1000 * 60 * 30, // 30 minutos
    });
  };

  return {
    getAllGenerations,
    getAllGrupoSemestres,
    getCurrentGenerations,
    getSemestres,
  };
};
