"use client"

import { useEspecialidades } from "@/hooks/especialidades/useEspecialidades"
import { Link, useParams } from "react-router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Loading } from "@/components/ui/Loading"
import { ScrollArea } from "@/components/ui/scroll-area"

export const AsignaturasEspecialidades = () => {
  const { idEspecialidad } = useParams()
  const { getAsignaturasByEspecialidadId } = useEspecialidades()

  const { data, isLoading, isError } = getAsignaturasByEspecialidadId(Number(idEspecialidad))

  if (isLoading) {
    return <Loading message="Cargando..." />
  }

  if (isError || !data?.data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center gap-2 pt-6">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
            <p className="text-center text-muted-foreground">No hay información disponible.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const especialidadNombre = data.data[0]?.especialidad || "Especialidad"

  const asignaturasPorSemestre = data.data.reduce(
    (acc, asignatura) => {
      const semestre = asignatura.semestre
      if (!acc[semestre]) {
        acc[semestre] = []
      }
      acc[semestre].push(asignatura)
      return acc
    },
    {} as Record<number, typeof data.data>,
  )

  const semestresOrdenados = Object.keys(asignaturasPorSemestre)
    .map(Number)
    .sort((a, b) => a - b)

  return (
    <div className="flex flex-col h-screen">
      <header className="flex-shrink-0 space-y-2 pb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/inicio">Inicio</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/especialidades">Especialidades</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to={`/especialidades/detalles/${idEspecialidad}`}>Detalles</Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="font-bold text-center text-lg lg:text-2xl">
          Asignaturas de la especialidad {especialidadNombre}
        </h1>
        <p className="text-gray-500">
          En este módulo puedes ver las asignaturas de la especialidad {especialidadNombre}.
        </p>
      </header>
      <main className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="space-y-8 pr-4 pb-6">
            {(semestresOrdenados.map((semestre) => (
              <div key={semestre} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    {semestre}
                  </div>
                  <h2 className="text-xl font-semibold">Semestre</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {asignaturasPorSemestre[semestre].map((asignatura) => (
                    <Card key={asignatura.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base leading-tight">{asignatura.asignatura}</CardTitle>
                          <BookOpen className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                          {asignatura.tipo}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )))}
          </div>
        </ScrollArea>
      </main>
    </div>
  )
}
