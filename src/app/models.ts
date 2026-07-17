export interface Colaborador {
  id: number;
  sucursal_id?: number;
  nombre: string;
  cui: string;
}

export interface Sucursal {
  id: number;
  empresa_id?: number;
  nombre: string;
  direccion: string;
  telefono: string;
  colaboradores: Colaborador[];
}
