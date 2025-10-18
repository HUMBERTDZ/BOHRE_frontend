// hooks/useUsers.ts
import { UserActions } from "@/api/users/actions/UserActions";
import type { TopLevelLocalidades } from "@/api/users/interfaces/Localidades";
import type {
  ResponseUserPaginated,
  ResponseUserSemiComplete,
  User,
  UserSemiComplete,
} from "@/api/users/interfaces/UserInterface";
import type { UsuarioFormData } from "@/components/admin/UsuarioFormInterface";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useUsers = () => {
  // Instancia del cliente de consultas
  const queryClient = useQueryClient();

  // Acciones de usuario desde el API
  const {
    fetchMunicipios,
    fetchLocalidades,
    fetchUsers,
    fetchCompleteUserData,
    fetchUsersDeleted,
    addUser,
    updateUser,
  } = UserActions();

  /**
   * obtener los municipios
   */
  const getMunicipios = () => {
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
  const getLocalidades = ( municipioId: number ): UseQueryResult<TopLevelLocalidades, Error> => {
    return useQuery({
      queryKey: ["localidades", municipioId],
      queryFn: () => fetchLocalidades(municipioId),
      staleTime: 60 * 1000 * 60, // 60 minutos
    });
  };

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
      retry: false,
      refetchOnWindowFocus: true,
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
  const getSemicompleteUserData = ( rol: string, personId: number, enabled: boolean ): UseQueryResult<ResponseUserSemiComplete, Error> => {
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
      retry: false,
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
      retry: false,
    });
  };

  /**
   * Mutación para agregar usuario con actualización optimista
   */
  const agregarUsuarioOptimistic = useMutation({
    mutationFn: addUser,

    // Antes de la mutación
    onMutate: async (userOptimistic) => {
      // Cancela queries en progreso para evitar conflictos
      await queryClient.cancelQueries({ queryKey: ["usuarios"] });

      // Obtener todas las páginas cacheadas
      const queries = queryClient.getQueriesData<ResponseUserPaginated>({
        queryKey: ["usuarios"],
      });

      // Encontrar la última página con datos
      let lastPageNumber = 1;
      let lastPageData: ResponseUserPaginated | undefined;

      queries.forEach(([key, data]) => {
        if (data && Array.isArray(key) && typeof key[1] === "number") {
          const pageNum = key[1];
          if (pageNum >= lastPageNumber) {
            lastPageNumber = pageNum;
            lastPageData = data;
          }
        }
      });

      // Crear usuario optimista con ID temporal
      const optimisticUser: User = {
        id: Math.random(),
        ...userOptimistic,
      };

      // Si no hay data cacheada, siempre agregar en página 1
      if (!lastPageData) {
        // No hay data en cache, crear optimistamente en página 1
        queryClient.setQueryData<ResponseUserPaginated>(
          ["usuarios", 1],
          (oldData) => {
            // Si tampoco existe data para página 1, crear estructura inicial
            if (!oldData) {
              return {
                data: {
                  current_page: 1,
                  data: [optimisticUser],
                  first_page_url: "",
                  from: 1,
                  last_page: 1,
                  last_page_url: "",
                  links: [],
                  next_page_url: null,
                  path: "",
                  per_page: 15,
                  prev_page_url: null,
                  to: 1,
                  total: 1,
                },
                message: "",
              };
            }

            // Si ya existe data para página 1, agregar al inicio
            return {
              ...oldData,
              data: {
                ...oldData.data,
                data: [optimisticUser, ...oldData.data.data],
                total: oldData.data.total + 1,
                to: oldData.data.to + 1,
              },
            };
          }
        );

        return { optimisticUser, targetPage: 1 };
      }

      const currentPageCount = lastPageData.data.data.length;
      const perPage = lastPageData.data.per_page;

      // Determinar página objetivo
      const targetPage = currentPageCount < perPage ? lastPageNumber : 1;

      // Actualiza optimistamente en la página objetivo
      queryClient.setQueryData<ResponseUserPaginated>(
        ["usuarios", targetPage],
        (oldData) => {
          if (!oldData) return oldData;

          const newData = [optimisticUser, ...oldData.data.data];

          return {
            ...oldData,
            data: {
              ...oldData.data,
              data:
                targetPage === lastPageNumber
                  ? newData
                  : newData.slice(0, perPage),
              total: oldData.data.total + 1,
              to: oldData.data.to + 1,
            },
          };
        }
      );

      return { optimisticUser, targetPage };
    },

    // Cuando la mutación es exitosa
    onSuccess: (response, variables, context) => {
      if (!context?.optimisticUser) return;

      // Extraer el usuario real del wrapper de respuesta
      const usuarioReal: User = response.data;

      // Reemplazar el usuario optimista con el real del backend
      queryClient.setQueryData<ResponseUserPaginated>(
        ["usuarios", context.targetPage],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: oldData.data.data.map((cachedUser) =>
                cachedUser.id === context.optimisticUser!.id
                  ? usuarioReal
                  : cachedUser
              ),
            },
          };
        }
      );
    },

    // Si hay error, elimina el usuario optimista
    onError: (error, variables, context) => {
      console.error("Error al agregar usuario:", error);

      if (!context?.optimisticUser) return;

      queryClient.setQueryData<ResponseUserPaginated>(
        ["usuarios", context.targetPage],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: oldData.data.data.filter(
                (cachedUser) => cachedUser.id !== context.optimisticUser!.id
              ),
              total: oldData.data.total - 1,
              to: oldData.data.to - 1,
            },
          };
        }
      );
    },

    onSettled: () => {
      console.log("Mutación agregar usuario terminada!");
    },
  });


  /**
   * Mapear UserSemiComplete a User (para la tabla paginada)
   */
  const mapearUserSemiCompleteAUser = (
    userSemiComplete: UserSemiComplete
  ): User => {
    return {
      id: userSemiComplete.id,
      nombre: userSemiComplete.nombre,
      apellidoPaterno: userSemiComplete.apellidoPaterno,
      apellidoMaterno: userSemiComplete.apellidoMaterno,
      curp: userSemiComplete.curp,
      sexo: userSemiComplete.sexo,
      nss: userSemiComplete.nss,
      rol: userSemiComplete.rol,
    };
  };

  /**
   * Mutación para actualizar usuario con actualización optimista
   */
  const actualizarUsuarioOptimistic = useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: number;
      data: Partial<UsuarioFormData>;
    }) => updateUser(userId, data),

    onMutate: async ({ userId, data }) => {
      // Cancelar queries pendientes
      await queryClient.cancelQueries({ queryKey: ["usuarios"] });

      // Obtener todas las páginas cacheadas
      const allQueries = queryClient.getQueriesData<ResponseUserPaginated>({
        queryKey: ["usuarios"],
      });

      // Buscar en qué página está el usuario
      let paginaConUsuario: any = null;
      let previousData: ResponseUserPaginated | undefined;

      for (const [queryKey, oldData] of allQueries) {
        // Asegurarse de que hay datos en esta página
        if (oldData?.data?.data) {
          const userExists = oldData.data.data.some(
            (user) => user.id === userId
          );

          if (userExists) {
            paginaConUsuario = queryKey;
            previousData = oldData;

            // Actualizar optimistamente SOLO esta página
            queryClient.setQueryData<ResponseUserPaginated>(queryKey, (old) => {
              console.log(queryKey);
              if (!old?.data?.data) return old;

              const updatedUsers = old.data.data.map((user) => {
                if (user.id === userId) {
                  return {
                    ...user,
                    ...(data.nombre && { nombre: data.nombre }),
                    ...(data.apellidoPaterno && {
                      apellidoPaterno: data.apellidoPaterno,
                    }),
                    ...(data.apellidoMaterno && {
                      apellidoMaterno: data.apellidoMaterno,
                    }),
                    ...(data.curp && { curp: data.curp }),
                    ...(data.sexo && { sexo: data.sexo }),
                    ...(data.nss && { nss: data.nss }),
                    ...(data.rol && { rol: data.rol.toUpperCase() }),
                  };
                }
                return user;
              });

              return {
                ...old,
                data: {
                  ...old.data,
                  data: updatedUsers,
                },
              };
            });

            break; // Salir del loop, ya encontramos la página
          }
        }
      }

      return { paginaConUsuario, previousData };
    },

    onError: (err, variables, context) => {
      // Revertir cambios solo en la página afectada
      if (context?.paginaConUsuario && context?.previousData) {
        queryClient.setQueryData(
          context.paginaConUsuario,
          context.previousData
        );
      }

      toast.error(
        err instanceof Error ? err.message : "Error al actualizar usuario"
      );
      console.error("Error en actualización:", err);
    },

    onSuccess: (response, variables, context) => {
      // Actualizar con los datos reales del servidor solo en la página correcta
      if (response.data && context?.paginaConUsuario) {
        const userSemiComplete = response.data;
        const userSimplificado = mapearUserSemiCompleteAUser(userSemiComplete);

        queryClient.setQueryData<ResponseUserPaginated>(
          context.paginaConUsuario,
          (oldData) => {
            if (!oldData?.data?.data) return oldData;

            const updatedUsers = oldData.data.data.map((user) =>
              user.id === variables.userId ? userSimplificado : user
            );

            return {
              ...oldData,
              data: {
                ...oldData.data,
                data: updatedUsers,
              },
            };
          }
        );

        // actualizar su cache individual si existe
        const userCacheKey = [
          "user_complete-data",
          userSemiComplete.rol,
          userSemiComplete.id,
        ];

        if (queryClient.getQueryData(userCacheKey)) {
          queryClient.setQueryData<UserSemiComplete>(
            userCacheKey,
            userSemiComplete
          );
        }
      }

      toast.success(response.message || "Usuario actualizado exitosamente");
    },

    onSettled: (data, error, variables, context) => {
      // Solo invalidar la página específica donde estaba el usuario
      if (context?.paginaConUsuario) {
        queryClient.invalidateQueries({ queryKey: context.paginaConUsuario });
      }
    },
  });

  return {
    getUsers,
    prefetchAllCompleteUserData,
    getSemicompleteUserData,
    getPrefetchUserDeleted,
    getUsersDeleted,
    getMunicipios,
    getLocalidades,
    agregarUsuarioOptimistic,
    actualizarUsuarioOptimistic,
  };
};
