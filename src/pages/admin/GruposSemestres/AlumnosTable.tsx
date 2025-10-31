import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { Alumno } from "@/api/gruposSemestres/interfaces/gruposSemestresExtraInterface";
import { ButtonLink } from "@/components/ui/my/ButtonLink";

interface AlumnosTableProps {
  alumnos: Alumno[];
}

export function AlumnosTable({ alumnos }: AlumnosTableProps) {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Alumnos del semestre y grupo
        </CardTitle>
      </CardHeader>
      <div className="p-2">
        <div className="overflow-x-auto">
          <Table className="text-center">
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="font-semibold text-center">NIA</TableHead>
                <TableHead className="font-semibold text-center">
                  Nombre
                </TableHead>
                <TableHead className="font-semibold text-center">
                  Apellido Paterno
                </TableHead>
                <TableHead className="font-semibold text-center">
                  Apellido Materno
                </TableHead>
                <TableHead className="font-semibold text-center">
                  Especialidad
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alumnos.length === 0 || !alumnos[0].id ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-8"
                  >
                    No hay alumnos registrados en este grupo
                  </TableCell>
                </TableRow>
              ) : (
                alumnos.map((alumno) => {
                  if (alumno.id === undefined) return null;

                  return (
                    <TableRow
                      key={alumno.id}
                      className="border-border/50 hover:bg-accent/50 transition-colors"
                    >
                      <TableCell className="font-mono text-sm">
                        {alumno.nia}
                      </TableCell>
                      <TableCell className="font-medium">
                        {alumno.nombre}
                      </TableCell>
                      <TableCell>{alumno.apellidoPaterno}</TableCell>
                      <TableCell>{alumno.apellidoMaterno}</TableCell>
                      <TableCell>{alumno.especialidad}</TableCell>
                      <TableCell>
                          <ButtonLink url={`/usuarios/alumno/${alumno.id}`} text="Ver perfil" button={{ variant: "outline", size: "sm" }} />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
