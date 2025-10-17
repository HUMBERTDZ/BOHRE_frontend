import { UsuarioForm } from "@/components/admin/UsuarioForm";
import { Button } from "@/components/ui/button";
import { createColumns } from "@/components/users/Columns";
import { DataTable } from "@/components/users/DataTable";
import { useUsers } from "@/hooks/users/useUsers";
import { useState } from "react";
import type { Usuario } from "@/api/users/interfaces/UserInterface";
import { Loading } from "@/components/ui/Loading";
import { UsersDeleted } from "@/components/users/UsersDeleted";
import { AlertDialogActions } from "@/components/users/AlertDialogActions";
import { Undo, UserPlusIcon } from "lucide-react";

export const Usuarios = () => {
  // funciones de usuarios con el custom hook
  const { getUsers, prefetchUsersDeleted, eliminarUsuarioOptimistic } = useUsers();
  
  // obtener los usuarios
  const { data, isFetching } = getUsers();
  
  // estado para el dialogo de agregar usuario manualmente
  const [stateDialogOpen, setStateDialogOpen] = useState<boolean>(false);
  const [stateDialogUsersDeleted, setStateDialogUsersDeleted] = useState<boolean>(false);

  // estado para setear el usuario a eliminar
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<Usuario | null>(null);

  // Crear columnas con el callback de eliminación
  const columns = createColumns(setUsuarioAEliminar);

  /**
   * eliminar usuario
   * @param id id de usuario a eliminar
   */
  const handleEliminar = () => {
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
        <h1 className="font-bold text-center text-lg lg:text-2xl">Usuarios</h1>
        <p className="text-gray-500">
          En este módulo puedes administrar a todos los usuarios del sistema.
        </p>
      </header>

      <main>
        {/* formulario de usuario */}
        <UsuarioForm stateDialogOpen={stateDialogOpen} setStateDialogOpen={setStateDialogOpen} />

        {/* tabla de usuarios */}
        <DataTable columns={columns} data={data?.data.data || []}>
          <>
            <Button onMouseEnter={prefetchUsersDeleted}  onClick={() => setStateDialogUsersDeleted(true)} variant={"outline"}>
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
        <UsersDeleted
          open={stateDialogUsersDeleted} 
          onOpenChange={(open) => !open && setStateDialogUsersDeleted(open)} 
        />

          {/* dialogo de usuario para eliminar */}
        <AlertDialogActions
          title="Eliminar usuario"
          description={`Esto eliminará el usuario ${usuarioAEliminar?.nombre} ${usuarioAEliminar?.apellidoPaterno} ${usuarioAEliminar?.apellidoMaterno}. ¿Estás seguro?`}
          open={!!usuarioAEliminar}
          onOpenChange={(open) => !open && setUsuarioAEliminar(null)}
          onConfirm={handleEliminar}
        />

      </main>
    </>
  );
};
