export interface MateriasDocenteResponse {
    success: boolean;
    data:    Data;
}

export interface Data {
    docente:              Docente;
    estadisticas:         Estadisticas;
    materiasComunes:      MateriasComune[];
    materiasEspecialidad: MateriasEspecialidad[];
}

export interface Docente {
    id:     number;
    nombre: string;
}

export interface Estadisticas {
    totalClases:       number;
    totalAlumnos:      number;
    materiasUnicas:    number;
    totalComunes:      number;
    totalEspecialidad: number;
}

export interface MateriasComune {
    semestre:        number;
    grupo:           string;
    grupoSemestre:   string;
    idGrupoSemestre: number;
    materias:        Materia[];
}

export interface Materia {
    idClase:          number;
    idAsignatura:     number;
    nombreAsignatura: string;
    totalAlumnos:     number;
}

export interface MateriasEspecialidad {
    especialidad:   string;
    idEspecialidad: number;
    semestre:       number;
    grupos:         Grupo[];
}

export interface Grupo {
    idGrupoSemestre: number;
    grupo:           string;
    materias:        Materia[];
}
