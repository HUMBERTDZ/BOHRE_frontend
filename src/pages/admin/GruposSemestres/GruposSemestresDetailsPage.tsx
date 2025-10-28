import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useGruposSemestres } from "@/hooks/gruposSemestres/useGruposSemestres";
import { AlumnosTable } from "./AlumnosTable";
import { GrupoInfoCard } from "./GrupoInfoCard";
import { Link, useParams } from "react-router";
import { AsignaturasTable } from "./AsignaturasTable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loading } from "@/components/ui/Loading";

export const GruposSemestresDetailsPage = () => {
  const { idGrupoSemestre } = useParams();

  const { getGrupoSemestreDetails } = useGruposSemestres();

  const { data: response, isFetching } = getGrupoSemestreDetails(
    Number(idGrupoSemestre)
  );

  if (isFetching) {
    return <Loading message="Cargando detalles del grupo semestre..." />;
  }

  // Validación adicional: si no hay datos
  if (!response || !response.data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">No se encontraron datos</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/">Inicio</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/grupos_semestres">Grupos y Semestres</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to={`/grupos_semestres/detalles/${idGrupoSemestre}`}>
                Detalle
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="font-bold text-center text-lg lg:text-2xl">
          Alumnos y clases de {response.data.general?.semestre}°
          {response.data.general?.grupo} - Ciclo {response.data.anio}
        </h1>
        <p className="text-gray-500">
          Aquí puedes ver los alumnos que pertenecen al grupo y gestionar las
          clases del semestre seleccionado.
        </p>
      </header>

      <main className="flex-1 overflow-hidden">
        <div className="h-full py-6">
          <ScrollArea className="h-full">
            <div className="w-full mx-auto space-y-6 pb-6">
              {response.data.general && (
                <GrupoInfoCard data={response.data.general} />
              )}

              <AsignaturasTable
                clasesTroncoComun={response.data.clases?.troncoComun || []}
                clasesEspecialidades={
                  response.data.clases?.especialidades || {}
                }
                anio={response.data.anio || new Date().getFullYear()}
                estadisticas={
                  response.data.estadisticas || {
                    totalClases: 0,
                    clasesConDocente: 0,
                    clasesSinDocente: 0,
                  }
                }
                advertencia={response.data.advertencia}
              />

              {response.data.general?.alumnos && (
                <AlumnosTable alumnos={response.data.general.alumnos} />
              )}
            </div>
          </ScrollArea>
        </div>
      </main>
    </div>
  );
};