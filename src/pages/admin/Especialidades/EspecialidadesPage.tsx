import type { Especialidad } from "@/api/especialidades/interfaces/EspecialidadesInterfaces";
import { ColumnsEspecialidades } from "@/components/especialidades/ColumnsEspecialidades";
import { DataTableEspecialidades } from "@/components/especialidades/DataTableEspecialidades";
import { EspecialidadesForm } from "@/components/especialidades/EspecialidadesForm";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/Loading";
import { useEspecialidades } from "@/hooks/especialidades/useEspecialidades";
import { CircleFadingPlus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export const EspecialidadesPage = () => {
  
  const { getEspecialidades } = useEspecialidades();
  
  const { data: especialidadesData, isFetching } = getEspecialidades();
  
  const [especialidadToUpdate, setEspecialidadToUpdate] = useState<Especialidad | null>(null);

  const [stateDialogOpen, setStateDialogOpen] = useState<boolean>(false);
  
  const cols = ColumnsEspecialidades( { setEspecialidadToUpdate: (especialidad) => { setEspecialidadToUpdate(especialidad); setStateDialogOpen(true); } } );


  const handleCloseDialog = () => {
      // Limpiar estados cuando se cierra
      setEspecialidadToUpdate(null);
  };


  if(isFetching) {
    return <Loading message="Cargando..." />;
  }

  return (
    <>
      <header>
        <Breadcrumb>
          <BreadcrumbList>
            {/* inicio */}
            <BreadcrumbItem>
              <Link to="/inicio">Inicio</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/especialidades">Especialidades</Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="font-bold text-center text-lg lg:text-2xl">
          Especialidades
        </h1>
        <p className="text-gray-500">
          En este módulo puedes ver las especialidades del sistema.
        </p>
      </header>
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

        <DataTableEspecialidades
          columns={cols}
          data={especialidadesData?.data || []}
        >
          <Button onClick={() => setStateDialogOpen(true)}>
            <CircleFadingPlus />
            Agregar Especialidad
          </Button>
        </DataTableEspecialidades>
      </main>
    </>
  );
};
