"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
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

  return (
    <div className="flex flex-col h-screen">
      <header>
        <Breadcrumb>
          <BreadcrumbList>
            {/* inicio */}
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to="/">Inicio</Link>
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            {/* usuarios */}
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to="/grupos_semestres">Grupos y Semestres</Link>
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            {/* usuarios */}
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to={`/grupos_semestres/detalles/${idGrupoSemestre}`}>
                  Detalle
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="font-bold text-center text-lg lg:text-2xl">
          Alumnos y asignaturas de {" "}
          {response?.data.general.semestre}
          {response?.data.general.grupo}
        </h1>
        <p className="text-gray-500">
          Aquí puedes ver los alumnos que pertenecen al grupo. Además, las asignaturas destinadas al semestre seleccionado.
        </p>
      </header>

      <main className="flex-1 overflow-hidden">
        <div className="h-full py-6">
          <ScrollArea className="h-full">
            <div className="w-full mx-auto space-y-6 pb-6">
              <GrupoInfoCard data={response?.data.general!} />
              <AlumnosTable alumnos={response?.data.general.alumnos!} />
              <AsignaturasTable asignaturas={response?.data.asignaturas!} />
            </div>
          </ScrollArea>
        </div>
      </main>
    </div>
  );
};
