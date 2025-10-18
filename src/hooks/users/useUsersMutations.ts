import { UserActions } from "@/api/users/actions/UserActions";
import type {
  ResponseUserPaginated,
  User,
} from "@/api/users/interfaces/UserInterface";
import { useMutation, useQueryClient, QueryClient } from "@tanstack/react-query";
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
      const pageItems = allItems.slice(start, start + PAGINATION_CONFIG.PAGE_SIZE);

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
    const maxExistingPage = sortedPages.length > 0 
      ? Math.max(...sortedPages.map(([key]) => Number(key[1])))
      : 0;
      
    for (let i = totalPages + 1; i <= maxExistingPage; i++) {
      queryClient.removeQueries({ queryKey: [queryKeyBase, i] });
    }
  };

  /**
   * Guarda un snapshot del estado actual de las queries
   */
  const saveSnapshot = (queryKey: string): CacheSnapshot<ResponseUserPaginated> => {
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

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================
export const useUsersMutations = () => {
  const queryClient = useQueryClient();
  const { deleteUser, forceDeleteUser, restoreUser } = UserActions();
  const cacheUtils = useCacheUtils(queryClient);

  /**
   * Mutación para eliminar usuario (soft delete) con actualización optimista
   */
  const eliminarUsuarioOptimistic = useMutation({
    mutationFn: deleteUser,

    onMutate: async (userToDelete: User): Promise<DeleteMutationContext> => {
      // Cancelar queries en progreso
      await Promise.all([
        queryClient.cancelQueries({ queryKey: [PAGINATION_CONFIG.QUERY_KEYS.ACTIVE_USERS] }),
        queryClient.cancelQueries({ queryKey: [PAGINATION_CONFIG.QUERY_KEYS.DELETED_USERS] }),
      ]);

      // Guardar snapshots para rollback
      const previousUsers = cacheUtils.saveSnapshot(PAGINATION_CONFIG.QUERY_KEYS.ACTIVE_USERS);
      const previousDeleted = cacheUtils.saveSnapshot(PAGINATION_CONFIG.QUERY_KEYS.DELETED_USERS);

      // Eliminar usuario del cache de usuarios activos
      const { removedUser } = cacheUtils.removeUserFromCache(
        PAGINATION_CONFIG.QUERY_KEYS.ACTIVE_USERS,
        userToDelete.id
      );

      // Reorganizar páginas de usuarios activos
      if (removedUser) {
        cacheUtils.reorganizePaginatedCache(PAGINATION_CONFIG.QUERY_KEYS.ACTIVE_USERS);
      }

      return { 
        previousUsers, 
        previousDeleted, 
        deletedUser: removedUser 
      };
    },

    onSuccess: (response, userId, context) => {
      toast.success(response.message);

      // Agregar usuario a la lista de eliminados
      if (context?.deletedUser) {
        cacheUtils.addUserToCache(
          PAGINATION_CONFIG.QUERY_KEYS.DELETED_USERS,
          context.deletedUser,
          "start"
        );
      }
    },

    onError: (error, userId, context) => {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Error al eliminar usuario";
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
        queryKey: [PAGINATION_CONFIG.QUERY_KEYS.DELETED_USERS] 
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
        cacheUtils.reorganizePaginatedCache(PAGINATION_CONFIG.QUERY_KEYS.DELETED_USERS);
      }

      return { previousData, deletedUser: removedUser };
    },

    onSuccess: (response) => {
      toast.success(response.message || "Usuario eliminado permanentemente");
    },

    onError: (error, userId, context) => {
      const errorMessage = error instanceof Error
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
        queryClient.cancelQueries({ queryKey: [PAGINATION_CONFIG.QUERY_KEYS.ACTIVE_USERS] }),
        queryClient.cancelQueries({ queryKey: [PAGINATION_CONFIG.QUERY_KEYS.DELETED_USERS] }),
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
        return { previousDeletedPages, previousActivePages, userToRestore: null };
      }

      // Remover de usuarios eliminados
      cacheUtils.removeUserFromCache(
        PAGINATION_CONFIG.QUERY_KEYS.DELETED_USERS,
        userId
      );

      // Reorganizar usuarios eliminados
      cacheUtils.reorganizePaginatedCache(PAGINATION_CONFIG.QUERY_KEYS.DELETED_USERS);

      // Agregar a usuarios activos
      cacheUtils.addUserToCache(
        PAGINATION_CONFIG.QUERY_KEYS.ACTIVE_USERS,
        userToRestore,
        "end"
      );

      // Reorganizar usuarios activos para actualizar last_page correctamente
      cacheUtils.reorganizePaginatedCache(PAGINATION_CONFIG.QUERY_KEYS.ACTIVE_USERS);

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

    onError: (error, userId, context) => {
      const errorMessage = error instanceof Error
        ? error.message
        : "Error al restaurar usuario";
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
    eliminarUsuarioOptimistic,
    eliminarUsuarioPermanenteOptimistic,
    recuperarUsuarioOptimistic,
  };
};