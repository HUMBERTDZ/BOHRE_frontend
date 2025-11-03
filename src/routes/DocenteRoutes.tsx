import { ProtectedRoute } from "@/components/auth/ProtectedRoutes";
import { DocenteMateriasPage } from "@/pages/docentes/DocenteMateriasPage";
import { Route, Routes } from "react-router";

export const DocenteRoutes = () => {
  const rol = "DOCENTE";
  return (
    <Routes>
      <Route
        index
        element={
          <ProtectedRoute allowedRoles={[rol]}>
            <DocenteMateriasPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
