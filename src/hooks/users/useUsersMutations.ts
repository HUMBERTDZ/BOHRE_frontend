import { UserActions } from "@/api/users/actions/UserActions";
import type {
  ResponseUserPaginated,
  ResponseUserSemiComplete,
  User,
  UserSemiComplete,
} from "@/api/users/interfaces/UserInterface";
import type { UsuarioFormData } from "@/components/admin/UsuarioFormInterface";
import {
  useMutation,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

// ============================================================================
// CONSTANTES
// ============================================================================
const PAGINATION_CONFIG = {
  PAGE_SIZE: 15,
  QUERY_KEYS: {
    ACTIVE_USERS: "usuarios",
    DELETED_USERS: "usuarios-eliminados",
  },
} as const;

// ============================================================================
// TIPOS
// ============================================================================
type CacheSnapshot<T> = Array<{ key: readonly unknown[]; data: T | undefined }>;

interface DeleteMutationContext {
  previousUsers: CacheSnapshot<ResponseUserPaginated>;
  previousDeleted: CacheSnapshot<ResponseUserPaginated>;
  deletedUser: User | null;
}

interface RestoreMutationContext {
  previousDeletedPages: CacheSnapshot<ResponseUserPaginated>;
  previousActivePages: CacheSnapshot<ResponseUserPaginated>;
  userToRestore: User | null;
}

interface ForceDeleteContext {
  previousData: CacheSnapshot<ResponseUserPaginated>;
  deletedUser: User | null;
}

// ============================================================================
// UTILIDADES DE CACHE
// ============================================================================
const useCacheUtils = (queryClient: QueryClient) => {
  /**
   * Crea un nuevo objeto de página con la estructura correcta
   */
  const createNewPage = (
    pageNum: number,
    data: User[],
    total: number
  ): ResponseUserPaginated => ({
    message: "Página optimista",
    data: {
      current_page: pageNum,
      data,
      total,
      from: (pageNum - 1) * PAGINATION_CONFIG.PAGE_SIZE + 1,
      to: (pageNum - 1) * PAGINATION_CONFIG.PAGE_SIZE + data.length,
      per_page: PAGINATION_CONFIG.PAGE_SIZE,
      last_page: Math.ceil(total / PAGINATION_CONFIG.PAGE_SIZE),
      first_page_url: "",
      last_page_url: "",
      next_page_url: null,
      prev_page_url: null,
      path: "",
      links: [],
    },
  });

  /**
   * Elimina un usuario del cache y retorna el usuario eliminado
   */
  const removeUserFromCache = (queryKey: string, userId: number) => {
    const queries = queryClient.getQueriesData<ResponseUserPaginated>({
      queryKey: [queryKey],
    });

    let removedUser: User | null = null;
    let sourcePage: number | null = null;

    queries.forEach(([key, data]) => {
      if (data && Array.isArray(key) && typeof key[1] === "number") {
        const pageNum = key[1];
        const index = data.data.data.findIndex((u) => u.id === userId);

        if (index !== -1) {
          removedUser = data.data.data[index];
          sourcePage = pageNum;

          queryClient.setQueryData<ResponseUserPaginated>([queryKey, pageNum], {
            ...data,
            data: {
              ...data.data,
              data: data.data.data.filter((u) => u.id !== userId),
              total: data.data.total - 1,
              to: Math.max(data.data.to - 1, data.data.from),
            },
          });
        }
      }
    });

    return { removedUser, sourcePage };
  };

  /**
   * Agrega un usuario al cache en la primera página disponible
   */
  const addUserToCache = (
    queryKey: string,
    user: User,
    position: "start" | "end" = "start"
  ) => {
    const queries = queryClient.getQueriesData<ResponseUserPaginated>({
      queryKey: [queryKey],
    });

    let inserted = false;

    // Intentar insertar en página existente con espacio
    for (const [key, data] of queries) {
      if (
        data &&
        Array.isArray(key) &&
        typeof key[1] === "number" &&
        data.data.data.length < PAGINATION_CONFIG.PAGE_SIZE
      ) {
        const pageNum = key[1];
        queryClient.setQueryData<ResponseUserPaginated>([queryKey, pageNum], {
          ...data,
          data: {
            ...data.data,
            data:
              position === "start"
                ? [user, ...data.data.data]
                : [...data.data.data, user],
            total: data.data.total + 1,
            to: data.data.to + 1,
          },
        });
        inserted = true;
        break;
      }
    }

    // Crear nueva página si es necesario
    if (!inserted) {
      const newPageNum = queries.length + 1;
      const previousTotal = queries.at(-1)?.[1]?.data.total ?? 0;

      queryClient.setQueryData<ResponseUserPaginated>(
        [queryKey, newPageNum],
        createNewPage(newPageNum, [user], previousTotal + 1)
      );
    }
  };

  /**
   * Reorganiza todas las páginas del cache para mantener consistencia
   */
  const reorganizePaginatedCache = (queryKeyBase: string) => {
    const queries = queryClient.getQueriesData<ResponseUserPaginated>({
      queryKey: [queryKeyBase],
    });

    // Recolectar todos los items y ordenar por página
    const sortedPages = queries
      .filter(([_, data]) => data)
      .sort(([a], [b]) => Number(a[1]) - Number(b[1]));

    const allItems = sortedPages.flatMap(([_, data]) => data!.data.data);
    const total = allItems.length;
    const totalPages = Math.ceil(total / PAGINATION_CONFIG.PAGE_SIZE) || 1;

    // Actualizar páginas necesarias
    for (let i = 1; i <= totalPages; i++) {
      const start = (i - 1) * PAGINATION_CONFIG.PAGE_SIZE;
      const pageItems = allItems.slice(
        start,
        start + PAGINATION_CONFIG.PAGE_SIZE
      );

      queryClient.setQueryData<ResponseUserPaginated>([queryKeyBase, i], {
        message: "Reorganizado optimistamente",
        data: {
          current_page: i,
          data: pageItems,
          total,
          from: start + 1,
          to: start + pageItems.length,
          per_page: PAGINATION_CONFIG.PAGE_SIZE,
          last_page: totalPages,
          first_page_url: "",
          last_page_url: "",
          next_page_url: null,
          prev_page_url: null,
          path: "",
          links: [],
        },
      });
    }

    // Limpiar páginas extra
    const maxExistingPage =
      sortedPages.length > 0
        ? Math.max(...sortedPages.map(([key]) => Number(key[1])))
        : 0;

    for (let i = totalPages + 1; i <= maxExistingPage; i++) {
      queryClient.removeQueries({ queryKey: [queryKeyBase, i] });
    }
  };

  /**
   * Guarda un snapshot del estado actual de las queries
   */
  const saveSnapshot = (
    queryKey: string
  ): CacheSnapshot<ResponseUserPaginated> => {
    const queries = queryClient.getQueriesData<ResponseUserPaginated>({
      queryKey: [queryKey],
    });
    return queries.map(([key, data]) => ({ key, data }));
  };

  /**
   * Restaura un snapshot guardado
   */
  const restoreSnapshot = (snapshot: CacheSnapshot<ResponseUserPaginated>) => {
    snapshot.forEach(({ key, data }) => {
      if (data) queryClient.setQueryData(key, data);
    });
  };

  return {
    createNewPage,
    removeUserFromCache,
    addUserToCache,
    reorganizePaginatedCache,
    saveSnapshot,
    restoreSnapshot,
  };
};

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

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================
export const useUsersMutations = () => {
  const queryClient = useQueryClient();
  const { deleteUser, forceDeleteUser, restoreUser, addUser, updateUser } = UserActions();
  const cacheUtils = useCacheUtils(queryClient);

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
    onSuccess: (response, _variables, context) => {
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

      queryClient.invalidateQueries({ queryKey: ["gruposSemestres"] });
      queryClient.invalidateQueries({ queryKey: ["grupoSemestreExtra"] });

      if (context?.optimisticUser?.rol === "docente") {
        queryClient.invalidateQueries({ queryKey: ["docentes"] });
      }
    },

    // Si hay error, elimina el usuario optimista
    onError: (error, _variables, context) => {
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

    onError: (err, _variables, context) => {
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
      console.log(response)
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

        // Actualizar cache individual si existe
        const rolLowerCase = userSemiComplete.rol.toLowerCase();
        const userCacheKey = [
          "user_complete-data",
          rolLowerCase,
          userSemiComplete.id,
        ];

        // Buscar en todos los roles posibles (por si cambió de rol)
        const rolesAlternos = ['alumno', 'profesor', 'admin', 'superadmin'];
        let cacheActualizado = false;

        for (const rol of rolesAlternos) {
          const alternateKey = ["user_complete-data", rol, userSemiComplete.id];
          const existingCache = queryClient.getQueryData(alternateKey);
          
          if (existingCache) {
            queryClient.setQueryData<ResponseUserSemiComplete>(
              alternateKey,
              response
            );
            cacheActualizado = true;
            console.log(`✅ Cache individual actualizado para rol: ${rol}`);
            
            // Si el rol cambió, también actualizar con el nuevo rol
            if (rol !== rolLowerCase) {
              queryClient.setQueryData<ResponseUserSemiComplete>(
                userCacheKey,
                response
              );
              console.log(`✅ Cache creado para nuevo rol: ${rolLowerCase}`);
            }
            break;
          }
        }

        if (!cacheActualizado) {
          console.log('ℹ️ No se encontró cache individual para actualizar');
        }
      }

      queryClient.invalidateQueries({ queryKey: ["gruposSemestres"] });
      queryClient.invalidateQueries({ queryKey: ["grupoSemestreExtra"] });

      toast.success(response.message || "Usuario actualizado exitosamente");
    },

  });

  /**
   * Mutación para eliminar usuario (soft delete) con actualización optimista
   */
  const eliminarUsuarioOptimistic = useMutation({
    mutationFn: deleteUser,

    onMutate: async (userToDelete: User): Promise<DeleteMutationContext> => {
      // Cancelar queries en progreso
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: [PAGINATION_CONFIG.QUERY_KEYS.ACTIVE_USERS],
        }),
        queryClient.cancelQueries({
          queryKey: [PAGINATION_CONFIG.QUERY_KEYS.DELETED_USERS],
        }),
      ]);

      // Guardar snapshots para rollback
      const previousUsers = cacheUtils.saveSnapshot(
        PAGINATION_CONFIG.QUERY_KEYS.ACTIVE_USERS
      );
      const previousDeleted = cacheUtils.saveSnapshot(
        PAGINATION_CONFIG.QUERY_KEYS.DELETED_USERS
      );

      // Eliminar usuario del cache de usuarios activos
      const { removedUser } = cacheUtils.removeUserFromCache(
        PAGINATION_CONFIG.QUERY_KEYS.ACTIVE_USERS,
        userToDelete.id
      );

      // Reorganizar páginas de usuarios activos
      if (removedUser) {
        cacheUtils.reorganizePaginatedCache(
          PAGINATION_CONFIG.QUERY_KEYS.ACTIVE_USERS
        );
      }

      return {
        previousUsers,
        previousDeleted,
        deletedUser: removedUser,
      };
    },

    onSuccess: (response, _userId, context) => {
      toast.success(response.message);

      // Agregar usuario a la lista de eliminados
      if (context?.deletedUser) {
        cacheUtils.addUserToCache(
          PAGINATION_CONFIG.QUERY_KEYS.DELETED_USERS,
          context.deletedUser,
          "start"
        );
      }

      if (context?.deletedUser?.rol === "docente") {
        queryClient.invalidateQueries({ queryKey: ["docentes"] });
      }
    },

    onError: (error, _userId, context) => {
      const errorMessage =
        error instanceof Error ? error.message : "Error al eliminar usuario";
      toast.error(errorMessage);

      // Rollback
      if (context) {
        cacheUtils.restoreSnapshot(context.previousUsers);
        cacheUtils.restoreSnapshot(context.previousDeleted);
      }
    },

    onSettled: () => {
      // Solo invalidar si hay error o necesitamos sincronizar con el servidor
      // La UI ya está actualizada optimistamente
    },
  });

  /**
   * Mutación para eliminar usuario permanentemente con actualización optimista
   */
  const eliminarUsuarioPermanenteOptimistic = useMutation({
    mutationFn: forceDeleteUser,

    onMutate: async (userId: number): Promise<ForceDeleteContext> => {
      // Cancelar queries en progreso
      await queryClient.cancelQueries({
        queryKey: [PAGINATION_CONFIG.QUERY_KEYS.DELETED_USERS],
      });

      // Guardar snapshot para rollback
      const previousData = cacheUtils.saveSnapshot(
        PAGINATION_CONFIG.QUERY_KEYS.DELETED_USERS
      );

      // Eliminar usuario del cache
      const { removedUser } = cacheUtils.removeUserFromCache(
        PAGINATION_CONFIG.QUERY_KEYS.DELETED_USERS,
        userId
      );

      // Reorganizar páginas si se eliminó un usuario
      if (removedUser) {
        cacheUtils.reorganizePaginatedCache(
          PAGINATION_CONFIG.QUERY_KEYS.DELETED_USERS
        );
      }

      return { previousData, deletedUser: removedUser };
    },

    onSuccess: (response) => {
      toast.success(response.message || "Usuario eliminado permanentemente");
    },

    onError: (error, _userId, context) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al eliminar permanentemente el usuario";
      toast.error(errorMessage);

      // Rollback
      if (context?.previousData) {
        cacheUtils.restoreSnapshot(context.previousData);
      }
    },

    onSettled: () => {
      // Solo invalidar en caso de error (ya manejado en onError)
    },
  });

  /**
   * Mutación para restaurar usuario con actualización optimista
   */
  const recuperarUsuarioOptimistic = useMutation({
    mutationFn: restoreUser,

    onMutate: async (userId: number): Promise<RestoreMutationContext> => {
      // Cancelar queries en progreso
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: [PAGINATION_CONFIG.QUERY_KEYS.ACTIVE_USERS],
        }),
        queryClient.cancelQueries({
          queryKey: [PAGINATION_CONFIG.QUERY_KEYS.DELETED_USERS],
        }),
      ]);

      // Guardar snapshots para rollback
      const previousDeletedPages = cacheUtils.saveSnapshot(
        PAGINATION_CONFIG.QUERY_KEYS.DELETED_USERS
      );
      const previousActivePages = cacheUtils.saveSnapshot(
        PAGINATION_CONFIG.QUERY_KEYS.ACTIVE_USERS
      );

      // Buscar el usuario en las páginas de usuarios eliminados
      const deletedQueries = queryClient.getQueriesData<ResponseUserPaginated>({
        queryKey: [PAGINATION_CONFIG.QUERY_KEYS.DELETED_USERS],
      });

      let userToRestore: User | null = null;

      for (const [_, data] of deletedQueries) {
        if (data) {
          const found = data.data.data.find((u) => u.id === userId);
          if (found) {
            userToRestore = found;
            break;
          }
        }
      }

      if (!userToRestore) {
        return {
          previousDeletedPages,
          previousActivePages,
          userToRestore: null,
        };
      }

      // Remover de usuarios eliminados
      cacheUtils.removeUserFromCache(
        PAGINATION_CONFIG.QUERY_KEYS.DELETED_USERS,
        userId
      );

      // Reorganizar usuarios eliminados
      cacheUtils.reorganizePaginatedCache(
        PAGINATION_CONFIG.QUERY_KEYS.DELETED_USERS
      );

      // Agregar a usuarios activos
      cacheUtils.addUserToCache(
        PAGINATION_CONFIG.QUERY_KEYS.ACTIVE_USERS,
        userToRestore,
        "end"
      );

      // Reorganizar usuarios activos para actualizar last_page correctamente
      cacheUtils.reorganizePaginatedCache(
        PAGINATION_CONFIG.QUERY_KEYS.ACTIVE_USERS
      );

      return { previousDeletedPages, previousActivePages, userToRestore };
    },

    onSuccess: (response, userId, context) => {
      toast.success("Usuario restaurado correctamente");

      // Reemplazar usuario optimista con el real del backend
      if (response?.data && context?.userToRestore) {
        const realUser = response.data;
        const allQueries = queryClient.getQueriesData<ResponseUserPaginated>({
          queryKey: [PAGINATION_CONFIG.QUERY_KEYS.ACTIVE_USERS],
        });

        allQueries.forEach(([key, data]) => {
          if (data) {
            const exists = data.data.data.some((u) => u.id === userId);
            if (exists) {
              queryClient.setQueryData<ResponseUserPaginated>(key, {
                ...data,
                data: {
                  ...data.data,
                  data: data.data.data.map((u) =>
                    u.id === userId ? realUser : u
                  ),
                },
              });
            }
          }
        });
      }
    },

    onError: (error, _userId, context) => {
      const errorMessage =
        error instanceof Error ? error.message : "Error al restaurar usuario";
      toast.error(errorMessage);

      // Rollback
      if (context) {
        cacheUtils.restoreSnapshot(context.previousDeletedPages);
        cacheUtils.restoreSnapshot(context.previousActivePages);
      }
    },

    onSettled: () => {
      // La sincronización ya ocurrió optimistamente
    },
  });

  return {
    agregarUsuarioOptimistic,
    actualizarUsuarioOptimistic,
    eliminarUsuarioOptimistic,
    eliminarUsuarioPermanenteOptimistic,
    recuperarUsuarioOptimistic,
  };
};
