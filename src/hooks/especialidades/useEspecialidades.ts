import { EspecialidadesActions } from "@/api/especialidades/actions/EspecialidadesActions";
import { useQuery } from "@tanstack/react-query";

export const useEspecialidades = () => {
  const { getAllEspecialidades } = EspecialidadesActions();

  const fetchAllEspecialidades = () => {
    return useQuery({
      queryKey: ["especialidades"],
      queryFn: getAllEspecialidades,
      staleTime: 1000 * 60 * 30, // 30 minutos
    });
  };

  return { fetchAllEspecialidades };
};
