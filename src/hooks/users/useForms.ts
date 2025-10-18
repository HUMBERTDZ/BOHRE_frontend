import type { UsuarioFormData } from "@/components/admin/UsuarioFormInterface";
import { useState } from "react";
import { useUsers } from "./useUsers";
import { toast } from "sonner";
import type { UserSemiComplete } from "@/api/users/interfaces/UserInterface";
import { FilterDataFormByRol } from "@/utils/FilterDataFormByRol";


interface props {
  update?: {
    userToUpdate?: UserSemiComplete | null;
    handleCloseDialog?: () => void;
    handleSuccessUpdate?: () => void;
  };
  reset: () => void;
  setStateDialogOpen: (open: boolean) => void;
}

export const useForms = ({ update, reset, setStateDialogOpen }: props) => {

  // Estado local para el municipio seleccionado
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState<string>("");


  // estado para almacenar los valores iniciales del formulario
  const [valoresIniciales, setValoresIniciales] =
    useState<UsuarioFormData | null>(null);

  const { agregarUsuarioOptimistic, actualizarUsuarioOptimistic } = useUsers();

  /**
   * Función para detectar cambios en el formulario
   * @param datosActuales datos actuales del formulario
   * @returns objeto con solo los campos que cambiaron
   */
  const detectarCambios = (
    datosActuales: UsuarioFormData
  ): Record<string, any> => {
    if (!valoresIniciales || !update?.userToUpdate) {
      return datosActuales; // Modo crear, enviar todo
    }

    const cambios: Record<string, any> = {};

    // Comparación de strings base
    const camposStringBase = [
      "nombre",
      "apellidoPaterno",
      "apellidoMaterno",
      "curp",
      "telefono",
      "sexo",
      "nss",
      "correo",
      "rol",
      "calle",
    ] as const;

    camposStringBase.forEach((campo) => {
      const valorInicial = valoresIniciales[campo] as string;
      const valorActual = datosActuales[campo] as string;

      if (valorActual?.trim() !== valorInicial?.trim()) {
        cambios[campo] = valorActual;
      }
    });

    // Campos específicos de docente (solo si el rol actual es docente)
    if (datosActuales.rol === "docente") {
      const camposDocente = ["cedulaProfesional"] as const;

      camposDocente.forEach((campo) => {
        const valorInicial = valoresIniciales[campo] as string;
        const valorActual = datosActuales[campo] as string;

        if (valorActual?.trim() !== valorInicial?.trim()) {
          cambios[campo] = valorActual;
        }
      });

      // numeroExpediente para docente
      if (
        datosActuales.numeroExpediente !== valoresIniciales.numeroExpediente
      ) {
        cambios.numeroExpediente = datosActuales.numeroExpediente;
      }
    }

    // Campos específicos de alumno (solo si el rol actual es alumno)
    if (datosActuales.rol === "alumno") {
      const camposAlumno = ["nia", "situacion"] as const;

      camposAlumno.forEach((campo) => {
        const valorInicial = valoresIniciales[campo] as string;
        const valorActual = datosActuales[campo] as string;

        if (valorActual?.trim() !== valorInicial?.trim()) {
          cambios[campo] = valorActual;
        }
      });

      // IDs para alumno
      const idsAlumno = [
        "idGrupoSemestre",
        "idGeneracion",
        "idEspecialidad",
      ] as const;

      idsAlumno.forEach((campo) => {
        const valorInicial = valoresIniciales[campo] as number;
        const valorActual = datosActuales[campo] as number;

        if (valorActual !== valorInicial) {
          cambios[campo] = valorActual;
        }
      });
    }

    // Comparación de números base
    const camposNumeroBase = ["numeroCasa", "idLocalidad"] as const;

    camposNumeroBase.forEach((campo) => {
      const valorInicial = valoresIniciales[campo] as number;
      const valorActual = datosActuales[campo] as number;

      if (valorActual !== valorInicial) {
        cambios[campo] = valorActual;
      }
    });

    // Comparación de fecha
    const fechaInicial = valoresIniciales.fechaNacimiento
      ? new Date(valoresIniciales.fechaNacimiento).toISOString().split("T")[0]
      : null;
    const fechaActual = datosActuales.fechaNacimiento
      ? new Date(datosActuales.fechaNacimiento).toISOString().split("T")[0]
      : null;

    if (fechaInicial !== fechaActual) {
      cambios.fechaNacimiento = datosActuales.fechaNacimiento;
    }

    // Si hay contraseña nueva, incluirla
    if (datosActuales.contrasena && datosActuales.contrasena.trim() !== "") {
      cambios.contrasena = datosActuales.contrasena;
    }

    return cambios;
  };

  /**
   * Función para manejar el envío del formulario
   * @param data a enviar
   */
  const onSubmit = (data: UsuarioFormData) => {
    console.log("Datos originales:", data);

    if (update?.userToUpdate) {
      // Modo actualización - enviar solo los cambios
      const cambios = detectarCambios(data);

      // Verificar si hay cambios
      const tieneCambios = Object.keys(cambios).length > 0;

      if (!tieneCambios) {
        toast.info("No hay cambios para actualizar");
        return;
      }

      // Usar la mutación optimista
      actualizarUsuarioOptimistic.mutate(
        {
          userId: update.userToUpdate.id,
          data: cambios,
        },
        {
          onSuccess: () => {
            reset();
            setMunicipioSeleccionado("");
            setValoresIniciales(null);
            update?.handleSuccessUpdate?.();
            setStateDialogOpen(false);
          },
          onError: (error) => {
            console.error("Error al actualizar:", error);
          },
        }
      );
    } else {
      // Modo creación - filtrar datos según el rol
      const datosFiltrados = FilterDataFormByRol(data);
      console.log("Datos filtrados a enviar:", datosFiltrados);

      agregarUsuarioOptimistic.mutate(datosFiltrados as UsuarioFormData, {
        onSuccess: () => {
          toast.success("Usuario agregado exitósamente");
          reset();
          setMunicipioSeleccionado("");
          setStateDialogOpen(false);
        },
        onError: (error) => {
          console.log(error);
          toast.error(`Error al agregar usuario... ${error.message}`);
        },
      });
    }
  };

  return {
    onSubmit,
    setValoresIniciales,
    municipioSeleccionado,
    setMunicipioSeleccionado,
  };
};
