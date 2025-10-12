import type { FC } from "react";
import { LoginForm } from "./LoginForm";

export const AuthPage: FC = () => {
  return (
    <>
      <div className="min-h-screen bg-background grid lg:grid-cols-2">
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Sistema de Calificaciones
              </h1>
              <p className="text-muted-foreground">
                Ingresa tus credenciales para ingresar al sistema
              </p>
            </div>
            <LoginForm />
          </div>
        </div>
        <div className="hidden bg-primary bg-[url('/fondomain.svg')] bg-cover lg:block"></div>
      </div>
    </>
  );
};
