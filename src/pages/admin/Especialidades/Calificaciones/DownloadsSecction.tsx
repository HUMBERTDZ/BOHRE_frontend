import type {
  ClasesPorSemestreGrupo,
  Especialidad,
} from "@/api/calificaciones/interfaces/CalificacionesByEspecialidad";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEspecialidades } from "@/hooks/especialidades/useEspecialidades";
import { FileDown } from "lucide-react";

interface Props {
  clasesPorSemestreGrupo: ClasesPorSemestreGrupo[];
  especialidad: Especialidad;
}
export const DownloadsSecction = ({
  clasesPorSemestreGrupo,
  especialidad,
}: Props) => {
  const uniqueSemestres = Array.from(
    new Set(clasesPorSemestreGrupo.map((clase) => clase.semestre))
  );

  const { getExcelCalificacionesEspecialidad } = useEspecialidades();

  const handleDownload = (semestre: number) => {
    getExcelCalificacionesEspecialidad(especialidad.id, semestre);
  };

  return (
    <Card className="flex gap-2">
      <CardHeader>
        <CardTitle>Descargar calificaciones de {especialidad.nombre}</CardTitle>
        <CardDescription>
          Seleccione el semestre para descargar las calificaciones, se incluyen los alumnos de todos los grupos.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2 py-2">
        {uniqueSemestres.map((semestre) => (
          <Button key={semestre} variant={"outline"} size={"sm"} onClick={() => handleDownload(semestre)}>
            <FileDown className="mr-2" />
            {semestre}° Semestres
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};
