import { useGruposSemestres } from "@/hooks/gruposSemestres/useGruposSemestres";
import { AlumnosTable } from "./AlumnosTable";
import { GrupoInfoCard } from "./GrupoInfoCard";
import { useParams } from "react-router";
import { AsignaturasTable } from "./AsignaturasTable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loading } from "@/components/ui/Loading";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/ui/my/Header";

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
      <Header
        paths={[
          { name: 'grupos y semestres', link: '/grupos_semestres' },
          { name: `detalle grupo ${response.data.general?.grupo}`, link: `/grupos_semestres/detalles/${idGrupoSemestre}` },
        ]}
        title={`Detalle del Grupo ${response.data.general?.grupo} - Semestre ${response.data.general?.semestre}`}
        description={"Aquí puedes ver los detalles del grupo y semestre seleccionado."}
      />

      <main className="flex-1 flex flex-col p-4 space-y-6 overflow-hidden">
        <GrupoInfoCard data={response.data.general} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs
            defaultValue="asignaturas"
            className="flex flex-col flex-1 overflow-hidden"
          >
            <TabsList>
              <TabsTrigger value="asignaturas">Asignaturas</TabsTrigger>
              <TabsTrigger value="alumnos">Alumnos</TabsTrigger>
            </TabsList>

            <TabsContent value="asignaturas" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full w-full">
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
                  advertencia={response.data.advertencia && "Vuelva atrás y cree las clases para el nuevo periodo."}
                />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="alumnos" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full w-full">
                <AlumnosTable alumnos={response.data.general.alumnos} />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};
