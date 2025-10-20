import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { General } from "@/api/gruposSemestres/interfaces/gruposSemestresExtraInterface"

interface GrupoInfoCardProps {
  data: General
}

export function GrupoInfoCard({ data }: GrupoInfoCardProps) {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-semibold text-balance">Grupo {data.grupo}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">ID: {data.idGrupoSemestre}</p>
          </div>
          <Badge variant="secondary" className="text-sm">
            Semestre {data.semestre}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Periodo</p>
            <p className="text-base font-medium">{data.periodoSemestre}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total de alumnos</p>
            <p className="text-2xl font-semibold text-primary">{data.alumnos.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
