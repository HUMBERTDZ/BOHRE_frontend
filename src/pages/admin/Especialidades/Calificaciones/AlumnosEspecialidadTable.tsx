// components/AlumnosEspecialidadTable.tsx

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AlumnoEspecialidad } from "@/api/calificaciones/interfaces/CalificacionesByEspecialidad";
import { ButtonLink } from "@/components/ui/my/ButtonLink";


interface AlumnosEspecialidadTableProps {
  alumnosPorSemestreGrupo: Record<string, AlumnoEspecialidad[]>;
}

export function AlumnosEspecialidadTable({
  alumnosPorSemestreGrupo,
}: AlumnosEspecialidadTableProps) {
  const grupos = Object.keys(alumnosPorSemestreGrupo);

  if (grupos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alumnos Inscritos</CardTitle>
        </CardHeader>
        <div className="p-6 text-center text-muted-foreground">
          No hay alumnos inscritos en esta especialidad
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {grupos.map((key) => {
        const [semestre, grupo] = key.split("-");
        const alumnos = alumnosPorSemestreGrupo[key];

        return (
          <Card key={key}>
            <CardHeader>
              <CardTitle>
                {semestre}° Semestre - Grupo {grupo}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {alumnos.length} alumno(s) inscrito(s)
              </p>
            </CardHeader>
            <div className="p-2">
              <div className="overflow-x-auto">
                <Table className="text-center">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border/50">
                      <TableHead className="font-semibold text-center">
                        NIA
                      </TableHead>
                      <TableHead className="font-semibold text-center">
                        Nombre Completo
                      </TableHead>
                      <TableHead className="font-semibold text-center">
                        Inscrito desde
                      </TableHead>
                      <TableHead className="font-semibold text-center">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alumnos.map((alumno) => (
                      <TableRow
                        key={alumno.idAlumno}
                        className="border-border/50 hover:bg-accent/50 transition-colors"
                      >
                        <TableCell className="font-mono text-sm">
                          {alumno.nia}
                        </TableCell>
                        <TableCell className="font-medium">
                          {alumno.nombreCompleto}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {alumno.semestreInicio}° Semestre
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <ButtonLink url={`/usuarios/alumno/${alumno.idAlumno}`} text="Ver perfil" button={{ variant: "outline", size: "sm" }} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}