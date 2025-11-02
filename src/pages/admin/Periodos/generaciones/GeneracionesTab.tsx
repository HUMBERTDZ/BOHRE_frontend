import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/DatePicker";
import { ButtonLink } from "@/components/ui/my/ButtonLink";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { usePeriods } from "@/hooks/periods/usePeriods";
import { formatDate } from "@/utils/FormatDate";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

type FormValues = {
  fechaInicio?: Date | string | null;
  fechaFin?: Date | string | null;
};

export const GeneracionesTab = () => {
  const { getGeneracionesAlumnosCount, getCreateGeneration } = usePeriods();
  const { data: generacionesConConteo, isLoading } = getGeneracionesAlumnosCount();
  const queryClient = useQueryClient();

  const [stateDialogOpen, setStateDialogOpen] = useState(false);

  const { control, handleSubmit, setValue, watch, reset, formState: { errors, isValid }, trigger, } = useForm<FormValues>({
    mode: "onChange", // actualizar isValid en tiempo real
    defaultValues: { fechaInicio: null, fechaFin: null },
  });

  const fechaInicioRaw = watch("fechaInicio");
  const fechaFinRaw = watch("fechaFin");

  const parseToDate = (v?: Date | string | null) => {
    if (!v) return null;
    return v instanceof Date ? v : new Date(v);
  };

  // recalcula fechaMinima y fuerza validación cuando cambie el inicio
  useEffect(() => {
    const inicio = parseToDate(fechaInicioRaw);
    if (inicio) {
      const fechaMinima = new Date(inicio);
      fechaMinima.setFullYear(fechaMinima.getFullYear() + 3);

      // Si fechaFin no existe o es menor que la mínima, auto-ajusta
      const fin = parseToDate(fechaFinRaw);
      if (!fin || fin < fechaMinima) {
        // Ajustar la fechaFin automáticamente y forzar validación
        setValue("fechaFin", fechaMinima, {
          shouldValidate: true,
          shouldDirty: true,
        });
        // trigger para que errors / isValid se actualicen inmediatamente
        trigger("fechaFin");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechaInicioRaw]);

  const onSubmit = (data: FormValues) => {
    // handleSubmit sólo se ejecuta si las validaciones pasan
    console.log("Nueva generación válida:", data);

    getCreateGeneration.mutate({ fechaIngreso: data.fechaInicio!, fechaEgreso: data.fechaFin! }, {
      onSuccess: (response) => {
        console.log("Generación creada:", response.data);
        queryClient.invalidateQueries({ queryKey: ["generacionesAlumnosCount"] });
        queryClient.invalidateQueries({ queryKey: ["periods", "current"] });
      },
      onError: (error) => {
        console.error("Error al crear generación:", error);
      },
    });

    // aquí guardas a backend o lo que necesites
    setStateDialogOpen(false);
    reset({ fechaInicio: null, fechaFin: null });
  };

  if (isLoading) return <div>Cargando...</div>;

  return (
    <>
      <Card className="relative">
        <CardHeader>
          <CardTitle>Generaciones</CardTitle>
          <CardDescription>
            Aquí puedes ver las generaciones y el número de alumnos en cada una.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="absolute top-4 right-4"
            variant="outline"
            size="sm"
            onClick={() => {
              reset({ fechaInicio: null, fechaFin: null });
              setStateDialogOpen(true);
            }}
          >
            Dar alta
          </Button>

          <Table className="text-center">
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="font-semibold text-center">
                  Fecha de Ingreso
                </TableHead>
                <TableHead className="font-semibold text-center">
                  Fecha de Egreso
                </TableHead>
                <TableHead className="font-semibold text-center">
                  Número de Alumnos
                </TableHead>
                <TableHead className="font-semibold text-center">
                  Acción
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {generacionesConConteo?.data.map((generacion) => (
                <TableRow key={generacion.id}>
                  <TableCell>{formatDate(generacion.fechaIngreso)}</TableCell>
                  <TableCell>{formatDate(generacion.fechaEgreso)}</TableCell>
                  <TableCell>{generacion.numeroAlumnos}</TableCell>
                  <TableCell>
                    {
                      generacion.numeroAlumnos! > 0 && ( <ButtonLink
                      url={`generaciones/${generacion.id}`}
                      text="Ver alumnos"
                      button={{ variant: "outline", size: "sm" }}
                    /> )
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={stateDialogOpen} onOpenChange={setStateDialogOpen}>
        <AlertDialogContent className="min-w-2/5 grid grid-rows-[auto_1fr_auto] max-h-11/12">
          <AlertDialogHeader>
            <AlertDialogTitle>Agregar nueva generación</AlertDialogTitle>
            <AlertDialogDescription>
              Seleccione las fechas correctamente (mínimo 3 años de diferencia).
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form
            id="generacionesForm"
            className="space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-2 gap-4">
              {/* FECHA INICIO */}
              <Controller
                name="fechaInicio"
                control={control}
                rules={{
                  required: "La fecha de inicio es requerida",
                  validate: (value) => {
                    const inicio = parseToDate(value);
                    const fin = parseToDate(fechaFinRaw);
                    if (!inicio) return "La fecha de inicio es inválida";
                    // Si ya existe fechaFin, validar que inicio <= fechaFin (completa)
                    if (fin && inicio > fin)
                      return "La fecha de inicio no puede ser posterior a la fecha fin";
                    return true;
                  },
                }}
                render={({ field }) => (
                  <DatePicker
                    label="Fecha de inicio"
                    placeholder="Seleccionar fecha"
                    value={
                      field.value
                        ? field.value instanceof Date
                          ? field.value
                          : new Date(field.value)
                        : undefined
                    }
                    onChange={(v) => {
                      // Aseguramos que value llegue como Date | null
                      const parsed = v
                        ? v instanceof Date
                          ? v
                          : new Date(v)
                        : null;
                      field.onChange(parsed);
                    }}
                    error={errors.fechaInicio?.message as string | undefined}
                    id="fechaInicio"
                  />
                )}
              />

              {/* FECHA FIN */}
              <Controller
                name="fechaFin"
                control={control}
                rules={{
                  required: "La fecha de fin es requerida",
                  validate: (value) => {
                    const inicio = parseToDate(fechaInicioRaw);
                    const fin = parseToDate(value);
                    if (!fin) return "La fecha de fin es inválida";
                    if (!inicio) return "Selecciona primero la fecha de inicio";
                    // fecha mínima = inicio + 3 años (completa)
                    const fechaMinima = new Date(inicio);
                    fechaMinima.setFullYear(fechaMinima.getFullYear() + 3);
                    if (fin < fechaMinima) {
                      const minStr = fechaMinima.toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });
                      return `La fecha de fin debe ser como mínimo ${minStr} (3 años después)`;
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <DatePicker
                    label="Fecha de fin"
                    placeholder="Seleccionar fecha"
                    value={
                      field.value
                        ? field.value instanceof Date
                          ? field.value
                          : new Date(field.value)
                        : undefined
                    }
                    onChange={(v) => {
                      const parsed = v
                        ? v instanceof Date
                          ? v
                          : new Date(v)
                        : null;
                      field.onChange(parsed);
                    }}
                    error={errors.fechaFin?.message as string | undefined}
                    id="fechaFin"
                  />
                )}
              />
            </div>

            <div className="flex justify-end pt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset({ fechaInicio: null, fechaFin: null });
                  setStateDialogOpen(false);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={!isValid}>
                Guardar
              </Button>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
