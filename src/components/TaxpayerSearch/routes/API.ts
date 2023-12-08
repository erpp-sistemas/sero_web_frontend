import useApiRequest from "./useApiRequest";

const request = useApiRequest();

export const GETContribuyente = () => {
  return request({
    url: 'contribuyente',
    method: 'get',
  })
};

export const GETPagoContribuyente = () => {
  return request({
    url: 'contribuyente/pago',
    method: 'get',
  })
};

export const GETEvidenciasImagenes = () => {
  return request({
    url: 'evidencias/imagenes',
    method: 'get',
  })
};

export const POSTSubirEvidenciaImagen = () => {
  return request({
    url: 'evidencias/imagenes',
    method: 'get',
  })
};

export const POSTHabilitarEvidenciaImagen = () => {
  return request({
    url: 'evidencias/imagenes',
    method: 'get',
  })
};

export const POSTDeshabilitarEvidenciaImagen = () => {
  return request({
    url: 'evidencias/imagenes',
    method: 'get',
  })
};