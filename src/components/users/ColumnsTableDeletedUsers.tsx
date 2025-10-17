import type { Usuario } from "@/api/users/interfaces/UserInterface";
import type { ColumnDef, Column, SortDirection } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, } from "../ui/dropdown-menu";

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
const SortButton = ({ column, text, }: { column: Column<any, any>; text: string; }) => {
  return (
    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} >
      {text}
      <SortedIcon isSorted={column.getIsSorted()} />
    </Button>
  );
};

// Función que crea las columnas (sin hooks)
export const createColumns = ( onDeleteForce: (usuario: Usuario) => void, onRecover: (usuario: Usuario) => void ): ColumnDef<Usuario>[] => {
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
      header: "ID",
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
      accessorKey: "apellidoPaterno",
      header: ({ column }) => {
        return <SortButton column={column} text="APELLIDO PATERNO" />;
      },
    },
    {
      accessorKey: "apellidoMaterno",
      header: ({ column }) => {
        return <SortButton column={column} text="APELLIDO MATERNO" />;
      },
    },
    {
      accessorKey: "curp",
      header: ({ column }) => {
        return <SortButton column={column} text="CURP" />;
      },
    },
    {
      accessorKey: "sexo",
      header: ({ column }) => {
        return <SortButton column={column} text="SEXO" />;
      },
    },
    {
      accessorKey: "nss",
      header: ({ column }) => {
        return <SortButton column={column} text="NSS" />;
      },
    },
    {
      accessorKey: "rol",
      header: ({ column }) => {
        return <SortButton column={column} text="ROL" />;
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
              <DropdownMenuItem onClick={() => onRecover(original)} >
                Recuperar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDeleteForce(original)} >
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
