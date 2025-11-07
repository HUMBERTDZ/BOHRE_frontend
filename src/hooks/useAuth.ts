// src/hooks/useAuth.ts
import { useState } from 'react';
import { authAPI, type LoginRequest, type ErrorResponse } from '../api/authAPI';
import { AxiosError } from 'axios';
import { useAuthStore } from '@/store/AuthStore';
import { useNavigate } from 'react-router';

export const useAuth = () => {
  const { token, user,userCompleteData, isAuthenticated, setAuth, logout: clearAuth, updateUser } = useAuthStore();
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ error, setError ] = useState<string | null>(null);
  
  const navigate = useNavigate();

  // Login
  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    setError(null);

    try {
      const data = await authAPI.login(credentials);
      
      setAuth(data.access_token, data.user, null);
      refreshUser();
      
      return { success: true, user: data.user };
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    clearAuth();
    setError(null);
    navigate('/auth', { replace: true });
  };

  // Validar token al cargar la app
  const validateSession = async () => {
    if (!token) return false;

    setLoading(true);

    try {
      const result = await authAPI.validateToken();
      
      if (result.valid && result.user) {
        updateUser(result.user.user, result.user);
        return true;
      } else {
        clearAuth();
        return false;
      }
    } catch {
      clearAuth();
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Obtener datos actualizados del usuario
  const refreshUser = async () => {
    try {
      const userData = await authAPI.me();
      console.log(userData)
      updateUser(userData.user, userData);
      return userData;
    } catch {
      clearAuth();
      return null;
    }
  };

  return {
    // Estado
    token,
    user,
    userCompleteData,
    isAuthenticated,
    loading,
    error,
    
    // Acciones
    login,
    logout,
    validateSession,
    refreshUser,
  };
};