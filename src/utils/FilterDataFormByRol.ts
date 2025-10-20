import type { UsuarioFormData } from "@/components/admin/UsuarioFormInterface";

/**
 * Función para filtrar datos según el rol antes de enviar
 * @param data datos del formulario
 * @returns objeto con solo los campos necesarios según el rol
 */
export const FilterDataFormByRol = (
  data: UsuarioFormData
): Partial<UsuarioFormData> => {
  // Campos base que siempre se envían
  const camposBase = {
    nombre: data.nombre,
    apellidoPaterno: data.apellidoPaterno,
    apellidoMaterno: data.apellidoMaterno,
    curp: data.curp,
    telefono: data.telefono,
    sexo: data.sexo,
    fechaNacimiento: data.fechaNacimiento,
    nss: data.nss,
    correo: data.correo,
    rol: data.rol,
    numeroCasa: data.numeroCasa,
    calle: data.calle,
    idLocalidad: data.idLocalidad,
    contrasena: data.contrasena,
  };

  // Agregar campos específicos según el rol
  if (data.rol === "docente") {
    return {
      ...camposBase,
      cedulaProfesional: data.cedulaProfesional,
      numeroExpediente: data.numeroExpediente,
    };
  } else if (data.rol === "alumno") {
    return {
      ...camposBase,
      nia: data.nia,
      situacion: data.situacion,
      idGrupoSemestre: data.idGrupoSemestre,
      idGeneracion: data.idGeneracion,
      idEspecialidad: data.idEspecialidad != 0 ? data.idEspecialidad : null,
    };
  }

  // Si es admin, solo enviar campos base
  return camposBase;
};
