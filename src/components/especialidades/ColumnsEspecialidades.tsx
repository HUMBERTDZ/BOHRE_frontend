import type { ColumnDef, Column, SortDirection } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp, Eye, MoreHorizontal, Pen, } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,} from "../ui/dropdown-menu";
import { Link } from "react-router";
import type { Especialidad } from "@/api/especialidades/interfaces/EspecialidadesInterfaces";


// pequeño componente para definir el icono
const SortedIcon = ({ isSorted }: { isSorted: false | SortDirection }) => {
  if (isSorted === "asc") {
    return <ChevronUp className="ml-2 h-4 w-4" />;
  } else if (isSorted === "desc") {
    return <ChevronDown className="ml-2 h-4 w-4" />;
  }

  return null;
};

// pequeño componente para reutilizar el button
const SortButton = ({
  column,
  text,
}: {
  column: Column<any, any>;
  text: string;
}) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {text}
      <SortedIcon isSorted={column.getIsSorted()} />
    </Button>
  );
};

interface ColumnsEspecialidadesProps {
  setEspecialidadToUpdate: (especialidad: Especialidad | null) => void;
}


// Función que crea las columnas (sin hooks)
export const ColumnsEspecialidades = ({ setEspecialidadToUpdate }: ColumnsEspecialidadesProps): ColumnDef<Especialidad>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Seleccionar todo"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Seleccionar fila"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "Id",
      cell: ({ row }) => {
        const id = row.getValue("id") as string;
        return <span className="font-medium">{id}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "nombre",
      header: ({ column }) => {
        return <SortButton column={column} text="NOMBRE" />;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const { original } = row;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem className="focus:bg-green-100 focus:text-green-500 text-green-500" onClick={() => setEspecialidadToUpdate(original)}>
                <Pen className="text-current" /> Actualizar
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-green-100 focus:text-green-500 text-green-500">
                <Link to={`detalles/${original.id}`} className="flex gap-2 items-center">
                  <Eye className="text-current" /> Ver detalles
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
