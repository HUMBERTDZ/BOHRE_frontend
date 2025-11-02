// src/api/authAPI.ts
import { useAuthStore } from '@/store/AuthStore';
import { BaseAPI } from './BaseAPI';

// Instancia de axios para rutas públicas
export const publicAPI = BaseAPI();

// Instancia de axios para rutas protegidas
export const privateAPI = BaseAPI();

// Interceptor para agregar el token automáticamente
privateAPI.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    config.headers.Accept = 'application/json';
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
privateAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el token expiró o no es válido (401)
    if (error.response?.status === 401) {
      const logout = useAuthStore.getState().logout;
      logout();
      
      // Redirigir al login (opcional, puedes manejarlo en tu router)
      window.location.href = '/auth';
    }
    
    return Promise.reject(error);
  }
);

// Tipos de respuesta
export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    idPersona: number | null;
    rol: 'ADMIN' | 'DOCENTE' | 'ALUMNO';
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
  };
}

export interface ErrorResponse {
  message: string;
  success: boolean;
}

// Funciones de autenticación
export const authAPI = {
  login: async (credentials: LoginRequest) => {
    const response = await publicAPI.post<LoginResponse>('/login', credentials);
    return response.data;
  },

  me: async () => {
    const response = await privateAPI.get<{
      id: number;
      idPersona: number | null;
      rol: 'admin' | 'docente' | 'alumno';
    }>('/me');
    return response.data;
  },

  // Función para validar si el token sigue siendo válido
  validateToken: async () => {
    try {
      const user = await authAPI.me();
      return { valid: true, user };
    } catch {
      return { valid: false, user: null };
    }
  },
};