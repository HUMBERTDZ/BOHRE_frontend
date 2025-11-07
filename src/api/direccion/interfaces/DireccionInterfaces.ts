export interface TopLevelMunicipios {
  message: string;
  data: Municipio[];
}

export interface Municipio {
  id: number;
  nombre: string;
}

export interface TopLevelLocalidades {
  message: string;
  data: Localidad[];
}

export interface Localidad {
  id: number;
  nombre: string;
}
