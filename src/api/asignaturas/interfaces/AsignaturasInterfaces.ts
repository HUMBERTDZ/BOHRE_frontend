export interface ResponseAsignaturas {
  message: string;
  data: Data;
}

export interface Data {
  current_page: number;
  data: Asignatura[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface Asignatura {
  idAsignatura: number;
  nombre: string;
  tipo: string;
  idSemestre: number;
  semestre: number;
  idEspecialidad  : number | null;
  especialidad: number | null;
}

export interface Link {
  url: null | string;
  label: string;
  active: boolean;
}

export interface AsignaturaToStore {
  nombre: string;
  tipo: string;
  idSemestre: number;
  idEspecialidad: number | null;
}

export interface ResponseAsignaturaCreateOrUpdate {
  message: string;
  data: Asignatura;
}
