import type { Asignatura } from "@/api/asignaturas/interfaces/AsignaturasInterfaces";
import { useState } from "react";
import { toast } from "sonner";
import { useAsignaturas } from "./useAsignaturas";

interface props {
  update?: {
    asignaturaToUpdate?: Asignatura | null;
    handleCloseDialog?: () => void;
    handleSuccessUpdate?: () => void;
  };
  reset: () => void;
  setStateDialogOpen: (open: boolean) => void;
}
export const useForms = ({ update, reset, setStateDialogOpen }: props) => {
  // estado para almacenar los valores iniciales del formulario
  const [valoresIniciales, setValoresIniciales] = useState<Asignatura | null>(null);

  const { addAsignatura, updateAsignatura } = useAsignaturas();

  /**
   * Función para detectar cambios en el formulario
   * @param datosActuales datos actuales del formulario
   * @returns objeto con solo los campos que cambiaron
   */
  const detectarCambios = (datosActuales: Asignatura): Record<string, any> => {
    if (!valoresIniciales || !update?.asignaturaToUpdate) {
      return datosActuales; // Modo crear, enviar todo
    }

    const cambios: Record<string, any> = {};

    // Comparación de strings base
    const camposStringBase = ["nombre", "tipo"] as const;

    // Recorremos y comparamos cada campo
    camposStringBase.forEach((campo) => {
      const valorInicial = valoresIniciales[campo] as string;
      const valorActual = datosActuales[campo] as string;

      if (valorActual?.trim() !== valorInicial?.trim()) {
        cambios[campo] = valorActual;
      }
    });

    if (datosActuales.tipo === "especialidad") {
      const campoExtra = ["idEspecialidad"] as const;

      campoExtra.forEach((campo) => {
        const valorInicial = valoresIniciales[campo] as number;
        const valorActual = datosActuales[campo] as number;

        if (valorActual !== valorInicial) {
          cambios[campo] = valorActual;
        }
      });
    }

    // Comparación de números base
    const camposNumeroBase = ["idSemestre"] as const;

    camposNumeroBase.forEach((campo) => {
      const valorInicial = valoresIniciales[campo] as number;
      const valorActual = datosActuales[campo] as number;

      if (valorActual !== valorInicial) {
        cambios[campo] = valorActual;
      }
    });

    return cambios;
  };

  const transformValues = (data: Asignatura): Partial<Asignatura> => {
    const transformedData: {} = {
      nombre: data.nombre,
      tipo: data.tipo.toLowerCase(),
      idSemestre: data.idSemestre,
      idEspecialidad: data.idEspecialidad,
    };

    if (data.tipo === "especialidad" && data.idEspecialidad) {
      return { ...transformedData };
    }

    return {
      ...transformedData,
      idEspecialidad: null,
    };
  };

  /**
   * Función para manejar el envío del formulario
   * @param data a enviar
   */
  const onSubmit = (data: Asignatura) => {
    if (update?.asignaturaToUpdate) {
      // Modo actualización - enviar solo los cambios
      const cambios = detectarCambios(data);

      // Verificar si hay cambios
      const tieneCambios = Object.keys(cambios).length > 0;

      if (!tieneCambios) {
        toast.info("No hay cambios para actualizar");
        return;
      }

      console.log('data por enviar', data)
      const dataToSend = transformValues(data) as Asignatura;
      console.log('data transform', dataToSend)

      updateAsignatura({id: update.asignaturaToUpdate.idAsignatura, data: dataToSend});

    } else {
      // Modo creación - enviar todos los datos
      addAsignatura(transformValues(data) as Asignatura);
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
