// src/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "ADMIN" | "DOCENTE" | "ALUMNO";
export type Sex = "M" | "F";

// Definición de la interfaz del usuario
export interface User {
  id: number;
  idPersona: number;
  rol: UserRole;
}

export interface Person {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
}

export interface UserCompleteData {
  user: User;
  persona: Person;
}

// Definición del estado de autenticación
interface AuthState {
  token: string | null;
  user: User | null;
  userCompleteData: UserCompleteData | null;
  isAuthenticated: boolean;

  // Actions, son funciones que modifican el estado
  setAuth: ( token: string, user: User, userCompleteData: UserCompleteData | null ) => void;
  logout: () => void;
  updateUser: (user: User, userCompleteData: UserCompleteData) => void;
}

// creacion del store de autenticación
export const useAuthStore = create<AuthState>()(
  // con persist para guardar en localStorage
  persist(
    (set) => ({
      token: null,
      user: null,
      userCompleteData: null,
      isAuthenticated: false,

      setAuth: (token, user, userCompleteData) => {
        set({
          token,
          user,
          userCompleteData,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          token: null,
          user: null,
          userCompleteData: null,
          isAuthenticated: false,
        });
      },

      updateUser: (user, userCompleteData) => {
        set({ user, userCompleteData });
      },
    }),
    {
      name: "auth-storage", // Nombre en localStorage
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        userCompleteData: state.userCompleteData,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
