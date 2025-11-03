import type { Materia } from "@/api/docentesMaterias/interfaces/docentesMateriasInterfaces";
import { Button } from "../button";
import { Eye } from "lucide-react";

interface MateriaCardProps {
  materia: Materia;
  onVerClase: (idClase: number) => void;
}

export const MateriaCard: React.FC<MateriaCardProps> = ({ materia, onVerClase }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div>
      <p className="font-medium text-gray-900">{materia.nombreAsignatura}</p>
      <p className="text-sm text-gray-500">
        {materia.totalAlumnos}{" "}
        {materia.totalAlumnos === 1 ? "alumno" : "alumnos"}
      </p>
    </div>
    <Button
      onClick={() => onVerClase(materia.idClase)}
      variant="outline"
      size="sm"
    >
      <Eye /> Ver Clase
    </Button>
  </div>
);