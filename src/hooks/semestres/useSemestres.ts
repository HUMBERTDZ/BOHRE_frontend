import { SemestresActions } from "@/api/semestres/actions/SemestresActions";
import type { ResponseSemestres } from "@/api/semestres/interfaces/SemestresInterfaces";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export const useSemestres = () => {
  const { fetchSemestres } = SemestresActions();

  const getSemestres = (): UseQueryResult<ResponseSemestres, Error> => {
    return useQuery({
      queryKey: ["semestres"],
      queryFn: fetchSemestres,
      staleTime: 1000 * 60 * 30, // 30 minutos
    });
  };

  return { getSemestres };
};
