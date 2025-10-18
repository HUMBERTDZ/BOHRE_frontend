export interface ResponseEspecialidades {
    message: string;
    data:    Datum[];
}

export interface Datum {
    id:     number;
    nombre: string;
}
