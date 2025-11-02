import type { Especialidad } from "@/api/calificaciones/interfaces/CalificacionesByEspecialidad";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface Props {
  onOpen: (especialidad: {id: number; nombre: string}) => void;
  especialidades: Especialidad[];
}

export const AsignarEspecialidad = ({ onOpen, especialidades }: Props) => {
  return (
    <Select value={"sin-asignar"} onValueChange={(value) => onOpen( value === "sin-asignar" ? null : JSON.parse(value) )}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Asignar docente" />
        {false && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="sin-asignar">
          <span className="text-muted-foreground">Sin asignar</span>
        </SelectItem>
        {especialidades.map(({id, nombre}) => (
          <SelectItem key={id} value={JSON.stringify({id, nombre})}>
            {nombre}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
