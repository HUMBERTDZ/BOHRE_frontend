import { AlumnoActions } from "@/api/alumnos/actions/AlumnoActions";
import { useQuery } from "@tanstack/react-query";

export const useAlumnos = () => {
  const { fetchAlumnoSemestres, fetchBoleta } = AlumnoActions();

  const getAlumnoSemestres = (idPersona: number) => {
    return useQuery({
      queryKey: ["alumno-semestres", idPersona],
      queryFn: () => fetchAlumnoSemestres(idPersona),
      staleTime: 1000 * 60 * 30, // 30 minutos
      enabled: !!idPersona,
    });
  };

  const getBoleta = (idPersona: number, idGrupoSemestre: number) =>
    fetchBoleta(idPersona, idGrupoSemestre);

  return {
    getAlumnoSemestres,
    getBoleta,
  };
};
