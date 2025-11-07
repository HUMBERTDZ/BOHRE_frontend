export interface DashboardResponse {
  success: boolean;
  data:    Data;
}

export interface Data {
  general:  General;
  graficos: Graficos;
}

export interface General {
  totalAlumnos:     number;
  alumnosActivos:   number;
  alumnosEgresados: number;
  totalDocentes:    number;
  clasesActivas:    number;
  promedioGeneral:  number;
  semestresActivos: number[];
}

export interface Graficos {
  alumnosPorSemestre:         AlumnosPorSemestre[];
  alumnosPorEspecialidad:     AlumnosPorEspecialidad[];
  alumnosPorGrupo:            AlumnosPorGrupo[];
  distribucionCalificaciones: DistribucionCalificacione[];
  alumnosPorSexo:             SPorSexo[];
  docentesPorSexo:            SPorSexo[];
}

export interface AlumnosPorEspecialidad {
  especialidad: string;
  total:        number;
  [key: string]: string | number; // Agregar esto
}

export interface SPorSexo {
  sexo:  string;
  total: number;
  [key: string]: string | number; // Agregar esto
}

export interface AlumnosPorGrupo {
  grupo: string;
  total: number;
  [key: string]: string | number; // Agregar esto
}

export interface AlumnosPorSemestre {
  semestre: string;
  total:    number;
  [key: string]: string | number; // Agregar esto
}

export interface DistribucionCalificacione {
  rango: string;
  total: number;
  [key: string]: string | number; // Agregar esto
}