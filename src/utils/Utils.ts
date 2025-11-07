import type { UserSemiComplete } from "@/api/users/interfaces/UserInterface";
import type { UsuarioFormData } from "@/components/admin/UsuarioFormInterface";

/**
 * Convertir UserSemiComplete a UsuarioFormData
 */
export const convertirAFormData = (user: UserSemiComplete): UsuarioFormData => {
  return {
    ...user,
    rol: user.rol.toLowerCase(),
    sexo: user.sexo.charAt(0), // Solo primera letra
    fechaNacimiento: new Date(user.fechaNacimiento),
    contrasena: "", // No viene del backend
    cedulaProfesional: user.cedulaProfesional || "",
    numeroExpediente: user.numeroExpediente || 0,
    nia: user.nia || "",
    idGeneracion: user.idGeneracion || 0,
    idGrupoSemestre: user.idGrupoSemestre || 0,
    idEspecialidad: user.idEspecialidad || 0,
    situacion: user.situacion ?? "", // ✅ Asegura siempre string
  };
};