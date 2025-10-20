export interface ResponseAlumnosGrupos {
    message: string;
    data:    Data;
}

export interface Data {
    idGrupoSemestre: number;
    grupo:           string;
    semestre:        number;
    periodoSemestre: string;
    alumnos:         Alumno[];
}

export interface Alumno {
    id:              number;
    nia:             string;
    nombre:          string;
    apellidoMaterno: string;
    apellidoPaterno: string;
}
