import { CalificacionesActions } from "@/api/calificaciones/actions/CalificacionesActions";
import { EspecialidadesActions } from "@/api/especialidades/actions/EspecialidadesActions";
import type { Especialidad } from "@/api/especialidades/interfaces/EspecialidadesInterfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useEspecialidades = () => {
  const { fetchEspecialidades, createEspecialidad, updateEspecialidad, getAsignaturasByEspecialidad } =
    EspecialidadesActions();

    const { getById, fetchExcelCalificaciones } = CalificacionesActions();

  const queryClient = useQueryClient();

  const getEspecialidades = () => {
    return useQuery({
      queryKey: ["especialidades"],
      queryFn: fetchEspecialidades,
      staleTime: 1000 * 60 * 30, // 30 minutos
    });
  };

  const getAsignaturasByEspecialidadId = (id: number) => {
    return useQuery({
      queryKey: ["asignaturas-especialidad", id],
      queryFn: () => getAsignaturasByEspecialidad(id),
      staleTime: 1000 * 60 * 30, // 30 minutos
    });
  };

  const addEspecialidad = useMutation({
    mutationFn: createEspecialidad,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["especialidades"] });
    },
  });

  const getUpdateEspecialidad = useMutation({
    mutationFn: ({id, data}: { id: number; data: Especialidad }) => updateEspecialidad(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["especialidades"] });
    },
  });

  const getEspecialidadById = (id: number) => {
    return useQuery({
      queryKey: ["especialidad", id],
      queryFn: () => getById(id),
      enabled: id > 0,
      staleTime: 1000 * 60 * 15, // 15 minutos
    });
  };

  const getExcelCalificaciones = (idGrupoSemestre: number) => {
    return fetchExcelCalificaciones(`/clases/${idGrupoSemestre}/download/calificaciones/`);
  };

  const getExcelCalificacionesEspecialidad = (idEspecialidad: number, numeroSemestre: number) => {
    return fetchExcelCalificaciones(`/clases/${numeroSemestre}/${idEspecialidad}/download/calificacionesEsp`);
  };

  

  return { getEspecialidades, getAsignaturasByEspecialidadId, addEspecialidad, getUpdateEspecialidad, getEspecialidadById, getExcelCalificaciones, getExcelCalificacionesEspecialidad };
};
