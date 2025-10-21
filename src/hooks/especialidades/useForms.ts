import type { Asignatura } from "@/api/asignaturas/interfaces/AsignaturasInterfaces";
import { useState } from "react";
import { toast } from "sonner";
import { useEspecialidades } from "./useEspecialidades";
import type { Especialidad } from "@/api/especialidades/interfaces/EspecialidadesInterfaces";

interface props {
  update?: {
    especialidadToUpdate?: Especialidad | null;
    handleCloseDialog?: () => void;
    handleSuccessUpdate?: () => void;
  };
  reset: () => void;
  setStateDialogOpen: (open: boolean) => void;
}
export const useForms = ({ update, reset, setStateDialogOpen }: props) => {
  // estado para almacenar los valores iniciales del formulario
  const [valoresIniciales, setValoresIniciales] = useState<Especialidad | null>(null);

  const { addEspecialidad, getUpdateEspecialidad } = useEspecialidades();

  /**
   * Función para detectar cambios en el formulario
   * @param datosActuales datos actuales del formulario
   * @returns objeto con solo los campos que cambiaron
   */
  const detectarCambios = (datosActuales: Especialidad): Record<string, any> => {
    if (!valoresIniciales || !update?.especialidadToUpdate) {
      return datosActuales; // Modo crear, enviar todo
    }

    const cambios: Record<string, any> = {};

    // Comparación de strings base
    const camposStringBase = ["nombre"] as const;

    // Recorremos y comparamos cada campo
    camposStringBase.forEach((campo) => {
      const valorInicial = valoresIniciales[campo] as string;
      const valorActual = datosActuales[campo] as string;

      if (valorActual?.trim() !== valorInicial?.trim()) {
        cambios[campo] = valorActual;
      }
    });

    return cambios;
  };

  const transformValues = (data: Especialidad): Partial<Especialidad> => {
    const transformedData: Partial<Especialidad> = {
      nombre: data.nombre,
    };

    return {
      ...transformedData,
    };
  };

  /**
   * Función para manejar el envío del formulario
   * @param data a enviar
   */
  const onSubmit = (data: Especialidad) => {
    if (update?.especialidadToUpdate) {
      // Modo actualización - enviar solo los cambios
      const cambios = detectarCambios(data);

      // Verificar si hay cambios
      const tieneCambios = Object.keys(cambios).length > 0;

      if (!tieneCambios) {
        toast.info("No hay cambios para actualizar");
        return;
      }

      const dataToSend = transformValues(data) as Especialidad;

      getUpdateEspecialidad.mutate({ id: update.especialidadToUpdate.id, data: dataToSend });

    } else {
      // Modo creación - enviar todos los datos
      addEspecialidad.mutate(transformValues(data) as Especialidad);
    }

    // Cerrar el diálogo y resetear el formulario
    reset();
    setStateDialogOpen(false);
  };

  return {
    onSubmit,
    setValoresIniciales,
  };
};
