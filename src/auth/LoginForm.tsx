import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { GraduationCap } from "lucide-react";
import { useEffect, type FC } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

interface LoginFormData {
  correo: string;
  contrasena: string;
}

export const LoginForm: FC = () => {
  const navigate = useNavigate();
  const { login, loading, error, isAuthenticated, user } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  // Función para obtener la ruta según el rol
  const getRedirectPath = (rol: string) => {
    switch (rol) {
      case 'ADMIN':
        return '/inicio';
      case 'DOCENTE':
        return '/docencia';
      case 'ALUMNO':
        return '/mis-clases';
      default:
        return '/';
    }
  };

  // Si ya está autenticado, redirigir según rol
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = getRedirectPath(user.rol);
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    const result = await login(data);

    if (result.success && result.user) {
      toast.success('Inicio de sesión exitoso');
      
      const redirectPath = getRedirectPath(result.user.rol);
      navigate(redirectPath, { replace: true });
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <Card className="w-full shadow-lg border-border">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
        <CardDescription>Accede a tu cuenta</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="correo">Correo electrónico</Label>
            <Input
              id="correo"
              type="email"
              placeholder="correo@example.com"
              {...register("correo", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Correo electrónico inválido",
                },
                minLength: {
                  value: 8,
                  message: "El correo debe tener al menos 8 caracteres",
                },
                maxLength: {
                  value: 40,
                  message: "El correo no puede exceder 40 caracteres",
                },
              })}
              className={errors.correo ? "border-red-500" : ""}
            />
            {errors.correo && (
              <p className="text-sm text-red-500">{errors.correo.message}</p>
            )}
          </div>

          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="contrasena">Contraseña</Label>
            </div>
            <Input
              id="contrasena"
              type="password"
              placeholder="********"
              {...register("contrasena", {
                required: "La contraseña es obligatoria",
                minLength: {
                  value: 8,
                  message: "La contraseña debe tener al menos 8 caracteres",
                },
                maxLength: {
                  value: 12,
                  message: "La contraseña no puede exceder 12 caracteres",
                },
              })}
              className={errors.contrasena ? "border-red-500" : ""}
            />
            {errors.contrasena && (
              <p className="text-sm text-red-500">
                {errors.contrasena.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="py-2 flex-col gap-3">
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
