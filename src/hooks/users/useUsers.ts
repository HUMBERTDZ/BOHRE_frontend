// hooks/useUsers.ts
import { UserActions } from "@/api/users/actions/UserActions";
import type { ResponseUserPaginated, ResponseUserSemiComplete, } from "@/api/users/interfaces/UserInterface";
import { useQuery, useQueryClient, type UseQueryResult, } from "@tanstack/react-query";

export const useUsers = () => {
  // Instancia del cliente de consultas
  const queryClient = useQueryClient();

  // Acciones de usuario desde el API
  const {
    fetchUsers,
    fetchCompleteUserData,
    fetchUsersDeleted,
    getAllDocentes,
  } = UserActions();

  

  /**
   * obtiene a los usuarios con paginación
   * @param page número de página actual
   * @returns { ResponseUserPaginated }
   */
  const getUsers = ( page: number = 1 ): UseQueryResult<ResponseUserPaginated, Error> => {
    return useQuery({
      queryKey: ["usuarios", page],
      queryFn: () => fetchUsers(page),
      staleTime: 60 * 1000 * 10,
      placeholderData: (previousData) => previousData, // Mantiene datos previos mientras carga
    });
  };

  /**
   * obtener la data completa de un usuario
   * @param rol rol del usuario
   * @param personId id de la persona
   * @returns { void }
   */
  const prefetchAllCompleteUserData = (rol: string, personId: number): void => {
    queryClient.prefetchQuery({
      queryKey: ["user_complete-data", rol, personId],
      queryFn: () => fetchCompleteUserData(personId, rol),
      staleTime: 60 * 1000 * 10, // 10 minutos
    });
  };

  /**
   * obtiene la data semi completa de un usuario
   * @param rol rol del usuario
   * @param personId id de la persona
   * @returns { ResponseUserSemiComplete }
   */
  const getSemicompleteUserData = ( rol: string, personId: number, enabled: boolean = false ): UseQueryResult<ResponseUserSemiComplete, Error> => {
    return useQuery({
      queryKey: ["user_complete-data", rol, personId],
      queryFn: () => fetchCompleteUserData(personId, rol),
      staleTime: 60 * 1000 * 10, // 10 minutos
      enabled,
    });
  };


  /**
   * Obtiene los usuarios eliminados
   * @param page pagina de usuarios eliminados
   * @returns { ResponseUserPaginated }
   */
  const getPrefetchUserDeleted = ( page: number = 1 ): void => {
    queryClient.prefetchQuery({
      queryKey: ["usuarios-eliminados", page],
      queryFn: () => fetchUsersDeleted(page),
      staleTime: 60 * 1000 * 20, // 20 minutos
    });
  };

  /**
   * Obtiene los usuarios eliminados
   * @param page pagina de usuarios eliminados
   * @returns { ResponseUserPaginated }
   */
  const getUsersDeleted = ( page: number = 1 ): UseQueryResult<ResponseUserPaginated, Error> => {
    return useQuery({
      queryKey: ["usuarios-eliminados", page],
      queryFn: () => fetchUsersDeleted(page),
      staleTime: 60 * 1000 * 20, // 20 minutos
      placeholderData: (previousData) => previousData, // Mantiene datos previos mientras carga
    });
  };



  // Obtener lista de docentes
  const getDocentes = () => {
    return useQuery({
      queryKey: ["docentes"],
      queryFn: getAllDocentes,
      staleTime: 1000 * 60 * 30,
    });
  };

  return {
    getUsers,
    prefetchAllCompleteUserData,
    getSemicompleteUserData,
    getPrefetchUserDeleted,
    getUsersDeleted,
    getDocentes,
  };
};
