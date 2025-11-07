import { BaseAPI } from "@/api/BaseAPI";
import type {
  TopLevelLocalidades,
  TopLevelMunicipios,
} from "../interfaces/DireccionInterfaces";

export const DireccionActions = () => {
  const baseAPI = BaseAPI({prefix: "direcciones"});

  // obtiene los municipios
  const fetchMunicipios = async (): Promise<TopLevelMunicipios> => {
    const response = await baseAPI.get(`/municipios`);
    return response.data;
  };

  // obtiene las localidades por municipio
  const fetchLocalidades = async ( municipioId: number ): Promise<TopLevelLocalidades> => {
    const response = await baseAPI.get(`/localidades/${municipioId}`);
    return response.data;
  };

  return {
    fetchMunicipios,
    fetchLocalidades,
  };
};
