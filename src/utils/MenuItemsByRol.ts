import { AArrowUp, CalendarRange, Home, LibraryBig, Users } from "lucide-react";

const admin = [
  { title: "Inicio", url: "inicio", icon: Home },
  {
    title: "Usuarios",
    icon: Users,
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
      { title: "Grupos y semestres", url: "grupos_semestres" },
      { title: "Grupos", url: "grupos_semestres/grupos" },
      { title: "Semestres", url: "grupos_semestres/semestres" },
    ],
  },
  {
    title: "Periodos",
    icon: CalendarRange,
    submenus: [
      { title: "Ciclos escolares", url: "ciclos" },
      { title: "Generaciones", url: "generaciones" },
    ],
  },
];

export const MenuItemsByRol = () => {
  return {
    admin,
  };
};
