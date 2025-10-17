// interfaces/User.ts
export interface Usuario {
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
  data: PaginatedData<Usuario>;
}

export interface ResponseUsersDeleted {
  message: string;
  data: Usuario[];
}

// cuando se agrega un usuario esta es la respuesta http
export interface ResponseAddUser {
  message: string;
  data: Usuario;
}

export interface GeneralResponse {
  message: string;
  data: null;
}