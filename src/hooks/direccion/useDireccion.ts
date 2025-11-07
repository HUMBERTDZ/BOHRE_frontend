import { DireccionActions } from "@/api/direccion/actions/DireccionActions";
import type {
  TopLevelLocalidades,
  TopLevelMunicipios,
} from "@/api/direccion/interfaces/DireccionInterfaces";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export const useDireccion = () => {
  const { fetchMunicipios, fetchLocalidades } = DireccionActions();

  /**
   * obtener los municipios
   * @returns { TopLevelMunicipios }
   */
  const getMunicipios = (): UseQueryResult<TopLevelMunicipios, Error> => {
    return useQuery({
      queryKey: ["municipios"],
      queryFn: fetchMunicipios,
      staleTime: 60 * 1000 * 60, // 60 minutos
    });
  };

  /**
   * obtener las localidades de un municipio
   * @param municipioId id de municipio a consultar localidades
   * @returns { TopLevelLocalidades }
   */
  const getLocalidades = (municipioId: number): UseQueryResult<TopLevelLocalidades, Error> => {
    return useQuery({
      queryKey: ["localidades", municipioId],
      queryFn: () => fetchLocalidades(municipioId),
      staleTime: 60 * 1000 * 60, // 60 minutos
      enabled: !!municipioId,
    });
  };

  return {
    getMunicipios,
    getLocalidades,
  };
};
