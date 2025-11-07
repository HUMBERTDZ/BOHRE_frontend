import { ClasesActions } from "@/api/clases/actions/ClasesActions";
import type { ResponseAlumnosGrupos } from "@/api/clases/interfaces/gruposSemestresExtraInterface";
import type { GruposSemestresResponse } from "@/api/clases/interfaces/clasesInterfaces";
import { useMutation, useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";

export const useClases = () => {
  const {
    getData,
    getExtraData,
    getGenerateClases,
    getAsignarDocente
  } = ClasesActions();

  const queryClient = useQueryClient();

  const getGruposSemestres = (page: number): UseQueryResult<GruposSemestresResponse> => {
    return useQuery({
      queryKey: ["gruposSemestres", page],
      queryFn: () => getData(page),
      staleTime: 1000 * 60 * 15, // 15 minutos
    });
  };

  const getGrupoSemestreDetails = (id: number): UseQueryResult<ResponseAlumnosGrupos> => {
    return useQuery({
      queryKey: ["grupoSemestreExtra", id],
      queryFn: () => getExtraData(id),
      staleTime: 1000 * 60 * 15, // 15 minutos
    });
  };

  // Asignar docente a clase
  const asignarDocente = useMutation({
    mutationFn: ({ idClase, idDocente }: { idClase: number; idDocente: number | null }) => getAsignarDocente(idClase, idDocente),
    onSuccess: (data, variables) => {
      // Opcional: actualizar optimísticamente
      queryClient.setQueryData(["clase", variables.idClase], data);
    },
  });

  const generateClases = () => getGenerateClases();

  return { getGruposSemestres, getGrupoSemestreDetails, generateClases, asignarDocente };
};
