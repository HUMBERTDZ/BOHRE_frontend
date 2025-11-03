import { useEffect, useState } from "react";
import { Save, TrendingUp, TrendingDown, Award } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/ui/Loading";
import { useCalificaciones } from "@/hooks/calificaciones/useCalificaciones";

interface CalificacionesClaseProps {
  idClase: number;
  onClose: () => void;
}

export const CalificacionesClase = ({ idClase, onClose, }: CalificacionesClaseProps) => {
  const { getCalificacionesByClaseDoc, getPostCalificaciones } = useCalificaciones();

  const { data: result, isLoading: loading } = getCalificacionesByClaseDoc(idClase);
  
  const [calificaciones, setCalificaciones] = useState<{
    [idAlumno: number]: {
      momento1: number;
      momento2: number;
      momento3: number;
    };
  }>({});

  const [hasChanges, setHasChanges] = useState(false);

  const data = result?.data;

  const handleCalificacionChange = ( idAlumno: number, momento: "momento1" | "momento2" | "momento3", valor: string ) => {
    const numValor = parseFloat(valor) || 0;
    if (numValor < 0 || numValor > 10) return;

    setCalificaciones((prev) => ({
      ...prev,
      [idAlumno]: {
        ...prev[idAlumno],
        [momento]: numValor,
      },
    }));
    setHasChanges(true);
  };

  const calcularPromedio = (idAlumno: number): number => {
    const calif = calificaciones[idAlumno];
    if (!calif) return 0;
    return parseFloat(
      ((calif.momento1 + calif.momento2 + calif.momento3) / 3).toFixed(2)
    );
  };

  const handleGuardar = async () => {
  if (!data?.alumnos) return;

  const payload = data.alumnos.map(alumno => {
    // toma los cambios si existen, si no usa los datos originales
    const calif = calificaciones[alumno.idAlumno] || {
      momento1: alumno.momento1 ?? 0,
      momento2: alumno.momento2 ?? 0,
      momento3: alumno.momento3 ?? 0,
    };
    return {
      idAlumno: alumno.idAlumno,
      ...calif,
    };
  });

  getPostCalificaciones.mutate(
    { idClase, calificaciones: payload },
    {
      onSuccess: () => {
        setHasChanges(false);
      },
    }
  );
};


  const getColorPromedio = (promedio: number): string => {
    if (promedio >= 9) return "text-green-600 font-bold";
    if (promedio >= 8) return "text-blue-600 font-semibold";
    if (promedio >= 7) return "text-yellow-600";
    if (promedio >= 6) return "text-orange-600";
    return "text-red-600 font-semibold";
  };

  useEffect(() => {
  if (data?.alumnos) {
    const inicial = data.alumnos.reduce((acc, alumno) => {
      acc[alumno.idAlumno] = {
        momento1: alumno.momento1 ?? 0,
        momento2: alumno.momento2 ?? 0,
        momento3: alumno.momento3 ?? 0,
      };
      return acc;
    }, {} as Record<number, { momento1: number; momento2: number; momento3: number }>);
    setCalificaciones(inicial);
  }
}, [data]);


  if (loading) return <Loading />;

  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent className="w-full min-w-3/4 lg:min-w-1/2 lg:max-w-4xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{data?.clase.asignatura}</AlertDialogTitle>
          <AlertDialogDescription>
            Grupo {data?.clase.grupo} - Semestre {data?.clase.semestre} / Año:{" "}
            {data?.clase.anio}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-blue-600 font-medium">Total Alumnos</p>
            <p className="text-2xl font-bold text-blue-900">
              {data?.estadisticas.totalAlumnos}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-xs text-purple-600 font-medium">
              Promedio Grupo
            </p>
            <p className="text-2xl font-bold text-purple-900">
              {data?.estadisticas.promedioGrupo}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <p className="text-xs text-green-600 font-medium">Aprobados</p>
            </div>
            <p className="text-2xl font-bold text-green-900">
              {data?.estadisticas.aprobados}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <p className="text-xs text-red-600 font-medium">Reprobados</p>
            </div>
            <p className="text-2xl font-bold text-red-900">
              {data?.estadisticas.reprobados}
            </p>
          </div>
        </div>

        {/* Tabla con ScrollArea */}
        <div className="mt-6 h-[400px]">
          <ScrollArea className="h-full w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NIA</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="text-center">Momento 1</TableHead>
                  <TableHead className="text-center">Momento 2</TableHead>
                  <TableHead className="text-center">Momento 3</TableHead>
                  <TableHead className="text-center">Promedio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.alumnos.map((alumno) => {
                  const promedio = calcularPromedio(alumno.idAlumno);
                  const calif = calificaciones[alumno.idAlumno] || {
                    momento1: 0,
                    momento2: 0,
                    momento3: 0,
                  };
                  return (
                    <TableRow
                      key={alumno.idAlumno}
                      className="hover:bg-gray-50"
                    >
                      <TableCell>{alumno.nia}</TableCell>
                      <TableCell className="font-medium">
                        {alumno.nombre}
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min={0}
                          max={10}
                          value={calif.momento1}
                          onChange={(e) =>
                            handleCalificacionChange(
                              alumno.idAlumno,
                              "momento1",
                              e.target.value
                            )
                          }
                          className="w-20 mx-auto"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min={0}
                          max={10}
                          value={calif.momento2}
                          onChange={(e) =>
                            handleCalificacionChange(
                              alumno.idAlumno,
                              "momento2",
                              e.target.value
                            )
                          }
                          className="w-20 mx-auto"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min={0}
                          max={10}
                          value={calif.momento3}
                          onChange={(e) =>
                            handleCalificacionChange(
                              alumno.idAlumno,
                              "momento3",
                              e.target.value
                            )
                          }
                          className="w-20 mx-auto"
                        />
                      </TableCell>
                      <TableCell
                        className={`text-center text-lg ${getColorPromedio(
                          promedio
                        )}`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          {promedio >= 9 && <Award className="w-4 h-4" />}
                          {promedio.toFixed(2)}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        {/* Footer */}
        <AlertDialogFooter className="mt-6 flex items-center justify-between">
          <div>
            {hasChanges && (
              <p className="text-sm text-orange-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span>
                Hay cambios sin guardar
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} size={"sm"}>
              Cancelar
            </Button>
            <Button onClick={handleGuardar} disabled={!hasChanges} size={"sm"}>
              <Save />
              Guardar Calificaciones
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
