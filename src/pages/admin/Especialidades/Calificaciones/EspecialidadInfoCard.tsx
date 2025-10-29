// components/EspecialidadInfoCard.tsx

import type { EstadisticasEspecialidad, InfoEspecialidad } from "@/api/calificaciones/interfaces/CalificacionesByEspecialidad";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, GraduationCap, Calendar } from "lucide-react";

interface EspecialidadInfoCardProps {
  especialidad: InfoEspecialidad;
  estadisticas: EstadisticasEspecialidad;
  anio: number;
}

export function EspecialidadInfoCard({
  especialidad,
  estadisticas,
  anio,
}: EspecialidadInfoCardProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Especialidad: {especialidad.nombre}
          </CardTitle>
          <p className="text-muted-foreground">Ciclo escolar {anio}</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Grupos Activos</p>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{estadisticas.semestreGrupos}</p>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total Alumnos</p>
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {estadisticas.totalAlumnos}
            </p>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total Clases</p>
              <BookOpen className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {estadisticas.totalClases}
            </p>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Sin Docente</p>
              <Calendar className="h-4 w-4 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-orange-600">
              {estadisticas.clasesSinDocente}
            </p>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}