import { useState, type FC } from "react";
import {  AlertDialog,  AlertDialogCancel,  AlertDialogContent,  AlertDialogDescription,  AlertDialogFooter,  AlertDialogHeader,  AlertDialogTitle, } from "../ui/alert-dialog";
import { useUsers } from "@/hooks/users/useUsers";
import { Loading } from "../ui/Loading";
import { DataTable } from "./DataTable";
import { ColumnsTableDeletedUsers } from "./ColumnsTableDeletedUsers";
import type { User } from "@/api/users/interfaces/UserInterface";
import { AlertDialogActions } from "./AlertDialogActions";
import { useUsersMutations } from "@/hooks/users/useUsersMutations";

// Componente del AlertDialog de eliminación
interface AlertDialogEliminarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UsersDeleted: FC<AlertDialogEliminarProps> = ({ open, onOpenChange }) => {
  // del custom hook de usuarios extraer la función para obtener usuarios eliminados
  const { getUsersDeleted } = useUsers();

  const { eliminarUsuarioPermanenteOptimistic, recuperarUsuarioOptimistic } = useUsersMutations();

  // estado para paginación de usuarios
  const [page, setPage] = useState<number>(1);

  // obtener los datos de la peticion http de usuarios eliminados
  const { data: deletedUsers, isFetching } = getUsersDeleted(page);


  const [userDelete, setUserDelete] = useState<User | null>(null);

  // estado para setear el usuario a recuperar
  const [usuarioARecuperar, setUsuarioARecuperar] = useState<User | null>(null);

  // Crear columnas con el callback de eliminación
  const columns = ColumnsTableDeletedUsers(setUserDelete, setUsuarioARecuperar);

  const handleDeleteUserPermanently = () => {
    if (userDelete) {
      eliminarUsuarioPermanenteOptimistic.mutate(Number(userDelete.id));
      setUserDelete(null);
    }
  };

  const processUserRecovery = () => {
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
              <DataTable 
                columns={columns} 
                data={deletedUsers?.data.data || []}
                pagination={{
                  currentPage: deletedUsers?.data.current_page || 1,
                  lastPage: deletedUsers?.data.last_page || 1,
                  total: deletedUsers?.data.total || 0,
                  onPageChange: setPage,
                }}
              />
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
        onConfirm={handleDeleteUserPermanently}
      />

      <AlertDialogActions
        title="Recuperar usuario"
        description={`Esto recuperará el usuario ${usuarioARecuperar?.nombre} ${usuarioARecuperar?.apellidoPaterno} ${usuarioARecuperar?.apellidoMaterno}. ¿Estás seguro?`}
        open={usuarioARecuperar !== null}
        onOpenChange={(open) => !open && setUsuarioARecuperar(null)}
        onConfirm={processUserRecovery}
      />
    </>
  );
};
