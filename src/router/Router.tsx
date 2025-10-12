import { AuthPage } from "@/auth/AuthPage";
import { AdminRoutes } from "@/routes/AdminRoutes";
import type { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

export const Router: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        <Route path="/*" element={<AdminRoutes />} />
        {/* <Route path="/*" element={<Navigate to="/auth" />} /> */}
      </Routes>
    </BrowserRouter>
  );
};
