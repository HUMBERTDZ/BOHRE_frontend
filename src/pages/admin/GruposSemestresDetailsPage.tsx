import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, } from "@/components/ui/breadcrumb";
import { useGruposSemestres } from "@/hooks/gruposSemestres/useGruposSemestres";
import { Link, useParams } from "react-router";
import { AlumnosTable } from "./GruposSemestres/AlumnosTable";
import { GrupoInfoCard } from "./GruposSemestres/GrupoInfoCard";

export const GruposSemestresDetailsPage = () => {

    const {idGrupoSemestre} = useParams();


    const { getGrupoSemestreDetails } = useGruposSemestres();


    const { data: response, isFetching } = getGrupoSemestreDetails(Number(idGrupoSemestre));

    if (isFetching) {
        return <div>Cargando detalles del grupo semestre...</div>;
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
                <Link to={`/grupos_semestres/detalles/${idGrupoSemestre}`}>Detalle</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="font-bold text-center text-lg lg:text-2xl">
          Detalle grupo semestre
        </h1>
        <p className="text-gray-500">
          Aquí puedes ver los detalles del grupo semestre.
        </p>
      </header>

      <main className="flex-1 overflow-hidden">
        <div className="h-full py-4 space-y-2">
          <GrupoInfoCard data={response?.data!} />
          <AlumnosTable alumnos={response?.data.alumnos!} />
        </div>
      </main>
    </div>
  );
};
