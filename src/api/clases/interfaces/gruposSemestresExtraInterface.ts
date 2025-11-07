// interfaces/gruposSemestresExtraInterface.ts

export interface ResponseAlumnosGrupos {
  message: string;
  data: Data;
}

export interface Data {
  general: General;
  clases: Clases;
  anio: number;
  estadisticas: Estadisticas;
  advertencia?: string; // Opcional, solo si no hay clases
}

export interface Clases {
  troncoComun: Clase[];
  especialidades: EspecialidadesClases;
}

export interface EspecialidadesClases {
  ALIMENTOS?: Clase[];
  SALUD?: Clase[];
  ADMINISTRACIÓN?: Clase[];
}

export interface Clase {
  idClase: number;
  anio: number;
  idGrupoSemestre: number;
  semestre: number;
  grupo: string;
  idAsignatura: number;
  nombreAsignatura: string;
  tipoAsignatura: string;
  idEspecialidad: number | null;
  especialidad: string;
  idDocente: number | null;
  nombreDocente: string | null;
  alumnosInscritos: number;
}

export interface Estadisticas {
  totalClases: number;
  clasesConDocente: number;
  clasesSinDocente: number;
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
  personaId: number;
  nia: string;
  nombre: string;
  apellidoMaterno: string;
  apellidoPaterno: string;
  especialidad: string | null;
}