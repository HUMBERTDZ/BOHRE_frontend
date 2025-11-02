import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import {
  ChevronDown,
  ChevronUp,
  School,
  User2,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../ui/collapsible";
import { NavLink } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import React from "react";
import { MenuItemsByRol } from "@/utils/MenuItemsByRol";
import { useAuth } from "@/hooks/useAuth";

export const AdminSidebar = () => {
  // Menu items.
  const items = MenuItemsByRol().admin;
  const { user, logout } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <School /> BOHRE
              <ChevronDown className="ml-auto" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Módulos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <React.Fragment key={item.title}>
                  {item.submenus ? (
                    // Item con submenú
                    <Collapsible className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton>
                            <item.icon className="w-5 h-5" />
                            <span>{item.title}</span>
                            <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.submenus.map((submenu) => (
                              <SidebarMenuSubItem key={submenu.title}>
                                <NavLink to={submenu.url} end>
                                  {({ isActive }) => (
                                    <SidebarMenuSubButton
                                      className={
                                        isActive
                                          ? " rounded-l-xs border-l-4 border-l-primary bg-red-50 hover:bg-red-50"
                                          : ""
                                      }
                                    >
                                      <span>{submenu.title}</span>
                                    </SidebarMenuSubButton>
                                  )}
                                </NavLink>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    // Item sin submenú
                    <SidebarMenuItem>
                      <NavLink to={item.url}>
                        {({ isActive }) => (
                          <SidebarMenuButton
                            className={
                              isActive
                                ? "rounded-l-xs border-l-4 border-l-primary bg-red-100"
                                : ""
                            }
                          >
                            <item.icon className="w-5 h-5" />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        )}
                      </NavLink>
                    </SidebarMenuItem>
                  )}
                </React.Fragment>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {user?.nombre} {user?.apellidoPaterno} {user?.apellidoMaterno.charAt(0)}.
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem className="focus:bg-red-300" onClick={logout}>
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
