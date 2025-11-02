// src/providers/AuthProvider.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { validateSession, isAuthenticated } = useAuth();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validate = async () => {
      if (isAuthenticated) {
        await validateSession();
      }
      setIsValidating(false);
    };

    validate();
  }, []);

  // Mostrar loading mientras valida el token
  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Validando sesión...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};