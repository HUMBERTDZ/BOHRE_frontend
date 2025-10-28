// components/CalificacionesDialog.tsx

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from "@/components/ui/Loading";
import { Award, Users, TrendingUp, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCalificaciones } from "@/hooks/calificaciones/useCalificaciones";

interface CalificacionesDialogProps {
  idClase: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CalificacionesDialog({
  idClase,
  open,
  onOpenChange,
}: CalificacionesDialogProps) {
  const { getCalificacionesByClase } = useCalificaciones();

  const { data: response, isLoading } = getCalificacionesByClase(idClase || 0);

  if (!idClase) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="min-w-3/4 max-w-[95vw] max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Calificaciones - {response?.data.clase.asignatura}
          </DialogTitle>
          <DialogDescription>
            {response?.data.clase.semestre}° {response?.data.clase.grupo} -{" "}
            {response?.data.clase.especialidad || "Tronco Común"} - Ciclo{" "}
            {response?.data.clase.anio}
            {response?.data.clase.docente && (
              <span className="block mt-1">
                Docente: {response.data.clase.docente}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8">
            <Loading message="Cargando calificaciones..." />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Alumnos
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {response?.data.estadisticas.totalAlumnos}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Aprobados
                    </CardTitle>
                    <Award className="h-4 w-4 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">
                    {response?.data.estadisticas.aprobados}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Reprobados
                    </CardTitle>
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600">
                    {response?.data.estadisticas.reprobados}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Promedio Grupal
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-blue-600">
                    {response?.data.estadisticas.promedioGrupal}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tabla de calificaciones */}
            <ScrollArea className="h-[400px] rounded-md border">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead className="text-center">NIA</TableHead>
                    <TableHead>Alumno</TableHead>
                    <TableHead className="text-center">Especialidad</TableHead>
                    <TableHead className="text-center">1er Momento</TableHead>
                    <TableHead className="text-center">2do Momento</TableHead>
                    <TableHead className="text-center">3er Momento</TableHead>
                    <TableHead className="text-center">Promedio</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {response?.data.calificaciones.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center text-muted-foreground py-8"
                      >
                        No hay alumnos inscritos en esta clase
                      </TableCell>
                    </TableRow>
                  ) : (
                    response?.data.calificaciones.map((cal) => (
                      <TableRow key={cal.idCalificacion}>
                        <TableCell className="font-mono text-sm text-center">
                          {cal.nia}
                        </TableCell>
                        <TableCell className="font-medium">
                          {cal.nombreCompleto}
                        </TableCell>
                        <TableCell className="text-center text-sm">
                          {cal.especialidad || "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={cal.momento1 >= 60 ? "default" : "destructive"}
                          >
                            {cal.momento1}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={cal.momento2 >= 60 ? "default" : "destructive"}
                          >
                            {cal.momento2}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={cal.momento3 >= 60 ? "default" : "destructive"}
                          >
                            {cal.momento3}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={cal.promedio >= 60 ? "default" : "destructive"}
                            className="font-bold"
                          >
                            {cal.promedio}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              cal.estado === "APROBADO" ? "default" : "destructive"
                            }
                          >
                            {cal.estado}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>

            {/* Promedios por momento */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    Promedio 1er Momento
                  </p>
                  <p className="text-xl font-bold">
                    {response?.data.estadisticas.momento1Promedio}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    Promedio 2do Momento
                  </p>
                  <p className="text-xl font-bold">
                    {response?.data.estadisticas.momento2Promedio}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    Promedio 3er Momento
                  </p>
                  <p className="text-xl font-bold">
                    {response?.data.estadisticas.momento3Promedio}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}