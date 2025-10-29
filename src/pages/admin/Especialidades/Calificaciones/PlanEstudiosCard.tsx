// components/PlanEstudiosCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AsignaturaPlan } from "@/api/calificaciones/interfaces/CalificacionesByEspecialidad";

interface PlanEstudiosCardProps {
  planEstudios: Record<string, AsignaturaPlan[]>;
}

export function PlanEstudiosCard({ planEstudios }: PlanEstudiosCardProps) {
  const semestres = Object.keys(planEstudios).sort((a, b) => Number(a) - Number(b));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan de Estudios de la Especialidad</CardTitle>
        <p className="text-sm text-muted-foreground">
          Materias que corresponden a esta especialidad por semestre
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {semestres.map((semestre) => (
            <div key={semestre} className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">
                {semestre}° Semestre
                <Badge variant="secondary" className="ml-2">
                  {planEstudios[semestre].length} materia(s)
                </Badge>
              </h3>
              <ul className="space-y-2">
                {planEstudios[semestre].map((asignatura) => (
                  <li
                    key={asignatura.idAsignatura}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Badge variant="outline" className="font-mono">
                      {asignatura.idAsignatura}
                    </Badge>
                    <span>{asignatura.nombreAsignatura}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}