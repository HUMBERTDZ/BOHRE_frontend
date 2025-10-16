import { UsuarioForm } from "@/components/admin/UsuarioForm";
import { Button } from "@/components/ui/button";
import { createColumns, AlertDialogEliminar } from "@/components/users/Columns";
import { DataTable } from "@/components/users/DataTable";
import { useUsers } from "@/hooks/users/useUsers";
import { useState } from "react";
import type { Usuario } from "@/api/users/interfaces/UserInterface";
import { Loading } from "@/components/ui/Loading";

export const Usuarios = () => {
  // funciones de usuarios con el custom hook
  const { getUsers, eliminarUsuarioOptimistic } = useUsers();
  
  // obtener los usuarios
  const { data, isFetching } = getUsers();
  
  // estado para el dialogo de agregar usuario manualmente
  const [stateDialogOpen, setStateDialogOpen] = useState<boolean>(false);

  // estado para setear el usuario a eliminar
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<Usuario | null>(null);

  // Crear columnas con el callback de eliminación
  const columns = createColumns((usuario) => setUsuarioAEliminar(usuario));

  /**
   * eliminar usuario
   * @param id id de usuario a eliminar
   */
  const handleEliminar = (id: string) => {
    // llamada a la mutación para eliminar usuario
    eliminarUsuarioOptimistic.mutate(Number(id));
    // cerrar el dialogo
    setUsuarioAEliminar(null);
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
        <UsuarioForm stateDialogOpen={stateDialogOpen} setStateDialogOpen={setStateDialogOpen} />

        <DataTable columns={columns} data={data?.data.data || []}>
          <div className="flex items-center gap-2">
          <Button onClick={() => setStateDialogOpen(true)}>
            Recuperar eliminados
          </Button>
          <Button onClick={() => setStateDialogOpen(true)}>
            Agregar usuario
          </Button>
          </div>
        </DataTable>

        <AlertDialogEliminar
          usuario={usuarioAEliminar}
          open={!!usuarioAEliminar}
          onOpenChange={(open) => !open && setUsuarioAEliminar(null)}
          onConfirm={handleEliminar}
        />
      </main>
    </>
  );
};
