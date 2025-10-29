export interface GruposSemestresResponse {
  message: string;
  data: Data;
}

export interface Data {
  current_page: number;
  data: Datum[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: null;
  to: number;
  total: number;
}

export interface Datum {
  idGrupoSemestre: number;
  idGrupo: number;
  idSemestre: number;
  grupo: string;
  semestre: number;
  periodoSemestre: string;
  cicloEscolar: string;
  numeroAlumnos: number;
  numeroAsignaturas: number;
}

export interface Link {
  url: null | string;
  label: string;
  active: boolean;
}
