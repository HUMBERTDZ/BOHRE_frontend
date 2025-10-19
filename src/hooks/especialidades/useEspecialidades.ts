import { EspecialidadesActions } from "@/api/especialidades/actions/EspecialidadesActions";
import { useQuery } from "@tanstack/react-query";

export const useEspecialidades = () => {
  const { fetchEspecialidades } = EspecialidadesActions();

  const getEspecialidades = () => {
    return useQuery({
      queryKey: ["especialidades"],
      queryFn: fetchEspecialidades,
      staleTime: 1000 * 60 * 30, // 30 minutos
    });
  };

  return { getEspecialidades };
};
