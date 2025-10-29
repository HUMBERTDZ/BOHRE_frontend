// components/ClasesEspecialidadTable.tsx

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ClasesPorSemestreGrupo } from "@/api/calificaciones/interfaces/CalificacionesByEspecialidad";
import { useUsers } from "@/hooks/users/useUsers";
import { CalificacionesDialog } from "@/components/calificaciones/CalificacionesDialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ClasesEspecialidadTableProps {
  clasesPorSemestreGrupo: ClasesPorSemestreGrupo[];
}

export function ClasesEspecialidadTable({
  clasesPorSemestreGrupo,
}: ClasesEspecialidadTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedClaseId, setSelectedClaseId] = useState<number | null>(null);

  const { getDocentes, asignarDocente } = useUsers();
  const { data: docentesResponse, isLoading: loadingDocentes } = getDocentes();

  const handleAsignarDocente = (idClase: number, idDocente: string) => {
    const docenteId = idDocente === "sin-asignar" ? null : Number(idDocente);

    asignarDocente.mutate(
      { idClase, idDocente: docenteId },
      {
        onSuccess: () => {
          toast.success(
            docenteId
              ? "Docente asignado correctamente"
              : "Docente desasignado correctamente"
          );
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.message || "Error al asignar docente"
          );
        },
      }
    );
  };

  const handleVerCalificaciones = (idClase: number) => {
    setSelectedClaseId(idClase);
    setDialogOpen(true);
  };

  if (clasesPorSemestreGrupo.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clases</CardTitle>
        </CardHeader>
        <div className="p-6 text-center text-muted-foreground">
          No hay clases creadas para esta especialidad en el ciclo actual
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {clasesPorSemestreGrupo.map((grupo) => (
          <Card key={`${grupo.semestre}-${grupo.grupo}`}>
            <CardHeader>
              <CardTitle>
                {grupo.semestre}° Semestre - Grupo {grupo.grupo}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {grupo.clases.length} clase(s) | ID Grupo-Semestre:{" "}
                {grupo.idGrupoSemestre}
              </p>
            </CardHeader>
            <div className="p-2">
              <div className="overflow-x-auto">
                <Table className="text-center">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border/50">
                      <TableHead className="font-semibold text-center">
                        ID
                      </TableHead>
                      <TableHead className="font-semibold text-center">
                        Asignatura
                      </TableHead>
                      <TableHead className="font-semibold text-center">
                        Alumnos
                      </TableHead>
                      <TableHead className="font-semibold text-center">
                        Docente
                      </TableHead>
                      <TableHead className="font-semibold text-center">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grupo.clases.map((clase) => (
                      <TableRow
                        key={clase.idClase}
                        className="border-border/50 hover:bg-accent/50 transition-colors"
                      >
                        <TableCell className="font-mono text-sm">
                          {clase.idClase}
                        </TableCell>
                        <TableCell className="font-medium">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="block max-w-[250px] truncate cursor-help text-center mx-auto">
                                {clase.nombreAsignatura}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs break-words">
                                {clase.nombreAsignatura}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {clase.alumnosInscritos}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {clase.nombreDocente ? (
                            <span className="text-sm">
                              {clase.nombreDocente}
                            </span>
                          ) : (
                            <Badge variant="outline" className="text-orange-600">
                              Sin asignar
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="flex gap-1 justify-center">
                          <Select
                            value={clase.idDocente?.toString() || "sin-asignar"}
                            onValueChange={(value) =>
                              handleAsignarDocente(clase.idClase, value)
                            }
                            disabled={loadingDocentes || asignarDocente.isPending}
                          >
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Asignar docente" />
                              {asignarDocente.isPending && (
                                <Loader2 className="h-4 w-4 animate-spin ml-2" />
                              )}
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sin-asignar">
                                <span className="text-muted-foreground">
                                  Sin asignar
                                </span>
                              </SelectItem>
                              {loadingDocentes ? (
                                <SelectItem value="loading" disabled>
                                  Cargando docentes...
                                </SelectItem>
                              ) : (
                                docentesResponse?.data.map((docente) => (
                                  <SelectItem
                                    key={docente.id}
                                    value={docente.id.toString()}
                                  >
                                    {docente.nombreCompleto}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>

                          <Button
                            variant="outline"
                            title="Ver calificaciones"
                            onClick={() => handleVerCalificaciones(clase.idClase)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <CalificacionesDialog
        idClase={selectedClaseId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}