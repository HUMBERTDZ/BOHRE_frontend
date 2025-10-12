import { AuthPage } from "@/auth/AuthPage";
import { Home } from "@/Home";
import type { FC } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

export const Router: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        <Route path="/" element={<Home />} />

        <Route path="/*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
};
