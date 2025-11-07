// src/api/authAPI.ts
import { type User, type UserCompleteData } from '@/store/AuthStore';
import { BaseAPI } from './BaseAPI';

// Instancia de axios para rutas públicas
export const publicAPI = BaseAPI({ isPrivate: false });

// Instancia de axios para rutas protegidas
export const privateAPI = BaseAPI();


// Tipos de respuesta
export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
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
    const response = await privateAPI.get<UserCompleteData>('/me');
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