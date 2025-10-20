import { DataTable } from "@/components/grupoSemestres/DataTable";
import { ColumnsTableGruposSemestres } from "@/components/grupoSemestres/ColumnsTableGruposSemestres";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator, } from "@/components/ui/breadcrumb";
import { Loading } from "@/components/ui/Loading";
import { useGruposSemestres } from "@/hooks/gruposSemestres/useGruposSemestres";
import { useState } from "react";
import { Link } from "react-router";

export const GruposSemestresPage = () => {
  // hook de asignaturas
  const { getGruposSemestres } = useGruposSemestres();

  // columnas de la tabla
  const columns = ColumnsTableGruposSemestres({ onPrefetch: (id: number) => {} });

  // estado para la paginación
  const [page, setPage] = useState<number>(1);

  // obtener asignaturas
  const { data, isLoading } = getGruposSemestres(page);


  // useEffect(() => {
  //   if (asignaturaToFetch && asignaturaFetched) {
  //     setAsignaturaToUpdate(asignaturaFetched?.data || null);
  //     setAsignaturaToFetch(null);
  //     setStateDialogOpen(true);
  //   }
  // }, [asignaturaToFetch, asignaturaFetched, isLoadingAsignatura]);

  // mostrar loading mientras se cargan los grupos
  if (isLoading) {
    return <Loading message="Cargando grupos y semestres ..." />;
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
              <Link to="/grupos_semestres">Grupos y Semestres</Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="font-bold text-center text-lg lg:text-2xl">
          Grupos y Semestres
        </h1>
        <p className="text-gray-500">
          En este módulo puedes administrar todos los grupos y semestres del
          sistema.
        </p>
      </header>

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
        />
      </main>
    </>
  );
};
