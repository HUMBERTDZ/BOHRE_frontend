import { useParams } from "react-router";
import { Loading } from "@/components/ui/Loading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEspecialidades } from "@/hooks/especialidades/useEspecialidades";
import { EspecialidadInfoCard } from "./EspecialidadInfoCard";
import { ClasesEspecialidadTable } from "./ClasesEspecialidadTable";
import { AlumnosEspecialidadTable } from "./AlumnosEspecialidadTable";
import { PlanEstudiosCard } from "./PlanEstudiosCard";
import { Header } from "@/components/ui/my/Header";

export const EspecialidadesDetailsPage = () => {
  const { idEspecialidad } = useParams();

  const { getEspecialidadById } = useEspecialidades();
  const { data: response, isLoading } = getEspecialidadById(
    Number(idEspecialidad)
  );

  if (isLoading) {
    return <Loading message="Cargando detalles de la especialidad..." />;
  }

  if (!response || !response.data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">No se encontraron datos</p>
      </div>
    );
  }

  const {
    especialidad,
    anio,
    clasesPorSemestreGrupo,
    alumnosPorSemestreGrupo,
    planEstudios,
    estadisticas,
  } = response.data;

  return (
    <div className="flex flex-col h-screen">
      <Header
        paths={[
          { name: "Especialidades", link: "/especialidades" },
          { name: especialidad.nombre, link: `/especialidades/detalles/${especialidad.id}` },
        ]}
        title={especialidad.nombre}
        description={`Detalles de la especialidad ${especialidad.nombre}.`}
      />

      <main className="flex-1 flex flex-col p-4 space-y-6 overflow-hidden">
        <EspecialidadInfoCard
          especialidad={especialidad}
          estadisticas={estadisticas}
          anio={anio}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs
            defaultValue="clases"
            className="flex flex-col flex-1 overflow-hidden"
          >
            <TabsList className="shrink-0">
              <TabsTrigger value="clases">Clases</TabsTrigger>
              <TabsTrigger value="alumnos">Alumnos</TabsTrigger>
              <TabsTrigger value="plan-estudios">Plan de Estudios</TabsTrigger>
            </TabsList>

            <TabsContent
              value="clases"
              className="flex-1 overflow-hidden"
            >
              <ScrollArea className="h-full w-full">
                <ClasesEspecialidadTable
                  clasesPorSemestreGrupo={clasesPorSemestreGrupo}
                />
              </ScrollArea>
            </TabsContent>

            <TabsContent
              value="alumnos"
              className="flex-1 overflow-hidden"
            >
              <ScrollArea className="h-full w-full">
                <AlumnosEspecialidadTable
                  alumnosPorSemestreGrupo={alumnosPorSemestreGrupo}
                />
              </ScrollArea>
            </TabsContent>

            <TabsContent
              value="plan-estudios"
              className="flex-1 overflow-hidden"
            >
              <ScrollArea className="h-full w-full">
                <PlanEstudiosCard planEstudios={planEstudios} />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>

  );
};
