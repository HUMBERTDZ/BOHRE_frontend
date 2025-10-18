import type { User } from "@/api/users/interfaces/UserInterface";
import type { ColumnDef, Column, SortDirection } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp, Eye, MoreHorizontal, Trash, UserPen } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, } from "../ui/dropdown-menu";
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
const SortButton = ({ column, text, }: { column: Column<any, any>; text: string; }) => {
  return (
    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} >
      {text}
      <SortedIcon isSorted={column.getIsSorted()} />
    </Button>
  );
};


interface userToFetch { rol: string; personId: number };
interface props {
  onDelete: (usuario: User) => void;
  onFetch: (user: userToFetch) => void;
  onUserPrefetch: (rol: string, personId: number) => void;
}

// Función que crea las columnas (sin hooks)
export const ColumnsTableUsers = ( { onDelete, onFetch, onUserPrefetch }: props): ColumnDef<User>[] => {
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
              <DropdownMenuItem onClick={() => onFetch({rol: original.rol.toLowerCase(), personId: original.id})} className="focus:bg-green-100 focus:text-green-500 text-green-500">
                <UserPen className="text-current" />
                Actualizar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(original)}  className="focus:bg-red-100 focus:text-red-500 text-red-500">
                <Trash className="text-current" />
                Eliminar
              </DropdownMenuItem>
              <DropdownMenuItem onMouseEnter={() => onUserPrefetch(original.rol.toLowerCase(), original.id)} asChild>
                <Link to={`${original.rol.toLowerCase()}/${original.id}`}>
                  <Eye />
                  Ver detalles
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};