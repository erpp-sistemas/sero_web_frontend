// Las banderas procesadas por el servidor determinan el estado de la gestión.
export const obtenerEstadoFotos = (registro) => {
  const fachada = Number(registro["foto fachada predio"]) === 1;
  const evidencia = Number(registro["foto evidencia predio"]) === 1;

  if (fachada && evidencia) return "con_ambas";
  if (fachada) return "solo_fachada";
  if (evidencia) return "solo_evidencia";
  return "sin_fotos";
};
