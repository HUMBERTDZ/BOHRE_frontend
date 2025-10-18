import { AdminLayout } from "@/layout/AdminLayout";
import { AsignaturasPage } from "@/pages/admin/AsignaturasPage";
import { UserDetailsPage } from "@/pages/admin/UserDetailsPage";
import { UsersPage } from "@/pages/admin/UsersPage";
import { Route, Routes } from "react-router";

/**
 * 
 * Unicamente rutas de administrador
 */

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route path="inicio" element={<h1>inicio</h1>} />

        <Route path="usuarios">
          <Route index element={<UsersPage />} />
          <Route path=":rol/:idPerson" element={<UserDetailsPage />} />
          {/* <Route path="alumnos" element={<h1>Hola alumnos usuarios</h1>} />
          <Route path="docentes" element={<h1>Hola docentes usuarios</h1>} />
          <Route path="administradores" element={<h1>Hola administradores usuarios</h1>} 
          />
          */}
        </Route>

        <Route path="asignaturas">
          <Route index element={<AsignaturasPage />} />
          <Route path="comun" element={<h1>comun</h1>} />
          <Route path="especialidad" element={<h1>especialidad</h1>} />
        </Route>

        <Route path="grupos_semestres">
          <Route index element={<h1>Hola prupos y semestres</h1>} />
          <Route path="grupos" element={<h1>grupos</h1>} />
          <Route path="semestres" element={<h1>semestres</h1>} />
        </Route>

        <Route path="ciclos" element={<h1>ciclos</h1>} />
        <Route path="generaciones" element={<h1>Generaciones</h1>} />
      </Route>
    </Routes>
  );
};
