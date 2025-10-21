import React, { useEffect, type FC } from "react";
import { useForm } from "react-hook-form";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import type { Especialidad } from "@/api/especialidades/interfaces/EspecialidadesInterfaces";
import { useForms } from "@/hooks/especialidades/useForms";


interface props {
  stateDialogOpen: boolean;
  setStateDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  update?: {
    especialidadToUpdate?: Especialidad | null;
    handleCloseDialog?: () => void;
    handleSuccessUpdate?: () => void;
  };
}

export const EspecialidadesForm: FC<props> = ({ stateDialogOpen, setStateDialogOpen, update, }) => {
  // hooks para especialidades y semestres

  // useForm de react form
  const { register, handleSubmit, formState: { errors }, reset, } = useForm<Especialidad>();

  // hook personalizado para manejar el formulario
  const { onSubmit, setValoresIniciales } = useForms({ update, reset, setStateDialogOpen });

  const handleCancel = () => {
    console.log('cancelado')
    reset({});
    update?.handleCloseDialog?.();
    setStateDialogOpen(false);
  };

  useEffect(() => {
      if (stateDialogOpen && update?.especialidadToUpdate) {
        const especialidadToUpdate = update.especialidadToUpdate;
        reset({
          ...especialidadToUpdate,
        });
        setValoresIniciales(especialidadToUpdate);
      } else if (stateDialogOpen && !update?.especialidadToUpdate) {
        reset({});
        setValoresIniciales(null);
      }
    }, [stateDialogOpen, update?.especialidadToUpdate, reset]);

  return (
    <AlertDialog open={stateDialogOpen} onOpenChange={setStateDialogOpen}>
      <AlertDialogContent className="min-w-2/5 grid grid-rows-[auto_1fr_auto] max-h-11/12">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {update?.especialidadToUpdate ? "Actualizar especialidad" : "Agregar especialidad"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Llene correctamente los campos para {update?.especialidadToUpdate ? "actualizar" : "agregar"} la especialidad.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form id="especialidadesForm" className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
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
                  value: 80,
                  message: "El nombre debe tener máximo 80 caracteres",
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
         
        </form>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancelar</AlertDialogCancel>
          <Button type="submit" form="especialidadesForm">
            Aceptar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
