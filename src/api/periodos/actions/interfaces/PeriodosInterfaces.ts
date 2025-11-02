export interface GeneracionCreateResponse {
    message: string;
    data:    Generacion;
}
export interface GeneracionesResponse {
    message: string;
    data:    Generacion[];
}

export interface Generacion {
    id:           number;
    fechaIngreso: Date;
    fechaEgreso:  Date;
    numeroAlumnos?: number;
}

export interface ResponseSemestres {
    message: string;
    data:    Semestre[];
}

export interface Semestre {
    id:      number;
    numero:  number;
    periodo: string;
}


export interface ResponseGrupoSemestres {
    message: string;
    data:    DataGrupoSemestre[];
}

export interface DataGrupoSemestre {
    id:              number;
    nombreGrupo:     string;
    numeroSemestre:  number;
    periodoSemestre: string;
}

export interface GenerationsAlumnosResponse {
    message: string;
    data:    Datum[];
}

export interface Datum {
    id:              number;
    nia:             string;
    nombre:          string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    idGeneracion:    number;
    fechaIngreso:    Date;
    fechaEgreso:     Date;
}


export interface ResponseSemestresRaw {
    message: string;
    data:    Datum[];
}

export interface Datum {
    id:        number;
    numero:    number;
    mesInicio: number;
    diaInicio: number;
    mesFin:    number;
    diaFin:    number;
}
