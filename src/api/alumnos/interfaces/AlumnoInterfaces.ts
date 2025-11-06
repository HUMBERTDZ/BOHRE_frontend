export interface AlumnoSemestreResponse {
    success: boolean;
    data:    Data;
}

export interface Data {
    alumno:    Alumno;
    semestres: Semestre[];
}

export interface Alumno {
    id:           number;
    nia:          string;
    nombre:       string;
    curp:         string;
    situacion:    string;
    especialidad: string;
}

export interface Semestre {
    idGrupoSemestre:     number;
    semestre:            number;
    grupo:               string;
    grupoSemestre:       string;
    periodo:             string;
    totalCalificaciones: number;
    tieneCalificaciones: boolean;
}

