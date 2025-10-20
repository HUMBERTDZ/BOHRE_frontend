"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import type { GrupoSemestreDetails } from "@/api/gruposSemestres/interfaces/gruposSemestresExtraInterface"
import { ScrollArea } from "../ui/scroll-area"

interface GradesViewProps {
  data: GrupoSemestreDetails
}

function getGradeColor(grade: number): string {
  if (grade >= 90) return "text-emerald-600 dark:text-emerald-400"
  if (grade >= 80) return "text-blue-600 dark:text-blue-400"
  if (grade >= 70) return "text-amber-600 dark:text-amber-400"
  return "text-red-600 dark:text-red-400"
}

export function GradesView({ data }: GradesViewProps) {
  const [openSubjects, setOpenSubjects] = useState<Set<number>>(new Set())

  const toggleSubject = (id: number) => {
    const newOpen = new Set(openSubjects)
    if (newOpen.has(id)) {
      newOpen.delete(id)
    } else {
      newOpen.add(id)
    }
    setOpenSubjects(newOpen)
  }

  return (
    <ScrollArea className="h-full">
      <div className="w-full mx-auto space-y-6 pb-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-bold tracking-tight">Grupo {data.grupo}</h1>
          <Badge variant="outline" className="text-sm px-2 py-0.5">
            Semestre {data.semestre}
          </Badge>
        </div>
        <p className="text-muted-foreground">Periodo: {data.periodoSemestre}</p>
      </div>

      <div className="space-y-3">
        {data.asignaturas.map((subject) => {
          const isOpen = openSubjects.has(subject.idAsignatura)
          return (
            <Collapsible
              key={subject.idAsignatura}
              open={isOpen}
              onOpenChange={() => toggleSubject(subject.idAsignatura)}
            >
              <Card className="overflow-hidden">
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="py-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-left">
                        <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        <div>
                          <CardTitle className="text-base text-balance">{subject.nombre}</CardTitle>
                          <CardDescription className="text-sm mt-0.5">
                            {subject.alumnos.length} {subject.alumnos.length === 1 ? "alumno" : "alumnos"}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-0">
                    {subject.alumnos.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/30">
                              <TableHead className="w-[100px] py-2">NIA</TableHead>
                              <TableHead className="py-2">Nombre</TableHead>
                              <TableHead className="text-center py-2 w-[80px]">M1</TableHead>
                              <TableHead className="text-center py-2 w-[80px]">M2</TableHead>
                              <TableHead className="text-center py-2 w-[80px]">M3</TableHead>
                              <TableHead className="text-center py-2 w-[90px] font-semibold">Prom.</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {subject.alumnos.map((student) => (
                              <TableRow key={student.idAlumno} className="hover:bg-muted/30">
                                <TableCell className="font-mono text-xs py-2">{student.nia}</TableCell>
                                <TableCell className="font-medium py-2 text-sm">
                                  {student.apellidoPaterno} {student.apellidoMaterno} {student.nombre}
                                </TableCell>
                                <TableCell
                                  className={`text-center font-semibold py-2 ${getGradeColor(student.momento1)}`}
                                >
                                  {student.momento1}
                                </TableCell>
                                <TableCell
                                  className={`text-center font-semibold py-2 ${getGradeColor(student.momento2)}`}
                                >
                                  {student.momento2}
                                </TableCell>
                                <TableCell
                                  className={`text-center font-semibold py-2 ${getGradeColor(student.momento3)}`}
                                >
                                  {student.momento3}
                                </TableCell>
                                <TableCell className={`text-center font-bold py-2 ${getGradeColor(student.promedio)}`}>
                                  {student.promedio.toFixed(2)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-muted-foreground text-sm">No hay alumnos inscritos</div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          )
        })}
      </div>
    </div>
    </ScrollArea>
  )
}
