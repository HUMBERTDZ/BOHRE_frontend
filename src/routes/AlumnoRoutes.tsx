import { ProtectedRoute } from "@/components/auth/ProtectedRoutes";
import { AlumnoPage } from "@/pages/alumnos/AlumnoPage";
import { Route, Routes } from "react-router";

export const AlumnoRoutes = () => {
  const rol = "ALUMNO";
  return (
    <Routes>
      <Route
        index
        element={
          <ProtectedRoute allowedRoles={[rol]}>
            <AlumnoPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
