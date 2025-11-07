import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Clase } from "@/api/clases/interfaces/gruposSemestresExtraInterface";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue, } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, BookOpen, Users, Loader2, Eye, FileDown } from "lucide-react";
import { toast } from "sonner";
import { useUsers } from "@/hooks/users/useUsers";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CalificacionesDialog } from "@/components/calificaciones/CalificacionesDialog";
import { ButtonLink } from "@/components/ui/my/ButtonLink";
import { useQueryClient } from "@tanstack/react-query";
import { useClases } from "@/hooks/clases/useClases";

interface AsignaturasTableProps {
  clasesTroncoComun: Clase[];
  clasesEspecialidades: Record<string, Clase[]>;
  anio: number;
  estadisticas: {
    totalClases: number;
    clasesConDocente: number;
    clasesSinDocente: number;
  };
  advertencia?: string;
  onDownloadComunesExcel?: () => void;
}

export function AsignaturasTable({ clasesTroncoComun, clasesEspecialidades, anio, estadisticas, advertencia, onDownloadComunesExcel }: AsignaturasTableProps) {
  const { getDocentes, } = useUsers();
  const { asignarDocente } = useClases();
  const { data: docentesResponse, isLoading: loadingDocentes } = getDocentes();

  const queryClient = useQueryClient();

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

          // Invalidar queries relacionadas
          queryClient.invalidateQueries({ queryKey: ["grupoSemestreExtra"] });
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.message || "Error al asignar docente"
          );
        },
      }
    );
  };

  if (advertencia) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Clases del ciclo {anio}
          </CardTitle>
        </CardHeader>
        <div className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{advertencia}</AlertDescription>
          </Alert>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total Clases</p>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{estadisticas.totalClases}</p>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Con Docente</p>
              <Users className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">
              {estadisticas.clasesConDocente}
            </p>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Sin Docente</p>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-orange-600">
              {estadisticas.clasesSinDocente}
            </p>
          </CardHeader>
        </Card>
      </div>

      {/* Tronco Común */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex justify-between items-center">
            Tronco Común - Ciclo {anio}
            <Button variant={"outline"} size={"sm"} onClick={onDownloadComunesExcel}>
              <FileDown />
              Descargar calificaciones
            </Button>
          </CardTitle>
        </CardHeader>
        <div className="p-2">
          <ClasesTable
            clases={clasesTroncoComun}
            docentes={docentesResponse?.data || []}
            loadingDocentes={loadingDocentes}
            onAsignarDocente={handleAsignarDocente}
            isAssigning={asignarDocente.isPending}
          />
        </div>
      </Card>

      {/* Especialidades */}
      {Object.entries(clasesEspecialidades).map(
        ([especialidad, clases]) =>
          clases && clases.length > 0 ? (
            <Card key={especialidad} className="border-border/50">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex justify-between items-center">
                  Especialidad: {especialidad}

                  <ButtonLink
                    url={`/especialidades/detalles/${clases[0].idEspecialidad}`}
                    button={{
                      variant: "outline",
                      size: "sm"
                    }}
                  />
                </CardTitle>
              </CardHeader>
              <div className="p-2">
                <ClasesTable
                  clases={clases}
                  docentes={docentesResponse?.data || []}
                  loadingDocentes={loadingDocentes}
                  onAsignarDocente={handleAsignarDocente}
                  isAssigning={asignarDocente.isPending}
                />
              </div>
            </Card>
          ) : null
      )}
    </div>
  );
}

// Componente auxiliar
interface ClasesTableProps {
  clases: Clase[];
  docentes: any[];
  loadingDocentes: boolean;
  onAsignarDocente: (idClase: number, idDocente: string) => void;
  isAssigning: boolean;
}

function ClasesTable({
  clases,
  docentes,
  loadingDocentes,
  onAsignarDocente,
  isAssigning,
}: ClasesTableProps) {

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedClaseId, setSelectedClaseId] = useState<number | null>(null);

  const handleVerCalificaciones = (idClase: number) => {
    setSelectedClaseId(idClase);
    setDialogOpen(true);
  };
  return (
    <>
    <div className="overflow-x-auto">
      <Table className="text-center">
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border/50">
            <TableHead className="font-semibold text-center">ID</TableHead>
            <TableHead className="font-semibold text-center">
              Asignatura
            </TableHead>
            <TableHead className="font-semibold text-center">Tipo</TableHead>
            <TableHead className="font-semibold text-center">
              Alumnos
            </TableHead>
            <TableHead className="font-semibold text-center">
              Docente Asignado
            </TableHead>
            <TableHead className="font-semibold text-center">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clases.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-8"
              >
                No hay clases registradas
              </TableCell>
            </TableRow>
          ) : (
            clases.map((clase) => (
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
                  <Badge variant="outline">{clase.tipoAsignatura}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{clase.alumnosInscritos}</Badge>
                </TableCell>
                <TableCell>
                  {clase.nombreDocente ? (
                    <span className="text-sm">{clase.nombreDocente}</span>
                  ) : (
                    <Badge variant="outline" className="text-orange-600">
                      Sin asignar
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="flex gap-1">
                  <Select
                    value={clase.idDocente?.toString() || "sin-asignar"}
                    onValueChange={(value) => onAsignarDocente(clase.idClase, value) }
                    disabled={loadingDocentes || isAssigning}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Asignar docente" />
                      {isAssigning && (
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
                        docentes.map((docente) => (
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
    <CalificacionesDialog
        idClase={selectedClaseId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}