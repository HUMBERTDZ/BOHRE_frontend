// interfaces/User.ts
export interface User {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  curp: string;
  sexo: string;
  nss: string;
  rol: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginatedData<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface ResponseUserPaginated {
  message: string;
  data: PaginatedData<User>;
}


// cuando se agrega un usuario esta es la respuesta http
export interface ResponseAddUser {
  message: string;
  data: User;
}


export interface ResponseUserSemiComplete {
  message: string;
  data:    UserSemiComplete;
}

export interface UserSemiComplete {
  id:                number;
  nombre:            string;
  apellidoPaterno:   string;
  apellidoMaterno:   string;
  curp:              string;
  telefono:          string;
  sexo:              string;
  fechaNacimiento:   Date;
  nss:               string;
  correo:            string;
  rol:               string;
  idMunicipio:       number;
  municipio:         string;
  idLocalidad:       number;
  localidad:         string;
  codigoPostal:      number;
  numeroCasa:        number;
  calle:             string;
  cedulaProfesional?: string | null;
  numeroExpediente?:  number | null;
  nia?:  string | null;
  situacion?:  string | null;
  idGrupoSemestre: number | null;
  numeroSemestre: number | null;
  periodoSemestre: string | null;
  idGeneracion: number | null;
  fechaIngresoGeneracion: string | null;
  fechaEgresoGeneracion: string | null;
  idEspecialidad: number | null;
  especialidadNombre: string | null;
}
