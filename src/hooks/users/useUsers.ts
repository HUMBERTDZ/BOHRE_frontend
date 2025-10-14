// hooks/useUsers.ts
import { UserActions } from "@/api/users/actions/UserActions";
import type { TopLevel, Usuario } from "@/api/users/interfaces/User";
import type { UsuarioFormData } from "@/components/admin/UsuarioForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUsers = () => {
  const queryClient = useQueryClient();
  const { fetchMunicipios, fetchLocalidades, fetchUsers, addUser } =
    UserActions();

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
   */
  const getUsers = (page: number = 1) => {
    return useQuery({
      queryKey: ["users", page],
      queryFn: () => fetchUsers(page),
      staleTime: 60 * 1000 * 30, // 30 minutos
      placeholderData: (previousData) => previousData, // Mantiene datos previos mientras carga
    });
  };

  /**
   * Mutación para agregar usuario
   */
  const agregarUsuarioOptimistic = () => {
    return useMutation({
      mutationFn: addUser,
      // Antes de la mutación
      onMutate: async (nuevoUsuario) => {
        // Cancela queries en progreso para evitar sobrescribir
        await queryClient.cancelQueries({ queryKey: ["users", 1] });

        // Guarda el estado anterior por si necesitas revertir
        const previousUsers = queryClient.getQueryData<TopLevel>(["users", 1]);

        // Actualiza optimistamente
        if (previousUsers) {
          const currentPageCount = previousUsers.data.data.length;
          const perPage = previousUsers.data.per_page;

          // si la pagina actual no está llena, agrega el nuevo usuario al inicio
          if (currentPageCount < perPage) {
            queryClient.setQueryData<TopLevel>(["users", 1], (oldData) => {
              if (!oldData) return oldData;

              // Crea un usuario temporal con ID provisional
              const tempUsuario: Usuario = {
                id: Date.now(), // ID temporal
                nombre: nuevoUsuario.nombre,
                apellidoPaterno: nuevoUsuario.apellidoPaterno,
                apellidoMaterno: nuevoUsuario.apellidoMaterno,
                curp: nuevoUsuario.curp,
                sexo: nuevoUsuario.sexo,
                nss: nuevoUsuario.nss,
                rol: nuevoUsuario.rol,
              };

              return {
                ...oldData,
                data: {
                  ...oldData.data,
                  data: [tempUsuario, ...oldData.data.data],
                  total: oldData.data.total + 1,
                  to: oldData.data.to + 1,
                },
              };
            });
          }
        }

        // Retorna contexto para rollback
        return { previousUsers };
      },
      // Si hay error, revierte los cambios
      onError: (err, newUser, context) => {
        if (context?.previousUsers) {
          queryClient.setQueryData(["users", 1], context.previousUsers);
        }
      },
      // Cuando termina (éxito o error), refresca los datos
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    });
  };

  return {
    getUsers,
    agregarUsuarioOptimistic,
    getMunicipios,
    getLocalidades,
  };
};
