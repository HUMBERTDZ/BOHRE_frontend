export interface ResponseEspecialidades {
    message: string;
    data:    Especialidad[];
}

export interface ResponseCreateEspecialidad {
    message: string;
    data:    Especialidad;
}

export interface Especialidad {
    id:     number;
    nombre: string;
}


export interface AsignaturasEspecialidades {
    message: string;
    data:    Datum[];
}

export interface Datum {
    id:             number;
    asignatura:     string;
    tipo:           string;
    idEspecialidad: number;
    especialidad:   string;
    semestre:       number;
}
