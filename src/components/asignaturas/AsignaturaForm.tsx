import type { Asignatura } from "@/api/asignaturas/interfaces/AsignaturasInterfaces";
import { useEspecialidades } from "@/hooks/especialidades/useEspecialidades";
import React, { useEffect, type FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../ui/select";
import { useForms } from "@/hooks/asignaturas/useForms";
import { usePeriods } from "@/hooks/periods/usePeriods";


interface props {
  stateDialogOpen: boolean;
  setStateDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  update?: {
    asignaturaToUpdate?: Asignatura | null;
    handleCloseDialog?: () => void;
    handleSuccessUpdate?: () => void;
  };
}

export const AsignaturaForm: FC<props> = ({ stateDialogOpen, setStateDialogOpen, update, }) => {
  // hooks para especialidades y semestres
  const { getEspecialidades } = useEspecialidades();
  const { getSemestres } = usePeriods();
  const { data: especialidades, isFetching: isFetchingEspecialidades } = getEspecialidades();
  const { data: semestres, isFetching: isFetchingSemestres } = getSemestres();

  // useForm de react form
  const { register, handleSubmit, formState: { errors }, control, reset, watch, } = useForm<Asignatura>();

  // hook personalizado para manejar el formulario
  const { onSubmit, setValoresIniciales } = useForms({ update, reset, setStateDialogOpen });

  // Observar el valor del tipo seleccionado
  const tipoSeleccionado = watch("tipo");

  const handleCancel = () => {
    console.log('cancelado')
    reset({});
    update?.handleCloseDialog?.();
    setStateDialogOpen(false);
  };

  /**
     * Cargar datos del usuario cuando se va a actualizar
     */
    useEffect(() => {
      if (stateDialogOpen && update?.asignaturaToUpdate) {
        const asignaturaToUpdate = update.asignaturaToUpdate;
        reset({
          ...asignaturaToUpdate,
          tipo: asignaturaToUpdate.tipo.toLowerCase(),
        });
        setValoresIniciales(asignaturaToUpdate);
      } else if (stateDialogOpen && !update?.asignaturaToUpdate) {
        reset({});
        setValoresIniciales(null);
      }
    }, [stateDialogOpen, update?.asignaturaToUpdate, reset]);

    useEffect(() => {
      if (!tipoSeleccionado) return;

      // Si el rol es comun, limpiar todos los campos extra
      if (tipoSeleccionado === "comun") {
        reset((formValues) => ({
          ...formValues,
        }));
      }
    }, [tipoSeleccionado, reset]);

  return (
    <AlertDialog open={stateDialogOpen} onOpenChange={setStateDialogOpen}>
      <AlertDialogContent className="min-w-2/5 grid grid-rows-[auto_1fr_auto] max-h-11/12">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {update?.asignaturaToUpdate ? "Actualizar asignatura" : "Agregar asignatura"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Llene correctamente los campos para {update?.asignaturaToUpdate ? "actualizar" : "agregar"} la asignatura.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form id="usersForm" className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
          <div>
            {/* nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre" className="block text-sm font-medium">
                Nombre
              </Label>
              <Input id="nombre" type="text" placeholder="Nombre" maxLength={150}
                {...register("nombre", {
                  required: "El nombre es requerido",
                  minLength: {
                  value: 3,
                  message: "El nombre debe tener mínimo 3 caracteres",
                  },
                  maxLength: {
                  value: 150,
                  message: "El nombre debe tener máximo 150 caracteres",
                  },
                })}
                className="uppercase placeholder:text-gray-400 placeholder:capitalize"
              />
              {errors.nombre && (
                <span className="text-xs block relative -top-1 text-red-400">
                  {errors.nombre.message}
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {/* semestre */}
            <div className="space-y-2">
              <Label htmlFor="idSemestre" className="block text-sm font-medium">
                Semestre
              </Label>
              <Controller name="idSemestre" control={control} rules={{ required: "El semestre es requerido" }}
                render={({ field }) => (
                  <Select onValueChange={(value) => field.onChange(value)} value={field.value?.toString()}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Semestre" />
                    </SelectTrigger>
                    <SelectContent>
                      {isFetchingSemestres ? (
                        <SelectItem value="loading" disabled>
                          Cargando...
                        </SelectItem>
                      ) : (
                        semestres?.data.map((semestre) => (
                          <SelectItem key={semestre.id} value={semestre.id.toString()}>
                            {semestre.numero} - {semestre.periodo}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tipo && (
                <span className="text-xs block relative -top-1 text-red-400">
                  {errors.tipo.message}
                </span>
              )}
            </div>

            {/* tipo */}
            <div className="space-y-2">
              <Label htmlFor="tipo" className="block text-sm font-medium">
                Tipo
              </Label>
              <Controller name="tipo" control={control} rules={{ required: "El tipo es requerido" }}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comun">COMUN</SelectItem>
                      <SelectItem value="especialidad">ESPECIALIDAD</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tipo && (
                <span className="text-xs block relative -top-1 text-red-400">
                  {errors.tipo.message}
                </span>
              )}
            </div>

            {tipoSeleccionado === "especialidad" && (
              /* especialidad  */
              <div className="space-y-2">
                <Label htmlFor="idEspecialidad" className="block text-sm font-medium">
                  Especialidad
                </Label>
                <Controller name="idEspecialidad" control={control} rules={{ required: "La especialidad es requerida" }}
                  render={({ field }) => (
                    <Select onValueChange={(value) => field.onChange(value)} value={field.value?.toString()}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {isFetchingEspecialidades ? (
                          <SelectItem value="loading" disabled>
                            Cargando...
                          </SelectItem>
                        ) : (
                          especialidades?.data.map((especialidad) => (
                            <SelectItem key={especialidad.id} value={especialidad.id.toString()}>
                              {especialidad.nombre}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.idEspecialidad && (
                  <span className="text-xs block relative -top-1 text-red-400">
                    {errors.idEspecialidad.message}
                  </span>
                )}
              </div>
            )}
          </div>
        </form>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancelar</AlertDialogCancel>
          <Button type="submit" form="usersForm">
            Aceptar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
