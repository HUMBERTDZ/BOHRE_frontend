import type { ColumnDef, Column, SortDirection } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp, Eye, MoreHorizontal, } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,} from "../ui/dropdown-menu";
import type { Datum } from "@/api/gruposSemestres/interfaces/gruposSemestresInterfaces";
import { Link } from "react-router";


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


interface props {
  // onDelete: (id: Asignatura) => void;
  onPrefetch: (id: number) => void;
}

// Función que crea las columnas (sin hooks)
export const ColumnsTableGruposSemestres = ({ onPrefetch }: props): ColumnDef<Datum>[] => {
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
      accessorKey: "idGrupoSemestre",
      header: "ID",
      cell: ({ row }) => {
        const id = row.getValue("idGrupoSemestre") as string;
        return <span className="font-medium">{id}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "semestre",
      header: ({ column }) => {
        return <SortButton column={column} text="SEMESTRE" />;
      },
    },
    {
      accessorKey: "grupo",
      header: ({ column }) => {
        return <SortButton column={column} text="GRUPO" />;
      },
    },
    {
      accessorKey: "periodoSemestre",
      header: ({ column }) => {
        return <SortButton column={column} text="PERIODO SEMESTRE" />;
      },
    },
    {
      accessorKey: "cicloEscolar",
      header: ({ column }) => {
        return <SortButton column={column} text="CICLO ESCOLAR" />;
      },
    },
    {
      accessorKey: "numeroAlumnos",
      header: ({ column }) => {
        return <SortButton column={column} text="NÚMERO ALUMNOS" />;
      },
    },
    {
      accessorKey: "numeroAsignaturas",
      header: ({ column }) => {
        return <SortButton column={column} text="ASIGNATURAS COMUNES" />;
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
              <DropdownMenuItem onMouseEnter={() => { onPrefetch(original.idGrupoSemestre) }} className="focus:bg-cyan-100 focus:text-cyan-500 text-cyan-500">
                <Link to={`detalles/${original.idGrupoSemestre}`} className="flex gap-2 items-center">
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
