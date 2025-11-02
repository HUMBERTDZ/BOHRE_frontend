export interface DashBoardResponse {
  success: boolean;
  data: Data;
}

export interface Data {
  general: General;
  graficos: Graficos;
}

export interface General {
  totalAlumnos: number;
  alumnosActivos: number;
  alumnosEgresados: number;
  totalDocentes: number;
  clasesActivas: number;
  promedioGeneral: number;
  semestresActivos: number[];
}

export interface Graficos {
  alumnosPorSemestre: AlumnosPorSemestre[];
  alumnosPorEspecialidad: AlumnosPorEspecialidad[];
  alumnosPorGrupo: AlumnosPorGrupo[];
  distribucionCalificaciones: DistribucionCalificacione[];
  alumnosPorSexo: SPorSexo[];
  docentesPorSexo: SPorSexo[];
}

export interface AlumnosPorEspecialidad {
  especialidad: string;
  total: number;
}

export interface AlumnosPorGrupo {
  grupo: string;
  total: number;
}

export interface AlumnosPorSemestre {
  semestre: string;
  total: number;
}

export interface SPorSexo {
  sexo: string;
  total: number;
}

export interface DistribucionCalificacione {
  rango: string;
  total: number;
}
