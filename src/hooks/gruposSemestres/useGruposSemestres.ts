import { gruposSemestresActions } from "@/api/gruposSemestres/actions/gruposSemestresActions";
import type { ResponseAlumnosGrupos } from "@/api/gruposSemestres/interfaces/gruposSemestresExtraInterface";
import type { GruposSemestresResponse } from "@/api/gruposSemestres/interfaces/gruposSemestresInterfaces";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export const useGruposSemestres = () => {
  const { getData, getExtraData } = gruposSemestresActions();

  const getGruposSemestres = (
    page: number
  ): UseQueryResult<GruposSemestresResponse> => {
    return useQuery({
      queryKey: ["gruposSemestres", page],
      queryFn: () => getData(page),
      staleTime: 1000 * 60 * 15, // 15 minutos
    });
  };

  const getGrupoSemestreDetails = (
    id: number
  ): UseQueryResult<ResponseAlumnosGrupos> => {
    return useQuery({
      queryKey: ["grupoSemestreExtra", id],
      queryFn: () => getExtraData(id),
      staleTime: 1000 * 60 * 15, // 15 minutos
    });
  };

  return { getGruposSemestres, getGrupoSemestreDetails };
};
