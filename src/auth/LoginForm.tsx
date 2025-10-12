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
import { GraduationCap } from "lucide-react";
import type { FC } from "react";
export const LoginForm: FC = () => {
  const handleSubmit = () => {};

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

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="correo">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="correo@example.com"
              required
            />
          </div>
          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="password">Contraseña</Label>
            </div>
            <Input id="password" type="password" placeholder="****" required />
          </div>
        </CardContent>
        <CardFooter className="py-2 flex-col gap-3">
          <Button type="submit" className="w-full">
            Iniciar sesión
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
