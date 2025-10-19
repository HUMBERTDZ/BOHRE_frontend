export interface ResponseSemestres {
    message: string;
    data:    Semestre[];
}

export interface Semestre {
    id:      number;
    numero:  number;
    periodo: string;
}
