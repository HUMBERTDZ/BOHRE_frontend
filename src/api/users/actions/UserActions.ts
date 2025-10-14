// actions/UserActions.ts
import type { UsuarioFormData } from "@/components/admin/UsuarioForm";
import { BaseAPI } from "../BaseAPI";
import type { TopLevelLocalidades } from "../interfaces/Localidades";
import type { TopLevelMunicipios } from "../interfaces/Municipios";
import type { TopLevel } from "../interfaces/User";
import { UsersAPI } from "../UsersAPI";

export const UserActions = () => {
  const fetchMunicipios = async (): Promise<TopLevelMunicipios> => {
    const response = await BaseAPI.get(`/municipios`);
    return response.data;
  };

  const fetchLocalidades = async (
    municipioId: number
  ): Promise<TopLevelLocalidades> => {
    const response = await BaseAPI.get(`/localidades/${municipioId}`);
    return response.data;
  };

  /**
   * obtiene a los usuarios con paginación
   * @param page número de página (default: 1)
   * @returns { TopLevel } Data de la interface usuario paginada
   */
  const fetchUsers = async (page: number = 1): Promise<TopLevel> => {
    const response = await UsersAPI.get<TopLevel>("/", {
      params: { page },
    });
    return response.data;
  };

  /**
   * Agrega un nuevo usuario
   * @param data de usuario a agregar
   * @returns
   */
  const addUser = async (data: UsuarioFormData) => {
    const response = await UsersAPI.post<TopLevel>("/", data);
    return response.data;
  };

  return {
    fetchUsers,
    fetchMunicipios,
    fetchLocalidades,
    addUser,
  };
};
