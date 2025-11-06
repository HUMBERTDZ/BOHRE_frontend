import { Route, Routes } from "react-router"
import { AdminRoutes } from "./AdminRoutes"
import { DocenteRoutes } from "./DocenteRoutes"
import { AlumnoRoutes } from "./AlumnoRoutes"

export const SystemRoutes = () => {
  return (
    <Routes>
        <Route path="/*" element={<AdminRoutes />} />
        <Route  path="/docencia/*" element={<DocenteRoutes />} />
        <Route  path="/mis-clases/*" element={<AlumnoRoutes />} />
    </Routes>
  )
}
