import { Home } from "@/Home";
import { AdminLayout } from "@/layout/AdminLayout";
import { AsignaturasPage } from "@/pages/admin/AsignaturasPage";
import { AsignaturasEspecialidades } from "@/pages/admin/Especialidades/AsignaturasEspecialidades";
import { EspecialidadesDetailsPage } from "@/pages/admin/Especialidades/Calificaciones/EspecialidadesDetailsPage";
import { EspecialidadesPage } from "@/pages/admin/Especialidades/EspecialidadesPage";
import { GruposSemestresDetailsPage } from "@/pages/admin/GruposSemestres/GruposSemestresDetailsPage";
import { GruposSemestresPage } from "@/pages/admin/GruposSemestres/GruposSemestresPage";
import { GeneracionesDetailsPage } from "@/pages/admin/Periodos/generaciones/GeneracionesDetailsPage";
import { PeriodosPage } from "@/pages/admin/Periodos/PeriodosPage";
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
        <Route path="inicio" element={<Home />} />

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
        <Route path="periodos" >
          <Route index element={<PeriodosPage />} />
          <Route path="generaciones/:idGeneracion" element={<GeneracionesDetailsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
