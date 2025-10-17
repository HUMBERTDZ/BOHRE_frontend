import { useState, type FC } from "react";
import {  AlertDialog,  AlertDialogCancel,  AlertDialogContent,  AlertDialogDescription,  AlertDialogFooter,  AlertDialogHeader,  AlertDialogTitle, } from "../ui/alert-dialog";
import { useUsers } from "@/hooks/users/useUsers";
import { Loading } from "../ui/Loading";
import { DataTable } from "./DataTable";
import { createColumns } from "./ColumnsTableDeletedUsers";
import type { Usuario } from "@/api/users/interfaces/UserInterface";
import { AlertDialogActions } from "./AlertDialogActions";

// Componente del AlertDialog de eliminación
interface AlertDialogEliminarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UsersDeleted: FC<AlertDialogEliminarProps> = ({ open, onOpenChange }) => {
  // del custom hook de usuarios extraer la función para obtener usuarios eliminados
  const { getUsersDeleted, eliminarUsuarioPermanenteOptimistic, recuperarUsuarioOptimistic } = useUsers();

  // obtener los datos de la peticion http de usuarios eliminados
  const { data: deletedUsers, isFetching } = getUsersDeleted();


  const [userDelete, setUserDelete] = useState<Usuario | null>(null);

  // estado para setear el usuario a recuperar
  const [usuarioARecuperar, setUsuarioARecuperar] = useState<Usuario | null>(null);

  // Crear columnas con el callback de eliminación
  const columns = createColumns(setUserDelete, setUsuarioARecuperar);

  const handleEliminarPermanente = () => {
    if (userDelete) {
      eliminarUsuarioPermanenteOptimistic.mutate(Number(userDelete.id));
      setUserDelete(null);
    }
  };

  const handleRecuperar = () => {
    if (usuarioARecuperar) {
      recuperarUsuarioOptimistic.mutate(Number(usuarioARecuperar.id));
      setUsuarioARecuperar(null);
    }
  };

  if (isFetching) {
    return <Loading message="Cargando usuarios eliminados..." />;
  }

  return (
    <>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent className="min-w-4/5 max-h-4/5 overflow-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Usuarios eliminados</AlertDialogTitle>
            <AlertDialogDescription>
              Estos usuarios han sido eliminados. ¿Deseas recuperarlos?
              <DataTable columns={columns} data={deletedUsers?.data || []} />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cerrar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialogActions
        title="Eliminar usuario permanentemente"
        description={`Esto eliminará el usuario ${userDelete?.nombre} ${userDelete?.apellidoPaterno} ${userDelete?.apellidoMaterno} permanentemente. ¿Estás seguro?`}
        open={userDelete !== null}
        onOpenChange={(open) => !open && setUserDelete(null)}
        onConfirm={handleEliminarPermanente}
      />

      <AlertDialogActions
        title="Recuperar usuario"
        description={`Esto recuperará el usuario ${usuarioARecuperar?.nombre} ${usuarioARecuperar?.apellidoPaterno} ${usuarioARecuperar?.apellidoMaterno}. ¿Estás seguro?`}
        open={usuarioARecuperar !== null}
        onOpenChange={(open) => !open && setUsuarioARecuperar(null)}
        onConfirm={handleRecuperar}
      />
    </>
  );
};
