// src/components/ProtectedRoute.tsx

import { useAuthStore, type UserRole } from "@/store/AuthStore";
import { Navigate } from "react-router";


interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export const ProtectedRoute = ({ 
  children, 
  allowedRoles,
  redirectTo = '/auth' 
}: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si se especificaron roles permitidos, validar
  if (allowedRoles && user) {
    const hasPermission = allowedRoles.includes(user.rol);
    
    if (!hasPermission) {
      // Redirigir a página de sin permisos
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

// HOC alternativo para proteger componentes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles?: UserRole[]
) => {
  return (props: P) => (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <Component {...props} />
    </ProtectedRoute>
  );
};