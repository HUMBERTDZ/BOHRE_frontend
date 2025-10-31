import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger, } from "../dropdown-menu";
import { Button } from "../button";
import { MoreHorizontal } from "lucide-react";

interface props {
  children?: React.ReactNode;
}

export const ActionOptionsMenu = ({ children }: props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
