// interfaces/especialidadInterface.ts

export interface ResponseEspecialidadDetalle {
  message: string;
  data: DataEspecialidadDetalle;
}

export interface DataEspecialidadDetalle {
  especialidad: InfoEspecialidad;
  anio: number;
  clasesPorSemestreGrupo: ClasesPorSemestreGrupo[];
  alumnosPorSemestreGrupo: Record<string, AlumnoEspecialidad[]>;
  planEstudios: Record<string, AsignaturaPlan[]>;
  estadisticas: EstadisticasEspecialidad;
}

export interface InfoEspecialidad {
  id: number;
  nombre: string;
}

export interface ClasesPorSemestreGrupo {
  semestre: number;
  grupo: string;
  idGrupoSemestre: number;
  clases: ClaseEspecialidad[];
}

export interface ClaseEspecialidad {
  idClase: number;
  anio: number;
  idAsignatura: number;
  nombreAsignatura: string;
  tipoAsignatura: string;
  idDocente: number | null;
  nombreDocente: string | null;
  alumnosInscritos: number;
}

export interface AlumnoEspecialidad {
  idAlumno: number;
  nia: string;
  nombreCompleto: string;
  semestreInicio: number;
}

export interface AsignaturaPlan {
  semestre: number;
  idAsignatura: number;
  nombreAsignatura: string;
}

export interface EstadisticasEspecialidad {
  totalClases: number;
  clasesConDocente: number;
  clasesSinDocente: number;
  totalAlumnos: number;
  semestreGrupos: number;
}

// Lista de especialidades
export interface Especialidad {
  id: number;
  nombre: string;
}

export interface ResponseEspecialidades {
  message: string;
  data: Especialidad[];
}