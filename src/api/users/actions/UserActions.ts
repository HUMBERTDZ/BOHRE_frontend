// actions/UserActions.ts
import type { UsuarioFormData } from "@/components/admin/UsuarioFormInterface";
import type {
  ResponseAddUser,
  ResponseDocentes,
  ResponseUserPaginated,
  ResponseUserSemiComplete,
  User,
} from "../interfaces/UserInterface";
import axios from "axios";
//import { Waiter } from "@/utils/Waiter";
import { toast } from "sonner";
import type { ResponseError } from "@/api/GeneralErrorInterface";
import { BaseAPI } from "@/api/BaseAPI";

export const UserActions = () => {

  const baseUsersAPI = BaseAPI({ prefix: "usuarios" });

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
      const response = await baseUsersAPI.get<ResponseUserPaginated>("", {
        params: { page },
      });

      toast.success(response.data.message || "Usuarios cargados.");

      return response.data;
    } catch (error) {
      // Tipar el error correctamente
      if (axios.isAxiosError<ResponseError>(error)) {
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
   *
   * @param personId
   * @param rol
   * @returns { ResponseUserSemiComplete } Data de la interface usuario semi completo
   */
  const fetchCompleteUserData = async (
    personId: number,
    rol: string
  ): Promise<ResponseUserSemiComplete> => {
    try {
      const response = await baseUsersAPI.get<ResponseUserSemiComplete>(`/${rol}/${personId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError<ResponseError>(error)) {
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
   * recuperar a los usuarios eliminados
   * @returns  { ResponseUserPaginated } Data de la interface usuarios eliminados
   */
  const fetchUsersDeleted = async (
    page: number
  ): Promise<ResponseUserPaginated> => {
    try {
      const response = await baseUsersAPI.get<ResponseUserPaginated>("/deleted", {
        params: { page },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError<ResponseError>(error)) {
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
   * @returns { ResponseAddUser } data del usuario agregado
   */
  const addUser = async (data: UsuarioFormData): Promise<ResponseAddUser> => {
    const response = await baseUsersAPI.post<ResponseAddUser>("/", data);
    return response.data;
  };

  /**
   * Elimina un usuario por su ID person
   * @param user usuario a eliminar
   * @returns { null }
   */
  const deleteUser = async (user: User): Promise<ResponseError> => {
    try {
      const response = await baseUsersAPI.delete<ResponseError>(`/` + user.id);

      toast.success(response.data.message || "Usuario eliminado.");

      return response.data;
    } catch (error) {
      if (axios.isAxiosError<ResponseError>(error)) {
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
   * @returns { ResponseError }
   */
  const forceDeleteUser = async (userId: number): Promise<ResponseError> => {
    try {
      const response = await baseUsersAPI.delete<ResponseError>(
        `/delete/` + userId
      );
      toast.success(response.data.message || "Usuario eliminado.");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError<ResponseError>(error)) {
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
   * @returns { ResponseAddUser } data del usuario restaurado
   */
  const restoreUser = async (userId: number): Promise<ResponseAddUser> => {
    try {
      const response = await baseUsersAPI.patch<ResponseAddUser>(
        `/restore/` + userId
      );
      toast.success(response.data.message || "Usuario restaurado.");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError<ResponseError>(error)) {
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
   * actualiza un usuario por su ID person
   * @param userId  id del usuario a actualizar
   * @param data datos parciales del usuario a actualizar
   * @returns { UserSemiComplete } data del usuario actualizado
   */
  const updateUser = async (
    userId: number,
    data: Partial<UsuarioFormData>
  ): Promise<ResponseUserSemiComplete> => {
    try {
      const response = await baseUsersAPI.patch<ResponseUserSemiComplete>(
        `/${userId}`,
        data
      );
      toast.success(response.data.message || "Usuario actualizado.");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError<ResponseError>(error)) {
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

  const getAllDocentes = async (): Promise<ResponseDocentes> => {
    const { data } = await baseUsersAPI.get(`/docentes`);
    return data;
  };


  return {
    fetchUsers,
    fetchCompleteUserData,
    fetchUsersDeleted,
    addUser,
    deleteUser,
    forceDeleteUser,
    restoreUser,
    updateUser,
    getAllDocentes,
  };
};
