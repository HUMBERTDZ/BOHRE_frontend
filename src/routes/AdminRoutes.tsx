import { AdminLayout } from "@/layout/AdminLayout";
import { AsignaturasPage } from "@/pages/admin/AsignaturasPage";
import { AsignaturasEspecialidades } from "@/pages/admin/Especialidades/AsignaturasEspecialidades";
import { EspecialidadesDetailsPage } from "@/pages/admin/Especialidades/Calificaciones/EspecialidadesDetailsPage";
import { EspecialidadesPage } from "@/pages/admin/Especialidades/EspecialidadesPage";
import { GruposSemestresDetailsPage } from "@/pages/admin/GruposSemestres/GruposSemestresDetailsPage";
import { GruposSemestresPage } from "@/pages/admin/GruposSemestres/GruposSemestresPage";
import { UserDetailsPage } from "@/pages/admin/Users/UserDetailsPage";
import { UsersPage } from "@/pages/admin/Users/UsersPage";
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
          {/* <Route path="comun" element={<h1>comun</h1>} />
          <Route path="especialidad" element={<h1>especialidad</h1>} /> */}
        </Route>

        <Route path="grupos_semestres">
          <Route index element={< GruposSemestresPage />} />
          {/* <Route path="grupos" element={<h1>grupos</h1>} />
          <Route path="semestres" element={<h1>semestres</h1>} /> */}
          <Route path="detalles/:idGrupoSemestre" element={<GruposSemestresDetailsPage />} />
        </Route>

        <Route path="especialidades">
          <Route index element={<EspecialidadesPage />} />
          <Route path="asignaturas/:idEspecialidad" element={<AsignaturasEspecialidades />} />
          <Route path="detalles/:idEspecialidad" element={<EspecialidadesDetailsPage />} />
        </Route>
        <Route path="generaciones" element={<h1>Generaciones</h1>} />
        <Route path="generaciones" element={<h1>Generaciones</h1>} />
      </Route>
    </Routes>
  );
};
