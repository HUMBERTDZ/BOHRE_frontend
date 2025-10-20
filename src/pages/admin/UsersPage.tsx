import { UserForm } from "@/components/admin/UserForm";
import { Button } from "@/components/ui/button";
import { ColumnsTableUsers } from "@/components/users/ColumnsTableUsers";
import { DataTable } from "@/components/users/DataTable";
import { useUsers } from "@/hooks/users/useUsers";
import { useEffect, useState } from "react";
import type { User, UserSemiComplete } from "@/api/users/interfaces/UserInterface";
import { Loading } from "@/components/ui/Loading";
import { UsersDeleted } from "@/components/users/UsersDeleted";
import { AlertDialogActions } from "@/components/users/AlertDialogActions";
import { Undo, UserPlusIcon } from "lucide-react";
import { useUsersMutations } from "@/hooks/users/useUsersMutations";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router";

export const UsersPage = () => {
  // funciones de usuarios con el custom hook
  const { getUsers, getSemicompleteUserData, prefetchAllCompleteUserData } = useUsers();

  const { eliminarUsuarioOptimistic } = useUsersMutations();

  // estado para el dialogo de agregar usuario manualmente
  const [stateDialogOpen, setStateDialogOpen] = useState<boolean>(false);

  // estado para el dialogo de usuarios eliminados
  const [stateDialogUsersDeleted, setStateDialogUsersDeleted] = useState<boolean>(false);

  // estado para setear el usuario a eliminar
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<User | null>(null);

  // estado para almacenar el usuario a obtener datos completos
  const [userToFetch, setUserToFetch] = useState<{ rol: string; personId: number } | null>(null);

  // estado para setear el usuario a actualizar
  const [userToUpdate, setUserToUpdate] = useState<UserSemiComplete | null>(null);

  // Query que solo se ejecuta cuando userToFetch tiene valor
  const { data: completeUserData } = getSemicompleteUserData(userToFetch?.rol ?? "", userToFetch?.personId ?? 0, !!userToFetch);

  // estado para paginación de usuarios
  const [page, setPage] = useState<number>(1);
  
  // obtener los usuarios
  const { data: userData, isFetching } = getUsers(page);
  
  
  useEffect(() => {
    console.log(completeUserData)
    if (userToFetch && completeUserData) {
      setUserToUpdate(completeUserData?.data || completeUserData);
      setStateDialogOpen(true);
    }
  }, [userToFetch, completeUserData]);
  

  // Función para limpiar todo cuando se cierra el modal
  const handleCloseDialog = () => {
      // Limpiar estados cuando se cierra
      setUserToFetch(null);
      setUserToUpdate(null);
  };

  // Crear columnas con el callback de eliminación
  const columns = ColumnsTableUsers({ onDelete: setUsuarioAEliminar, onFetch: setUserToFetch, onUserPrefetch: prefetchAllCompleteUserData});

  /**
   * eliminar usuario
   * @param id id de usuario a eliminar
   */
  const handleDelete = () => {
    if(usuarioAEliminar) {
      // llamada a la mutación para eliminar usuario
      eliminarUsuarioOptimistic.mutate(usuarioAEliminar);
      // cerrar el dialogo
      setUsuarioAEliminar(null);
    }
  };


  if (isFetching) {
    return <Loading message="Cargando usuarios..." />;
  }

  return (
    <>
      <header>
        <Breadcrumb>
          <BreadcrumbList>
            {/* usuarios */}
            <BreadcrumbItem>
                <Link to="/inicio">Inicio</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {/* usuarios */}
            <BreadcrumbItem>
              <Link to="/usuarios">Usuarios</Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="font-bold text-center text-lg lg:text-2xl">Usuarios</h1>
        <p className="text-gray-500">
          En este módulo puedes administrar a todos los usuarios del sistema.
        </p>
      </header>

      <main>
        {/* formulario de usuario */}
        <UserForm 
          stateDialogOpen={stateDialogOpen}
          setStateDialogOpen={setStateDialogOpen}
          update={{
            userToUpdate,
            handleCloseDialog: handleCloseDialog,
            handleSuccessUpdate: handleCloseDialog,
          }}
        />

        {/* tabla de usuarios */}
        <DataTable columns={columns} data={userData?.data.data || []}  
          pagination={{
              currentPage: userData?.data.current_page || 1,
              lastPage: userData?.data.last_page || 1,
              total: userData?.data.total || 0,
              onPageChange: setPage,
            }}
        >
          <>
            <Button onClick={() => setStateDialogUsersDeleted(true)} variant={"outline"}>
              <Undo />
              Recuperar eliminados
            </Button>
            <Button onClick={() => setStateDialogOpen(true)}>
              <UserPlusIcon />
              Agregar usuario
            </Button>
          </>
        </DataTable>

          {/* dialogo de usuarios eliminados */}
        <UsersDeleted open={stateDialogUsersDeleted}  onOpenChange={(open) => !open && setStateDialogUsersDeleted(open)}  />

          {/* dialogo de usuario para eliminar */}
        <AlertDialogActions
          title="Eliminar usuario"
          description={`Esto eliminará el usuario ${usuarioAEliminar?.nombre} ${usuarioAEliminar?.apellidoPaterno} ${usuarioAEliminar?.apellidoMaterno}. ¿Estás seguro?`}
          open={!!usuarioAEliminar}
          onOpenChange={(open) => !open && setUsuarioAEliminar(null)}
          onConfirm={handleDelete}
        />

      </main>
    </>
  );
};
