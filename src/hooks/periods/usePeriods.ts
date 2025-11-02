import type { GeneracionesResponse, GenerationsAlumnosResponse, ResponseGrupoSemestres, ResponseSemestres, ResponseSemestresRaw, } from "@/api/periodos/actions/interfaces/PeriodosInterfaces";
import { PeriodosActions } from "@/api/periodos/actions/PeriodosActions";
import { useMutation, useQuery, type UseQueryResult } from "@tanstack/react-query";

export const usePeriods = () => {
  const {
    fetchAllGenerations,
    fetchCurrentGenerations,
    fetchAllGrupoSemestres,
    fetchSemestres,
    fetchGeneracionesAlumnosCount,
    fetchGenerationsWithAlumnos,
    createGeneration,
    fetchSemestresRaw,
    updatePeriodsSemestres
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

  const getGeneracionesAlumnosCount = (): UseQueryResult<GeneracionesResponse, Error> => {
    return useQuery({
      queryKey: ["generacionesAlumnosCount"],
      queryFn: fetchGeneracionesAlumnosCount,
      staleTime: 1000 * 60 * 30, // 30 minutos
      placeholderData: (previousData) => previousData, // Mantiene datos previos mientras carga
    });
  };

  const getGenerationsWithAlumnos = (id: number): UseQueryResult<GenerationsAlumnosResponse, Error> => {
    return useQuery({
      queryKey: ["generationsWithAlumnos", id],
      queryFn: () => fetchGenerationsWithAlumnos(id),
      staleTime: 1000 * 60 * 30, // 30 minutos
    });
  };

  const getCreateGeneration = useMutation({
    mutationFn: ({ fechaIngreso, fechaEgreso }: { fechaIngreso: Date | string, fechaEgreso: Date | string }) => createGeneration({ fechaIngreso, fechaEgreso }),
  });

  const getSemestresRaw = (): UseQueryResult<ResponseSemestresRaw, Error> => {
    return useQuery({
      queryKey: ["semestresRaw"],
      queryFn: fetchSemestresRaw,
      staleTime: 1000 * 60 * 30, // 30 minutos
    });
  };

  const getUpdatePeriodsSemestres = useMutation({
    mutationFn: (data: any) => updatePeriodsSemestres(data),
  });


  return {
    getAllGenerations,
    getAllGrupoSemestres,
    getCurrentGenerations,
    getSemestres,
    getGeneracionesAlumnosCount,
    getGenerationsWithAlumnos,
    getCreateGeneration,
    getSemestresRaw,
    getUpdatePeriodsSemestres
  };
};
