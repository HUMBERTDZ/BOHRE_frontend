export interface ResponseAlumnosGrupos {
  message: string;
  data: Data;
}

export interface Data {
  general: General;
  asignaturas: Asignatura[];
}

export interface Asignatura {
  idAsignatura: number;
  nombre: string;
  tipo: string;
  semestre: string;
  periodo: string;
  especialidad: string;
}

export interface General {
  idGrupoSemestre: number;
  grupo: string;
  semestre: number;
  periodoSemestre: string;
  alumnos: Alumno[];
}

export interface Alumno {
  id: number;
  nia: string;
  nombre: string;
  apellidoMaterno: string;
  apellidoPaterno: string;
  especialidad: string;
}
