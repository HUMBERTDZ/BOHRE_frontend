import { AsignaturasActions } from "@/api/asignaturas/AsignaturasActions";
import type {
  Asignatura,
  AsignaturaToStore,
  ResponseAsignaturaCreateOrUpdate,
  ResponseAsignaturas,
} from "@/api/asignaturas/interfaces/AsignaturasInterfaces";
import { useMutation, useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 15;

export const useAsignaturas = () => {
  const queryClient = useQueryClient();
  const { fetchAsignaturas, fetchAsignatura, createAsignatura, updateAsignatura, deleteAsignatura } = AsignaturasActions();

  const getAsignaturas = (page: number): UseQueryResult<ResponseAsignaturas, Error> => {
    return useQuery({
      queryKey: ["asignaturas", page],
      queryFn: () => fetchAsignaturas(page),
      staleTime: 1000 * 60 * 30, // 30 minutos
      placeholderData: (previousData) => previousData, // Mantiene datos previos mientras carga
    });
  };

  const getAsignatura = ( id: number ): UseQueryResult<ResponseAsignaturaCreateOrUpdate, Error> => {
    return useQuery({
      queryKey: ["asignatura", id],
      queryFn: () => fetchAsignatura(id),
      staleTime: 1000 * 60 * 30, // 30 minutos
      enabled: !!id,
    });
  }

  const prefetchAsignatura = (asignaturaId: number): void => {
    queryClient.prefetchQuery({
      queryKey: ["asignatura", asignaturaId],
      queryFn: () => fetchAsignatura(asignaturaId),
    });
  }

  // Función auxiliar para encontrar en qué página está una asignatura
  const findAsignaturaPage = (id: number): number | null => {
    const queries = queryClient.getQueriesData<ResponseAsignaturas>({
      queryKey: ["asignaturas"],
    });

    for (const [key, data] of queries) {
      if (data?.data.data.some((asig) => asig.idAsignatura === id)) {
        const page = (key as any[])[1];
        return typeof page === "number" ? page : null;
      }
    }
    return null;
  };

  // Función auxiliar para reorganizar las páginas después de cambios
  const reorganizePages = (allItems: Asignatura[], totalPages: number) => {
    const pages: Record<number, ResponseAsignaturas> = {};
    
    for (let page = 1; page <= totalPages; page++) {
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const pageItems = allItems.slice(startIndex, endIndex);

      const existingData = queryClient.getQueryData<ResponseAsignaturas>(["asignaturas", page]);
      
      if (pageItems.length > 0) {
        pages[page] = {
          message: "success",
          data: {
            current_page: page,
            data: pageItems,
            first_page_url: existingData?.data.first_page_url || "",
            from: startIndex + 1,
            last_page: totalPages,
            last_page_url: existingData?.data.last_page_url || "",
            links: existingData?.data.links || [],
            next_page_url: page < totalPages ? `?page=${page + 1}` : "",
            path: existingData?.data.path || "",
            per_page: ITEMS_PER_PAGE,
            prev_page_url: page > 1 ? `?page=${page - 1}` : null,
            to: endIndex > allItems.length ? allItems.length : endIndex,
            total: allItems.length,
          },
        };
      }
    }

    return pages;
  };

  // Mutación para crear asignatura
  const addAsignaturaMutation = useMutation({
    mutationFn: createAsignatura,
    onMutate: async (newAsignatura) => {
      await queryClient.cancelQueries({ queryKey: ["asignaturas"] });

      const previousPages = queryClient.getQueriesData<ResponseAsignaturas>({
        queryKey: ["asignaturas"],
      });

      // Obtener todos los items existentes
      const allItems: Asignatura[] = [];
      previousPages.forEach(([, data]) => {
        if (data?.data.data) {
          allItems.push(...data.data.data);
        }
      });

      // Crear asignatura temporal con ID negativo
      const tempAsignatura: Asignatura = {
        idAsignatura: -Date.now(),
        nombre: newAsignatura.nombre,
        tipo: newAsignatura.tipo,
        idSemestre: newAsignatura.idSemestre,
        semestre: newAsignatura.idSemestre,
        idEspecialidad: newAsignatura.idEspecialidad,
        especialidad: newAsignatura.idEspecialidad,
      };

      // Agregar al inicio
      const updatedItems = [tempAsignatura, ...allItems];
      const totalPages = Math.ceil(updatedItems.length / ITEMS_PER_PAGE);

      // Reorganizar páginas
      const newPages = reorganizePages(updatedItems, totalPages);
      Object.entries(newPages).forEach(([page, data]) => {
        queryClient.setQueryData(["asignaturas", Number(page)], data);
      });

      return { previousPages, tempId: tempAsignatura.idAsignatura };
    },
    onError: (err, variables, context) => {
      if (context?.previousPages) {
        context.previousPages.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      toast.error("Error al crear la asignatura");
    },
    onSuccess: (response, variables, context) => {
      // Reemplazar el item temporal con el real del servidor
      const queries = queryClient.getQueriesData<ResponseAsignaturas>({
        queryKey: ["asignaturas"],
      });

      queries.forEach(([key, data]) => {
        if (data?.data.data) {
          const updatedData = {
            ...data,
            data: {
              ...data.data,
              data: data.data.data.map((asig) =>
                asig.idAsignatura === context?.tempId ? response.data : asig
              ),
            },
          };
          queryClient.setQueryData(key, updatedData);
        }
      });

      toast.success(response.message || "Asignatura creada exitosamente");
    },
  });

  // Mutación para actualizar asignatura
  const updateAsignaturaMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: AsignaturaToStore }) =>
      updateAsignatura(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["asignaturas"] });

      const previousPages = queryClient.getQueriesData<ResponseAsignaturas>({
        queryKey: ["asignaturas"],
      });

      // Encontrar la página que contiene la asignatura
      const targetPage = findAsignaturaPage(id);

      if (targetPage) {
        const pageData = queryClient.getQueryData<ResponseAsignaturas>([
          "asignaturas",
          targetPage,
        ]);

        if (pageData) {
          const updatedData = {
            ...pageData,
            data: {
              ...pageData.data,
              data: pageData.data.data.map((asig) =>
                asig.idAsignatura === id
                  ? {
                      ...asig,
                      nombre: data.nombre,
                      tipo: data.tipo,
                      idSemestre: data.idSemestre,
                      semestre: data.idSemestre,
                      idEspecialidad: data.idEspecialidad,
                      especialidad: data.idEspecialidad,
                    }
                  : asig
              ),
            },
          };

          queryClient.setQueryData(["asignaturas", targetPage], updatedData);
        }
      }

      return { previousPages };
    },
    onError: (err, variables, context) => {
      if (context?.previousPages) {
        context.previousPages.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      toast.error("Error al actualizar la asignatura");
    },
    onSuccess: (response, { id }) => {
      // Actualizar con los datos reales del servidor
      const targetPage = findAsignaturaPage(id);
      
      if (targetPage) {
        const pageData = queryClient.getQueryData<ResponseAsignaturas>([
          "asignaturas",
          targetPage,
        ]);

        if (pageData) {
          const updatedData = {
            ...pageData,
            data: {
              ...pageData.data,
              data: pageData.data.data.map((asig) =>
                asig.idAsignatura === id ? response.data : asig
              ),
            },
          };

          queryClient.setQueryData(["asignaturas", targetPage], updatedData);
          queryClient.setQueryData(["asignatura", id], response);
        }
      }

      toast.success(response.message || "Asignatura actualizada exitosamente");
    },
  });

  // Mutación para eliminar asignatura
  const deleteAsignaturaMutation = useMutation({
    mutationFn: deleteAsignatura,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["asignaturas"] });

      const previousPages = queryClient.getQueriesData<ResponseAsignaturas>({
        queryKey: ["asignaturas"],
      });

      // Obtener todos los items existentes
      const allItems: Asignatura[] = [];
      previousPages.forEach(([, data]) => {
        if (data?.data.data) {
          allItems.push(...data.data.data);
        }
      });

      // Filtrar el item eliminado
      const updatedItems = allItems.filter((item) => item.idAsignatura !== id);
      const totalPages = Math.ceil(updatedItems.length / ITEMS_PER_PAGE);

      // Reorganizar páginas
      const newPages = reorganizePages(updatedItems, totalPages);
      Object.entries(newPages).forEach(([page, data]) => {
        queryClient.setQueryData(["asignaturas", Number(page)], data);
      });

      // Limpiar páginas vacías
      const oldTotalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
      for (let page = totalPages + 1; page <= oldTotalPages; page++) {
        queryClient.removeQueries({ queryKey: ["asignaturas", page] });
      }

      return { previousPages };
    },
    onError: (err, variables, context) => {
      if (context?.previousPages) {
        context.previousPages.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      toast.error("Error al eliminar la asignatura");
    },
    onSuccess: (response) => {
      toast.success(response.message || "Asignatura eliminada exitosamente");
      // NO invalidamos nada, el estado optimista ya es correcto
    },
  });

  return {
    getAsignaturas,
    getAsignatura,
    prefetchAsignatura,
    addAsignatura: addAsignaturaMutation.mutate,
    addAsignaturaAsync: addAsignaturaMutation.mutateAsync,
    updateAsignatura: updateAsignaturaMutation.mutate,
    updateAsignaturaAsync: updateAsignaturaMutation.mutateAsync,
    deleteAsignatura: deleteAsignaturaMutation.mutate,
    deleteAsignaturaAsync: deleteAsignaturaMutation.mutateAsync,
    isCreating: addAsignaturaMutation.isPending,
    isUpdating: updateAsignaturaMutation.isPending,
    isDeleting: deleteAsignaturaMutation.isPending,
  };
};