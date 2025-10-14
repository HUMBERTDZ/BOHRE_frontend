import { AgregarUsuario } from "@/components/admin/UsuarioFormData";
import { Button } from "@/components/ui/button";
import { Columns } from "@/components/users/Columns";
import { DataTable } from "@/components/users/DataTable";
import { useUsers } from "@/hooks/users/useUsers";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Usuarios = () => {
  // obteniendo funcion desde hook que obtiene los usuarios
  const { getUsers } = useUsers();

  // desestructurando props desde el hook
  const { data, error, isFetching, isSuccess, isError } = getUsers();

  // estado para abrir modal
  const [stateDialogOpen, setStateDialogOpen] = useState<boolean>(false);

  // efecto para mostrar un toast si se cargaron los usuarios o no
  useEffect(() => {
    if (isSuccess) {
      toast.success("Usuarios cargados");
    }
    if (isError) {
      toast.error("Error al cargar usuarios");
      console.error(error);
    }
  }, [isSuccess, isError, error]);

  if (isFetching) {
    return <div className="p-8 text-center">Cargando usuarios...</div>;
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
        {/* formulario para agregar usuario */}
        <AgregarUsuario stateDialogOpen={stateDialogOpen} setStateDialogOpen={setStateDialogOpen}  />

        <DataTable columns={Columns} data={data?.data.data || []}>
          <Button onClick={ () => { setStateDialogOpen(true) } }>Agregar usuario</Button>
        </DataTable>
      </main>
    </>
  );
};
