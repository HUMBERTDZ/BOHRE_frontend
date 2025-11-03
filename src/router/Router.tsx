import { AuthPage } from "@/auth/AuthPage";
import Unauthorized from "@/pages/Unauthorized";
import { SystemRoutes } from "@/routes/SystemRoutes";
import type { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

export const Router: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/*" element={<SystemRoutes />} />
        {/* <Route path="/*" element={<Navigate to="/auth" />} /> */}
      </Routes>
    </BrowserRouter>
  );
};
