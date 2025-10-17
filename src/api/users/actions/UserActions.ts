// actions/UserActions.ts
import type { UsuarioFormData } from "@/components/admin/UsuarioFormInterface";
import { BaseAPI } from "../../BaseAPI";
import type { TopLevelLocalidades } from "../interfaces/Localidades";
import type { TopLevelMunicipios } from "../interfaces/Municipios";
import type {
  GeneralResponse,
  ResponseAddUser,
  ResponseUserPaginated,
  ResponseUsersDeleted,
  Usuario,
} from "../interfaces/UserInterface";
import { UsersAPI } from "../UsersAPI";
import axios from "axios";
import { Waiter } from "@/utils/Waiter";
import { toast } from "sonner";

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
   * @returns { ResponseUserPaginated } Data de la interface usuario paginada
   */
  const fetchUsers = async (
    page: number = 1
  ): Promise<ResponseUserPaginated> => {
    //await Waiter(5000); // Simula retardo de 5 segundos
    try {
      const response = await UsersAPI.get<ResponseUserPaginated>("", {
        params: { page },
      });

      toast.success(response.data.message || "Usuarios cargados.");

      return response.data;
    } catch (error) {
      // Tipar el error correctamente
      if (axios.isAxiosError<GeneralResponse>(error)) {
        if (error.response) {
          toast.error(error.response.data.message || "Error del servidor.");
        } else if (error.request) {
          // Error de red (no hubo respuesta)
          toast.error("No se pudo conectar con el servidor.");
        }

        // Error desconocido
        throw new Error("Ocurrió un error inesperado.");
      }

      // Si el error no es AxiosError, lanzar un error genérico
      throw new Error("Ocurrió un error inesperado.");
    }
  };

  /**
   * recuperar a los usuarios eliminados
   * @returns  { ResponseUsersDeleted } Data de la interface usuarios eliminados
   */
  const fetchUsersDeleted = async (): Promise<ResponseUsersDeleted> => {
    try {
      const response = await UsersAPI.get<ResponseUsersDeleted>("/deleted");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError<GeneralResponse>(error)) {
        if (error.response) {
          toast.info(error.response.data.message || "Error del servidor.");
        } else if (error.request) {
          // Error de red (no hubo respuesta)
          toast.error("No se pudo conectar con el servidor.");
        }

        // Error desconocido
        throw new Error("Ocurrió un error inesperado.");
      }

      // Si el error no es AxiosError, lanzar un error genérico
      throw new Error("Ocurrió un error inesperado.");
    }
  };

  /**
   * Agrega un nuevo usuario
   * @param data de usuario a agregar
   * @returns
   */
  const addUser = async (data: UsuarioFormData) => {
    const response = await UsersAPI.post<ResponseAddUser>("/", data);
    return response.data;
  };

  /**
   * Elimina un usuario por su ID person
   * @param user
   * @returns
   */
  const deleteUser = async (user: Usuario) => {
    try {
      const response = await UsersAPI.delete<GeneralResponse>(`/` + user.id);

      toast.success(response.data.message || "Usuario eliminado.");

      return response.data;
    } catch (error) {
      if (axios.isAxiosError<GeneralResponse>(error)) {
        if (error.response) {
          toast.error(error.response.data.message || "Error del servidor.");
        } else if (error.request) {
          // Error de red (no hubo respuesta)
          toast.error("No se pudo conectar con el servidor.");
        }
      }

      // Error desconocido
      throw new Error("Ocurrió un error inesperado.");
    }
  };

  /**
   * Elimina un usuario de forma permanente por su ID person
   * @param userId id del usuario a eliminar permanentemente
   * @returns
   */
  const forceDeleteUser = async (userId: number) => {
    try {
      const response = await UsersAPI.delete<GeneralResponse>(
        `/delete/` + userId
      );
      toast.success(response.data.message || "Usuario eliminado.");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError<GeneralResponse>(error)) {
        if (error.response) {
          toast.error(error.response.data.message || "Error del servidor.");
        } else if (error.request) {
          // Error de red (no hubo respuesta)
          toast.error("No se pudo conectar con el servidor.");
        }
      }
      // Error desconocido
      throw new Error("Ocurrió un error inesperado.");
    }
  };

  /**
   * Restaura un usuario eliminado
   * @param userId ID del usuario a restaurar
   * @returns
   */
  const restoreUser = async (userId: number) => {
    try {
      const response = await UsersAPI.patch<ResponseAddUser>(`/restore/` + userId);
      toast.success(response.data.message || "Usuario restaurado.");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError<GeneralResponse>(error)) {
        if (error.response) {
          toast.error(error.response.data.message || "Error del servidor.");
        } else if (error.request) {
          // Error de red (no hubo respuesta)
          toast.error("No se pudo conectar con el servidor.");
        }
      }

      // Error desconocido
      throw new Error("Ocurrió un error inesperado.");
    }
  };

  return {
    fetchUsers,
    fetchUsersDeleted,
    fetchMunicipios,
    fetchLocalidades,
    addUser,
    deleteUser,
    forceDeleteUser,
    restoreUser
  };
};
