import { useState } from "react";
import { BookOpen, Users, GraduationCap } from "lucide-react";
import { CalificacionesClase } from "./CalificacionesClase";
import { Header } from "@/components/ui/my/Header";
import { useAuth } from "@/hooks/useAuth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loading } from "@/components/ui/Loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAsignaturas } from "@/hooks/asignaturas/useAsignaturas";
import { CardEstadistica } from "@/components/ui/my/CardEstadistica";
import { MateriaCard } from "@/components/ui/my/MateriaCard";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ActionOptionsMenu } from "@/components/ui/my/ActionOptionsmenu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export const DocenteMateriasPage = () => {
  const { user, logout } = useAuth();

  const { getAsignaturaByDocente } = useAsignaturas();

  const { data: info, isLoading } = getAsignaturaByDocente(user?.idPersona!);

  const data = info?.data;

  const [claseSeleccionada, setClaseSeleccionada] = useState<number | null>(
    null
  );

  const handleVerClase = (idClase: number) => setClaseSeleccionada(idClase);

  if (isLoading) return <Loading message="Cargando mis materias..." />;

  if (!data)
    return (
      <ErrorView
        title="Mis Materias"
        message="No se pudieron cargar las materias"
      />
    );

  return (
    <div className="p-4 bg-gray-100">
      <Header
        title={`Materias de ${data.docente.nombre}`}
        description={`Bienvenida ${data.docente.nombre}, estas son las materias que impartes este periodo escolar.`}
        paths={[]}
        rootPath={false}
      />

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <CardEstadistica
          title="Total Clases"
          value={data.estadisticas.totalClases}
          icon={<BookOpen className="w-8 h-8 text-blue-500" />}
        />
        <CardEstadistica
          title="Total Alumnos"
          value={data.estadisticas.totalAlumnos}
          icon={<Users className="w-8 h-8 text-green-500" />}
        />
        <CardEstadistica
          title="Materias Únicas"
          value={data.estadisticas.materiasUnicas}
          icon={<GraduationCap className="w-8 h-8 text-purple-500" />}
        />
        <CardEstadistica
          title="Mat. Comunes"
          value={data.estadisticas.totalComunes}
        />
        <CardEstadistica
          title="Mat. Especialidad"
          value={data.estadisticas.totalEspecialidad}
        />
      </div>

      <Tabs defaultValue="comunes">
        <TabsList>
          <TabsTrigger value="comunes">Materias Comunes</TabsTrigger>
          <TabsTrigger value="especialidad">
            Materias de Especialidad
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comunes">
          <ScrollArea className="h-[500px] w-full">
            {/* Materias Comunes */}
            {data.materiasComunes.length > 0 && (
              <div className="mb-6">
                <Accordion type="single" collapsible className="space-y-3">
                  {data.materiasComunes.map((grupo) => (
                    <AccordionItem
                      key={grupo.idGrupoSemestre}
                      value={String(grupo.idGrupoSemestre)}
                    >
                      <AccordionTrigger className="bg-white rounded-lg shadow px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <p className="text-sm text-blue-800 font-bold">
                            Semestre {grupo.semestre} - {grupo.grupo}
                          </p>
                          <p className="text-sm text-gray-300">
                            {grupo.materias.length}{" "}
                            {grupo.materias.length === 1
                              ? "materia"
                              : "materias"}
                          </p>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="mt-2 pl-6 py-4 space-y-4 rounded-md border border-dashed border-blue-200">
                        {grupo.materias.map((m) => (
                          <div
                            key={m.idClase}
                            className="border-l-4 border-blue-300 pl-4 space-y-2"
                          >
                            <MateriaCard
                              materia={m}
                              onVerClase={handleVerClase}
                            />
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="especialidad">
          <ScrollArea className="h-[500px] w-full">
            {/* Materias Especialidad */}
            {data.materiasEspecialidad.length > 0 && (
              <div>
                <Accordion type="single" collapsible className="space-y-3">
                  {data.materiasEspecialidad.map((especialidad) => {
                    const key = `${especialidad.especialidad}-${especialidad.semestre}`;
                    return (
                      <AccordionItem key={key} value={key}>
                        <AccordionTrigger className="bg-white rounded-lg shadow px-6 py-4 flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <p className="text-sm text-purple-800 font-bold">
                              {especialidad.especialidad} - Semestre{" "}
                              {especialidad.semestre}
                            </p>
                            <p className="text-sm text-gray-300">
                              {especialidad.grupos.length}{" "}
                              {especialidad.grupos.length === 1
                                ? "grupo"
                                : "grupos"}
                            </p>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="mt-2 pl-6 py-4 space-y-4 rounded-md border border-dashed border-blue-200">
                          {especialidad.grupos.map((grupo) => (
                            <div
                              key={grupo.idGrupoSemestre}
                              className="border-l-4 border-purple-300 pl-4 space-y-2"
                            >
                              <p className="text-sm font-semibold text-gray-700 mb-2">
                                Grupo {grupo.grupo}
                              </p>
                              {grupo.materias.map((m) => (
                                <MateriaCard
                                  key={m.idClase}
                                  materia={m}
                                  onVerClase={handleVerClase}
                                />
                              ))}
                            </div>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Mensaje si no hay materias */}
      {data.materiasComunes.length === 0 &&
        data.materiasEspecialidad.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800">
              No tienes materias asignadas para este año
            </p>
          </div>
        )}

      {claseSeleccionada && (
        <CalificacionesClase
          idClase={claseSeleccionada}
          onClose={() => setClaseSeleccionada(null)}
        />
      )}

      <div className="w-fit h-fit fixed top-4 right-4">
        <ActionOptionsMenu>
          <DropdownMenuItem className="focus:bg-red-300" onClick={() => logout()}>
            Cerrar sesión
          </DropdownMenuItem>
        </ActionOptionsMenu>
      </div>
    </div>
  );
};

const ErrorView = ({ title, message }: { title: string; message: string }) => (
  <>
    <Header title={title} description={message} paths={[]} rootPath={false} />
    <div className="h-[calc(100vh-80px)] flex items-center justify-center text-gray-500">
      {message}
    </div>
  </>
);
