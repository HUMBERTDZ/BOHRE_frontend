export interface UsuarioFormData {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  curp: string;
  telefono: string;
  sexo: string;
  fechaNacimiento: Date;
  nss: string;
  correo: string;
  rol: string;
  numeroCasa: number;
  calle: string;
  idLocalidad: number;
  contrasena: string;
  cedulaProfesional: string;
  numeroExpediente: number;
  nia: string;
  idGrupoSemestre: number;
  idGeneracion: number;
  idEspecialidad: number | null;
  situacion: string;
}