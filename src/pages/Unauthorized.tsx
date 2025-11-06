import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="w-full max-w-md shadow-lg border border-gray-200">
          <CardHeader className="flex flex-col items-center space-y-2">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-2">
              <AlertCircle className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              Acceso Denegado
            </CardTitle>
            <p className="text-sm text-gray-500 text-center">
              Código de error: <span className="font-semibold text-red-500">403</span>
            </p>
          </CardHeader>

          <CardContent className="text-center space-y-3">
            <p className="text-gray-600">
              No tienes permisos para acceder a este recurso.
            </p>
            {user?.rol && (
              <p className="text-sm text-gray-500">
                Tu rol actual: <span className="font-semibold">{user.rol}</span>
              </p>
            )}
          </CardContent>

          <CardFooter className="flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Volver
            </Button>
            <Button
              variant="destructive"
              onClick={() => logout()}
            >
              Cerrar Sesión
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
