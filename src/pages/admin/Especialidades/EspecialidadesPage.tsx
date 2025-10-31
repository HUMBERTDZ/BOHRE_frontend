import type { Especialidad } from "@/api/especialidades/interfaces/EspecialidadesInterfaces";
import { ColumnsTableEspecialidades } from "@/components/especialidades/ColumnsTableEspecialidades";
import { EspecialidadesForm } from "@/components/especialidades/EspecialidadesForm";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/my/DataTable";
import { Header } from "@/components/ui/my/Header";
import { Loading } from "@/components/ui/Loading";
import { useEspecialidades } from "@/hooks/especialidades/useEspecialidades";
import { CircleFadingPlus } from "lucide-react";
import { useState } from "react";

export const EspecialidadesPage = () => {
  
  const { getEspecialidades } = useEspecialidades();
  
  const { data: especialidadesData, isFetching } = getEspecialidades();
  
  const [especialidadToUpdate, setEspecialidadToUpdate] = useState<Especialidad | null>(null);

  const [stateDialogOpen, setStateDialogOpen] = useState<boolean>(false);
  
  const cols = ColumnsTableEspecialidades( { setEspecialidadToUpdate: (especialidad) => { setEspecialidadToUpdate(especialidad); setStateDialogOpen(true); } } );


  const handleCloseDialog = () => {
      // Limpiar estados cuando se cierra
      setEspecialidadToUpdate(null);
  };


  if(isFetching) {
    return <Loading message="Cargando..." />;
  }

  return (
    <>
      <Header
        paths={[
          { name: "Especialidades", link: "/especialidades" },
        ]}
        title="Especialidades"
        description="Administración de las especialidades del sistema."
       />
      <main>
        <EspecialidadesForm
          stateDialogOpen={stateDialogOpen}
          setStateDialogOpen={setStateDialogOpen}
          update={{
            especialidadToUpdate,
            handleCloseDialog,
            handleSuccessUpdate: handleCloseDialog
          }}
        />

        <DataTable
          columns={cols}
          data={especialidadesData?.data || []}
          filterOptions={{
            nombre: "Nombre",
            columnName: "nombre"
          }}
        >
          <Button onClick={() => setStateDialogOpen(true)}>
            <CircleFadingPlus />
            Agregar Especialidad
          </Button>
        </DataTable>
      </main>
    </>
  );
};
