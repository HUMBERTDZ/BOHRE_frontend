// src/pages/Unauthorized.tsx
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">403</h1>
        <h2 className="text-2xl font-semibold mb-4">Acceso Denegado</h2>
        <p className="text-gray-600 mb-6">
          No tienes permisos para acceder a este recurso.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Tu rol actual: <strong>{user?.rol}</strong>
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Volver
          </button>
          <button
            onClick={() => logout()}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
