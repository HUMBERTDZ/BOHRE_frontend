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
import type { Asignatura } from "@/api/gruposSemestres/interfaces/gruposSemestresExtraInterface";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AsignaturasTableProps {
  asignaturas: Asignatura[];
}

export function AsignaturasTable({ asignaturas }: AsignaturasTableProps) {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Asignaturas del semestre
        </CardTitle>
      </CardHeader>
      <div className="p-2">
        <div className="overflow-x-auto">
          <Table className="text-center">
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="font-semibold text-center">ID</TableHead>
                <TableHead className="font-semibold text-center">Nombre</TableHead>
                <TableHead className="font-semibold text-center">Tipo</TableHead>
                <TableHead className="font-semibold text-center">Semestre</TableHead>
                <TableHead className="font-semibold text-center">Periodo</TableHead>
                <TableHead className="font-semibold text-center">Especialidad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {asignaturas.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-8"
                  >
                    No hay asignaturas registradas en este grupo
                  </TableCell>
                </TableRow>
              ) : (
                asignaturas.map((asignatura) => (
                  <TableRow
                    key={asignatura.idAsignatura}
                    className="border-border/50 hover:bg-accent/50 transition-colors"
                  >
                    <TableCell className="font-mono text-sm">
                      {asignatura.idAsignatura}
                    </TableCell>
                    <TableCell className="font-medium">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="block max-w-[180px] truncate cursor-help text-center mx-auto">
                            {asignatura.nombre}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs break-words">
                            {" "}
                            {asignatura.nombre}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{asignatura.tipo}</Badge>
                    </TableCell>
                    <TableCell>{asignatura.semestre}</TableCell>
                    <TableCell>{asignatura.periodo}</TableCell>
                    <TableCell>{asignatura.especialidad}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
