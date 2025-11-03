// interfaces/calificacionesInterface.ts

export interface ResponseCalificaciones {
  message: string;
  data: DataCalificaciones;
}

export interface DataCalificaciones {
  clase: InfoClase;
  calificaciones: Calificacion[];
  estadisticas: EstadisticasClase;
}

export interface InfoClase {
  id: number;
  anio: number;
  asignatura: string;
  tipoAsignatura: string;
  semestre: number;
  grupo: string;
  especialidad: string | null;
  docente: string | null;
}

export interface Calificacion {
  idCalificacion: number;
  idAlumno: number;
  nia: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombreCompleto: string;
  especialidad: string | null;
  momento1: number;
  momento2: number;
  momento3: number;
  promedio: number;
  estado: "APROBADO" | "REPROBADO";
}

export interface EstadisticasClase {
  totalAlumnos: number;
  aprobados: number;
  reprobados: number;
  promedioGrupal: number;
  momento1Promedio: number;
  momento2Promedio: number;
  momento3Promedio: number;
}

export interface ResponseCalificacionesByClase {
  success: boolean;
  data:    Data;
}

export interface Data {
  clase:        Clase;
  alumnos:      Alumno[];
  estadisticas: Estadisticas;
}

export interface Alumno {
  idAlumno: number;
  nia:      string;
  nombre:   string;
  momento1: number;
  momento2: number;
  momento3: number;
  promedio: number;
}

export interface Clase {
  id:           number;
  asignatura:   string;
  grupo:        string;
  semestre:     number;
  especialidad: null;
  anio:         number;
}

export interface Estadisticas {
  totalAlumnos:  number;
  promedioGrupo: number;
  aprobados:     number;
  reprobados:    number;
}
