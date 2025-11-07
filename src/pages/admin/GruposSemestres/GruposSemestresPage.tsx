import { DataTable } from "@/components/ui/my/DataTable";
import { ColumnsTableGruposSemestres } from "@/components/grupoSemestres/ColumnsTableGruposSemestres";
import { Loading } from "@/components/ui/Loading";
import { useClases } from "@/hooks/clases/useClases";
import { useState } from "react";
import { Header } from "@/components/ui/my/Header";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { AlertDialogActions } from "@/components/users/AlertDialogActions";

export const GruposSemestresPage = () => {
  // hook de asignaturas
  const { getGruposSemestres, generateClases } = useClases();

  // columnas de la tabla
  const columns = ColumnsTableGruposSemestres();

  const [ open, setOpen ] = useState<boolean>(false);

  // estado para la paginación
  const [page, setPage] = useState<number>(1);

  // obtener asignaturas
  const { data, isLoading } = getGruposSemestres(page);


  // mostrar loading mientras se cargan los grupos
  if (isLoading) {
    return <Loading message="Cargando grupos y semestres ..." />;
  }

  return (
    <>
      <Header
        paths={[
          { name: "Grupos y Semestres", link: "/grupos_semestres" },
        ]}
        title="Grupos y Semestres"
        description="Aquí puedes ver todos los grupos y semestres."
      />

      <main>
        <DataTable
          columns={columns}
          data={data?.data.data || []}
          pagination={{
            currentPage: data?.data.current_page || 1,
            lastPage: data?.data.last_page || 1,
            total: data?.data.total || 0,
            onPageChange: setPage,
          }}
        filterOptions={{ nombre: "Grupo", columnName: "grupo" }}
        >
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setOpen(true)} className="focus:bg-green-100 focus:text-green-500 text-green-500">
                Iniciar clases de nuevo periodo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </DataTable>
      </main>
      <AlertDialogActions
        open={open}
        onOpenChange={setOpen}
        title="Crear clases nuevo periodo"
        description="Esta operación iniciará el siguiente periodo de semestres, creará sus clases y migrará a los estudiantes al siguiente semestre. ¿Deseas continuar?"
        danger="Únicamente si la fecha actual se encuentra dentro del nuevo periodo."
        onConfirm={generateClases}
       />
    </>
  );
};
