import { Route, Routes } from "react-router"
import { AdminRoutes } from "./AdminRoutes"
import { DocenteRoutes } from "./DocenteRoutes"

export const SystemRoutes = () => {
  return (
    <Routes>
        <Route path="/*" element={<AdminRoutes />} />
        <Route  path="/docencia/*" element={<DocenteRoutes />} />
    </Routes>
  )
}
