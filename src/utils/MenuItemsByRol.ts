import { AArrowUp, CalendarRange, Handshake, Home, LibraryBig, UsersRound } from "lucide-react";

const admin = [
  { title: "Inicio", url: "inicio", icon: Home },
  {
    title: "Usuarios",
    icon: UsersRound,
    submenus: [
      { title: "Todos", url: "usuarios" },
    /*   { title: "Alumnos", url: "usuarios/alumnos" },
      { title: "Docentes", url: "usuarios/docentes" },
      { title: "Administradores", url: "usuarios/administradores" }, */
    ],
  },
  {
    title: "Asignaturas",
    url: "asignaturas",
    icon: LibraryBig,
    submenus: [
      { title: "Todas", url: "asignaturas" },
      /* { title: "Tronco común", url: "asignaturas/comun" },
      { title: "Especialidad", url: "asignaturas/especialidad" }, */
    ],
  },
  {
    title: "Grupos y Semestres",
    icon: AArrowUp,
    submenus: [
      { title: "Todos", url: "grupos_semestres" },
    ],
  },
  {
    title: "Especialidades",
    icon: Handshake,
    submenus: [
      { title: "Todas", url: "especialidades" },
    ],
  },
  {
    title: "Periodos",
    icon: CalendarRange,
    submenus: [
      { title: "Administración", url: "generaciones" },
    ],
  },
];

export const MenuItemsByRol = () => {
  return {
    admin,
  };
};
