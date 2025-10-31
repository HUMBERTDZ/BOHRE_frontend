import type { Asignatura } from "@/api/asignaturas/interfaces/AsignaturasInterfaces";
import { AsignaturaForm } from "@/components/asignaturas/AsignaturaForm";
import { ColumnsTableAsignaturas } from "@/components/asignaturas/ColumnsTableAsignaturas";
import { DataTable } from "@/components/ui/my/DataTable";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/my/Header";
import { Loading } from "@/components/ui/Loading";
import { AlertDialogActions } from "@/components/users/AlertDialogActions";
import { useAsignaturas } from "@/hooks/asignaturas/useAsignaturas";
import { CircleFadingPlus } from "lucide-react";
import { useEffect, useState } from "react";

export const AsignaturasPage = () => {
  // hook de asignaturas
  const { getAsignaturas, getAsignatura, deleteAsignatura } = useAsignaturas();


  // estado para el dialogo de agregar usuario manualmente
  const [stateDialogOpen, setStateDialogOpen] = useState<boolean>(false);

  // estado para la asignatura a actualizar
  const [asignaturaToFetch, setAsignaturaToFetch] = useState<number | null>(null);

  // datos de la asignatura a actualizar
  const [ asignaturaToUpdate, setAsignaturaToUpdate ] = useState<Asignatura | null>(null);

  // datos de la asignatura a actualizar
  const [ asignaturaToDelete, setAsignaturaToDelete ] = useState<Asignatura | null>(null);

  const { data: asignaturaFetched, isLoading: isLoadingAsignatura } = getAsignatura(asignaturaToFetch!);

  // columnas de la tabla
  const columns = ColumnsTableAsignaturas({ onFetch: setAsignaturaToFetch, onDelete: setAsignaturaToDelete });

  // estado para la paginación
  const [page, setPage] = useState<number>(1);

  // obtener asignaturas
  const { data, isLoading, } = getAsignaturas(page);


  const handleCloseDialog = () => {
      // Limpiar estados cuando se cierra
      setAsignaturaToFetch(null);
      setAsignaturaToUpdate(null);
  };


  useEffect(() => {
    if (asignaturaToFetch && asignaturaFetched) {
      setAsignaturaToUpdate(asignaturaFetched?.data || null);
      setAsignaturaToFetch(null);
      setStateDialogOpen(true);
    }
  }, [asignaturaToFetch, asignaturaFetched, isLoadingAsignatura]);


  // mostrar loading mientras se cargan las asignaturas
  if( isLoading ) {
    return <Loading message="Cargando asignaturas..." />;
  }

  return (
    <>
      <Header
        paths={[
          { name: "Asignaturas", link: "/asignaturas" },
        ]} 
        title="Asignaturas"
        description="En este módulo puedes administrar todas las asignaturas del sistema."
      />

      <main>

        <AsignaturaForm
          stateDialogOpen={stateDialogOpen}
          setStateDialogOpen={setStateDialogOpen}
          update={{
            asignaturaToUpdate,
            handleCloseDialog,
            handleSuccessUpdate: handleCloseDialog
          }}
        />

        <DataTable
          columns={columns}
          data={data?.data.data || []}
          pagination={{
              currentPage: data?.data.current_page || 1,
              lastPage: data?.data.last_page || 1,
              total: data?.data.total || 0,
              onPageChange: setPage,
            }}
          filterOptions={{ nombre: "Nombre", columnName: "nombre" }}
        >
          <Button onClick={() => setStateDialogOpen(true)}>
              <CircleFadingPlus />
              Agregar Asignatura
            </Button>
        </DataTable>


        <AlertDialogActions
          title="Eliminar asignatura"
          description={`Esto eliminará la asignatura ${asignaturaToDelete?.nombre} y no se podrá deshacer. ¿Estás seguro?`}
          open={!!asignaturaToDelete}
          onOpenChange={(open) => !open && setAsignaturaToDelete(null)}
          onConfirm={() => { deleteAsignatura(asignaturaToDelete!.idAsignatura); }}
        />
      </main>
    </>
  );
};
