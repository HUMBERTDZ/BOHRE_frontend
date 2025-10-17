// hooks/useUsers.ts
import { UserActions } from "@/api/users/actions/UserActions";
import type {
  ResponseAddUser,
  ResponseUserPaginated,
  ResponseUsersDeleted,
  Usuario,
} from "@/api/users/interfaces/UserInterface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUsers = () => {
  // Instancia del cliente de consultas
  const queryClient = useQueryClient();

  // Acciones de usuario desde el API
  const {
    fetchMunicipios,
    fetchLocalidades,
    fetchUsers,
    fetchUsersDeleted,
    addUser,
    deleteUser,
    forceDeleteUser,
    restoreUser,
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
  const getLocalidades = (municipioId: number) => {
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
  const getUsers = (page: number = 1) => {
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
   * obtiene a los usuarios eliminados (soft delete)
   * @returns { ResponseUsersDeleted }
   */
  const prefetchUsersDeleted = () => {
    queryClient.prefetchQuery({
      queryKey: ["usuarios-eliminados"],
      queryFn: fetchUsersDeleted,
      staleTime: 60 * 1000 * 20, // 20 minutos
    });
  };

  const getUsersDeleted = () => {
    return useQuery({
      queryKey: ["usuarios-eliminados"],
      queryFn: fetchUsersDeleted,
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
      const optimisticUser: Usuario = {
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
      console.log("Usuario agregado exitosamente:", response);

      if (!context?.optimisticUser) return;

      // Extraer el usuario real del wrapper de respuesta
      const usuarioReal: Usuario = response.data;

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
   * Mutación para eliminar usuario con actualización optimista
   */
  const eliminarUsuarioOptimistic = useMutation({
    mutationFn: deleteUser,

    // Antes de la mutación
    onMutate: async (userToDelete: Usuario) => {
      // Cancela queries en progreso para evitar conflictos
      await queryClient.cancelQueries({ queryKey: ["usuarios"] });

      // Obtener todas las páginas cacheadas
      const queries = queryClient.getQueriesData<ResponseUserPaginated>({
        queryKey: ["usuarios"],
      });

      // Guardar el snapshot de todas las páginas para rollback
      const previousData = queries.map(([key, data]) => ({ key, data }));

      // Buscar y eliminar el usuario en todas las páginas
      let deletedUser: Usuario | null = null;
      let pageWithUser: number | null = null;

      queries.forEach(([key, data]) => {
        if (data && Array.isArray(key) && typeof key[1] === "number") {
          const pageNum = key[1];
          const userIndex = data.data.data.findIndex(
            (user) => user.id === userToDelete.id
          );

          if (userIndex !== -1) {
            deletedUser = data.data.data[userIndex];
            pageWithUser = pageNum;

            // Eliminar optimistamente el usuario
            queryClient.setQueryData<ResponseUserPaginated>(
              ["usuarios", pageNum],
              (oldData) => {
                if (!oldData) return oldData;

                return {
                  ...oldData,
                  data: {
                    ...oldData.data,
                    data: oldData.data.data.filter(
                      (user) => user.id !== userToDelete.id
                    ),
                    total: oldData.data.total - 1,
                    from: oldData.data.from,
                    to: Math.max(oldData.data.to - 1, oldData.data.from),
                  },
                };
              }
            );
          }
        }
      });

      return { previousData, deletedUser, pageWithUser };
    },

    // Cuando la mutación es exitosa
    onSuccess: (response, userId, context) => {
      toast.success(response.message);

      // agrega el usuario eliminado a la cache de usuarios eliminados
      if (context?.deletedUser) {
        queryClient.setQueryData<ResponseUsersDeleted>(
          ["usuarios-eliminados"],
          (oldData) => {
            if (!oldData) {
              return {
                message: "",
                data: [context.deletedUser!],
              };
            }
            return {
              ...oldData,
              data: [context.deletedUser!, ...oldData.data],
            };
          }
        );
      }
    },

    // Si hay error, restaura el usuario eliminado
    onError: (error, userId, context) => {
      toast.error(`Error al eliminar usuario. ${error.cause}`);

      if (!context?.previousData) return;

      // Restaurar todas las páginas al estado anterior
      context.previousData.forEach(({ key, data }) => {
        queryClient.setQueryData(key, data);
      });
    },

    onSettled: () => {
      console.log("Mutación eliminar usuario terminada!");
    },
  });

  /**
   * Mutación para eliminar usuario permanentemente con actualización optimista
   */
  const eliminarUsuarioPermanenteOptimistic = useMutation({
    mutationFn: forceDeleteUser,

    // Antes de la mutación
    onMutate: async (userId: number) => {
      // Cancela queries en progreso para evitar conflictos
      await queryClient.cancelQueries({ queryKey: ["usuarios"] });

      // recupera el usuario a eliminar
      const userToDelete = queryClient
        .getQueryData<ResponseUsersDeleted>(["usuarios-eliminados"])
        ?.data.find((user) => user.id === userId);

      // Obtener todas las páginas cacheadas
      queryClient.setQueryData<ResponseUsersDeleted>(
        ["usuarios-eliminados"],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: oldData.data.filter((user) => user.id !== userId),
          };
        }
      );

      return { userToDelete };
    },

    // Si hay error, restaura el usuario eliminado
    onError: (error, userId, context) => {
      // restaurar el usuario eliminado
      if (context?.userToDelete) {
        queryClient.setQueryData<ResponseUsersDeleted>(
          ["usuarios-eliminados"],
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              data: [context.userToDelete!, ...oldData.data],
            };
          }
        );
      }
    },

    onSettled: () => {
      console.log("Mutación eliminar usuario terminada!");
    },
  });

  /**
   * Mutación para recuperar usuario con actualización optimista
   */
  const recuperarUsuarioOptimistic = useMutation({
    mutationFn: restoreUser,

    // Antes de la mutación
    onMutate: async (userId) => {
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey: ["usuarios"] });
      await queryClient.cancelQueries({ queryKey: ["usuarios-eliminados"] });

      // Guardar snapshots para rollback
      const previousDeletedUsers = queryClient.getQueryData<ResponseUsersDeleted>(["usuarios-eliminados"]);

      const previousActiveUsers = queryClient.getQueriesData<ResponseUserPaginated>({ queryKey: ["usuarios"], });

      // Buscar el usuario en usuarios eliminados
      let userToRestore: Usuario | null = null;

      if (previousDeletedUsers) {
        const foundUser = previousDeletedUsers.data.find( (user) => user.id === userId );
        if (foundUser) {
          userToRestore = foundUser;
        }
      }

      if (!userToRestore) {
        return { previousDeletedUsers, previousActiveUsers };
      }

      // 1. Remover optimistamente de usuarios eliminados
      queryClient.setQueryData<ResponseUsersDeleted>(
        ["usuarios-eliminados"],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: oldData.data.filter((user) => user.id !== userId),
          };
        }
      );

      // 2. Determinar la página apropiada para agregar el usuario restaurado
      const activeQueries = queryClient.getQueriesData<ResponseUserPaginated>({
        queryKey: ["usuarios"],
      });

      // Encontrar la última página cacheada y verificar si tiene espacio
      let targetPage = 1;
      let lastPageNumber = 0;
      let lastPageData: ResponseUserPaginated | undefined;
      let hasSpace = false;

      activeQueries.forEach(([key, data]) => {
        if (data && Array.isArray(key) && typeof key[1] === "number") {
          const pageNum = key[1];
          if (pageNum > lastPageNumber) {
            lastPageNumber = pageNum;
            lastPageData = data;
          }
        }
      });

      // Si existe data cacheada, evaluar dónde agregar
      if (lastPageData) {
        const currentPageCount = lastPageData.data.data.length;
        const perPage = lastPageData.data.per_page;

        // Si la última página tiene espacio, agregar ahí
        if (currentPageCount < perPage) {
          targetPage = lastPageNumber;
          hasSpace = true;
        } else {
          // Si está llena, agregar en página 1
          targetPage = 1;
          hasSpace = false;
        }
      } else {
        // Si no hay cache, crear en página 1
        targetPage = 1;
        hasSpace = false;
      }

      // 3. Agregar optimistamente a la página objetivo de usuarios activos
      queryClient.setQueryData<ResponseUserPaginated>(
        ["usuarios", targetPage],
        (oldData) => {
          // Si no existe data para la página objetivo, crear estructura inicial
          if (!oldData) {
            return {
              data: {
                current_page: targetPage,
                data: [userToRestore!],
                first_page_url: "",
                from: 1,
                last_page: 1,
                last_page_url: "",
                links: [],
                next_page_url: null,
                path: "",
                per_page: 10,
                prev_page_url: null,
                to: 1,
                total: 1,
              },
              message: "",
            };
          }

          const perPage = oldData.data.per_page;

          // Si agregamos a la última página con espacio, agregar al final
          if (hasSpace && targetPage === lastPageNumber) {
            return {
              ...oldData,
              data: {
                ...oldData.data,
                data: [...oldData.data.data, userToRestore!],
                total: oldData.data.total + 1,
                to: oldData.data.to + 1,
              },
            };
          }

          // Si agregamos a página 1, agregar al inicio y respetar límite
          const newData = [userToRestore!, ...oldData.data.data];

          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: newData.slice(0, perPage),
              total: oldData.data.total + 1,
              to: oldData.data.to + 1,
            },
          };
        }
      );

      return { previousDeletedUsers, previousActiveUsers, userToRestore, targetPage, };
    },

    // Cuando la mutación es exitosa
    onSuccess: (response, userId, context) => {
      console.log("Usuario recuperado exitosamente:", response);

      if (!context?.targetPage) return;

      // Si el backend devuelve el usuario actualizado, reemplazar el optimista
      if (response.data) {
        const usuarioReal: Usuario = response.data;

        queryClient.setQueryData<ResponseUserPaginated>(
          ["usuarios", context.targetPage],
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              data: {
                ...oldData.data,
                data: oldData.data.data.map((user) =>
                  user.id === userId ? usuarioReal : user
                ),
              },
            };
          }
        );
      }
    },

    // Si hay error, revertir los cambios
    onError: (error, userId, context) => {
      if (!context) return;

      // Restaurar usuarios eliminados
      if (context.previousDeletedUsers) {
        queryClient.setQueryData( ["usuarios-eliminados"], context.previousDeletedUsers );
      }

      // Restaurar usuarios activos
      if (context.previousActiveUsers) {
        context.previousActiveUsers.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },

    onSettled: () => {
      console.log("Mutación recuperar usuario terminada!");
    },
  });

  return {
    getUsers,
    prefetchUsersDeleted,
    getUsersDeleted,
    getMunicipios,
    getLocalidades,
    agregarUsuarioOptimistic,
    eliminarUsuarioOptimistic,
    eliminarUsuarioPermanenteOptimistic,
    recuperarUsuarioOptimistic,
  };
};
