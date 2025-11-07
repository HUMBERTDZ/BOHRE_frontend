import type { ColumnDef, Column, SortDirection } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp, Pen, Trash, } from "lucide-react";
import { DropdownMenuItem, } from "../ui/dropdown-menu";
import type { Asignatura } from "@/api/asignaturas/interfaces/AsignaturasInterfaces";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ActionOptionsMenu } from "../ui/my/ActionOptionsMenu";

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
  onDelete: (asignatura: Asignatura) => void;
  onFetch: (asignaturaId: number) => void;
  //onPrefetch: (asignaturaId: number) => void;
}

// Función que crea las columnas (sin hooks)
export const ColumnsTableAsignaturas = ({ onFetch, onDelete }: props): ColumnDef<Asignatura>[] => {
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
      accessorKey: "idAsignatura",
      header: "ID",
      cell: ({ row }) => {
        const id = row.getValue("idAsignatura") as string;
        return <span className="font-medium">{id}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "nombre",
      header: ({ column }) => <SortButton column={column} text="NOMBRE" />,
      cell: ({ row }) => {
        const texto = row.getValue("nombre") as string;
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="block max-w-[180px] truncate cursor-help text-center mx-auto">
                {texto}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs break-words">{texto}</p>
            </TooltipContent>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: "tipo",
      header: ({ column }) => {
        return <SortButton column={column} text="TIPO" />;
      },
    },
    {
      accessorKey: "semestre",
      header: ({ column }) => {
        return <SortButton column={column} text="SEMESTRE" />;
      },
    },
    {
      accessorKey: "especialidad",
      header: ({ column }) => {
        return <SortButton column={column} text="ESPECIALIDAD" />;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const { original } = row;
        return (
          <ActionOptionsMenu>
              <DropdownMenuItem
                onClick={() => { onFetch(original.idAsignatura); }}
                className="focus:bg-green-100 focus:text-green-500 text-green-500"
              >
                <Pen className="text-current" />
                Actualizar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { onDelete(original); }} className="focus:bg-red-100 focus:text-red-500 text-red-500">
                <Trash className="text-current" />
                Eliminar
              </DropdownMenuItem>
            </ActionOptionsMenu>
        );
      },
    },
  ];
};
