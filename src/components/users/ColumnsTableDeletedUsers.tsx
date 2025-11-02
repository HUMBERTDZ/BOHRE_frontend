import type { User } from "@/api/users/interfaces/UserInterface";
import type { ColumnDef, Column, SortDirection } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp, Trash, Undo } from "lucide-react";
import { DropdownMenuItem, } from "../ui/dropdown-menu";
import { ActionOptionsMenu } from "../ui/my/ActionOptionsmenu";
import { ButtonLink } from "../ui/my/ButtonLink";

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
export const ColumnsTableDeletedUsers = ( onDeleteForce: (usuario: User) => void, onRecover: (usuario: User) => void ): ColumnDef<User>[] => {
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
          <ActionOptionsMenu>
              <DropdownMenuItem onClick={() => onRecover(original)} className="focus:bg-green-100 focus:text-green-500 text-green-500 ">
                <Undo className="text-current" />
                Recuperar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDeleteForce(original)} className="focus:bg-red-100 focus:text-red-500 text-red-500 " >
                <Trash className="text-current" />
                 Eliminar
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <ButtonLink url={`${original.rol.toLowerCase()}/${original.id}`} text="Ver detalles" />
              </DropdownMenuItem>
          </ActionOptionsMenu>
        );
      },
    },
  ];
};
