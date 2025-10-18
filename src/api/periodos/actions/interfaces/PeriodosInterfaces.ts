export interface PeriodosResponse {
    message: string;
    data:    Datum[];
}

export interface Datum {
    id:           number;
    fechaIngreso: Date;
    fechaEgreso:  Date;
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

