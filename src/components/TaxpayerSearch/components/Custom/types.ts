export interface Direccion {
  "Calle": string;
  "Numero Exterior": string;
  "Numero Interior": string;
  "Colonia": string;
  "Poblacion": string;
  "Codigo Postal": string;
  "Manzana": string;
  "Lote": string;
  "Entre Calle 1": string;
  "Entre Calle 2": string;
  "Referencia": string;
}

export interface contribuyente {
  id_contribuyente: number
  cuenta: string
  clave_catastral: string
  propietario: string
  tipo_servicio: string
  tipo_tarifa: string
  giro: string
  serie_medidor: string
  id_estatus_cuenta: number
  activo: boolean
  id_servicio: number
  fecha_ingreso: string
}


export type TipoServicio = "Regularización predio" | "Regularización agua" | string
export interface TipoDatosContribuyente {
  "Cuenta": string
  "Clave Catastral": string
  "Propietario": string
  "Tipo de Servicio": string
  "Tipo de Tarifa": string
  "Giro": string
  "Serie del medidor": string
  "Servicio": TipoServicio
  "Domicilio": string;
}


export interface TipoPago {
  fechaDePago: string,
  descripcion: string,
  montoPagado: number,
}
export type TipoPagos = TipoPago[]
export type TipoTablaPagos = {
  filas: TipoPago[]
}

export interface TipoDomicilio {
  "Calle": string;
  "Numero Exterior": number;
  "Numero Interior": number | null;
  "Colonia": string;
  "Poblacion": string;
  "Codigo Postal": string;
  "Manzana": string;
  "Lote": string;
  "Entre Calle 1": string;
  "Entre Calle 2": string;
  "Referencia": string;
}


export interface TipoAdeudo {
  fechaActualizacion: string;
  fechaCorte: string;
  montoAdeudo: number;
}
export type TipoAdeudos = TipoAdeudo[];
export type TipoTablaAdeudos = {
  filas: TipoAdeudo[];
}
