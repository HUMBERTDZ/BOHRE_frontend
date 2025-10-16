// hooks/useUsers.ts
import { UserActions } from "@/api/users/actions/UserActions";
import type { ResponseUserPaginated, Usuario } from "@/api/users/interfaces/UserInterface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUsers = () => {
  // Instancia del cliente de consultas
  const queryClient = useQueryClient();

  // Acciones de usuario desde el API
  const { fetchMunicipios, fetchLocalidades, fetchUsers, addUser, deleteUser } = UserActions();

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
      staleTime: 60 * 1000 * 30, // 30 minutos
      placeholderData: (previousData) => previousData, // Mantiene datos previos mientras carga
    });
  };

  /**
   * Mutación para agregar usuario con actualización optimista
   */
  const agregarUsuarioOptimistic = useMutation({
    mutationFn: addUser,

    // Antes de la mutación
    onMutate: async (userOptimistic) => {
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

      // Cancela queries en progreso para evitar conflictos
      await queryClient.cancelQueries({ queryKey: ["usuarios"] });

      if (!lastPageData) return { optimisticUser: null, targetPage: 1 };

      const currentPageCount = lastPageData.data.data.length;
      const perPage = lastPageData.data.per_page;

      // Crear usuario optimista con ID temporal
      const optimisticUser: Usuario = {
        id: Math.random(),
        ...userOptimistic,
      };

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
    onMutate: async (userId: number) => {
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
            (user) => user.id === userId
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
                      (user) => user.id !== userId
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
      // No necesitamos hacer nada más, la eliminación optimista ya se aplicó
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

  return {
    getUsers,
    agregarUsuarioOptimistic,
    getMunicipios,
    getLocalidades,
    eliminarUsuarioOptimistic,
  };
};
