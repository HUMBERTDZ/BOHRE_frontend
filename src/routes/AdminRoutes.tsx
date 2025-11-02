import { AdminLayout } from "@/layout/AdminLayout";
import { AsignaturasPage } from "@/pages/admin/Asignaturas/AsignaturasPage";
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
import { ProtectedRoute } from "@/components/auth/ProtectedRoutes";
import { Home } from "@/pages/admin/Home";

/**
 *
 * Unicamente rutas de administrador
 */

export const AdminRoutes = () => {
  const rol = 'ADMIN';
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route
          path="inicio"
          element={
            <ProtectedRoute allowedRoles={[rol]}>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route path="usuarios">
          <Route
            index
            element={
              <ProtectedRoute allowedRoles={[rol]}>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path=":rol/:idPerson"
            element={
              <ProtectedRoute allowedRoles={[rol]}>
                <UserDetailsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="asignaturas">
          <Route
            index
            element={
              <ProtectedRoute allowedRoles={[rol]}>
                <AsignaturasPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="grupos_semestres">
          <Route
            index
            element={
              <ProtectedRoute allowedRoles={[rol]}>
                <GruposSemestresPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="detalles/:idGrupoSemestre"
            element={
              <ProtectedRoute allowedRoles={[rol]}>
                <GruposSemestresDetailsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="especialidades">
          <Route
            index
            element={
              <ProtectedRoute allowedRoles={[rol]}>
                <EspecialidadesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="asignaturas/:idEspecialidad"
            element={
              <ProtectedRoute allowedRoles={[rol]}>
                <AsignaturasEspecialidades />
              </ProtectedRoute>
            }
          />
          <Route
            path="detalles/:idEspecialidad"
            element={
              <ProtectedRoute allowedRoles={[rol]}>
                <EspecialidadesDetailsPage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="periodos">
          <Route
            index
            element={
              <ProtectedRoute allowedRoles={[rol]}>
                <PeriodosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="generaciones/:idGeneracion"
            element={
              <ProtectedRoute allowedRoles={[rol]}>
                <GeneracionesDetailsPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
};
