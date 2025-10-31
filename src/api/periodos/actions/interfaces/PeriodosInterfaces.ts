export interface GeneracionesResponse {
    message: string;
    data:    Generacion[];
}

export interface Generacion {
    id:           number;
    fechaIngreso: Date;
    fechaEgreso:  Date;
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

