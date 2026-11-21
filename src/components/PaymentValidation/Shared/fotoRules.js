// Fechas SQL sin conversión de zona horaria: la asociación del SP es cuenta + día.
export const diaSQL = (fecha) => String(fecha || "").slice(0, 10);

export const parseFotos = (raw) => {
  const fotos = typeof raw === "string" ? JSON.parse(raw) : raw;
  if (fotos == null) return [];
  if (!Array.isArray(fotos)) throw new Error("El campo fotos no es un arreglo válido");
  return fotos;
};

export const esTipoFoto = (foto, tipo) =>
  String(foto?.tipo || "").toLowerCase().includes(tipo.toLowerCase());

// La API de consulta reemplaza nombreFoto por urlImagen en algunos resultados.
// Recuperar la clave del archivo no modifica ni reconstruye la URL firmada.
export const nombreFoto = (foto) => {
  if (Object.hasOwn(foto || {}, "nombreFoto")) return foto.nombreFoto;
  const url = foto?.urlImagen || foto?.url;
  if (!url) return null;
  try {
    return decodeURIComponent(new URL(url).pathname.split("/").pop()) || null;
  } catch {
    return null;
  }
};

const tiempoSQL = (fecha) => Date.parse(`${String(fecha || "").replace(/Z$/, "")}Z`);

export const fotoRepresentativa = (registro, tipo) => {
  const fecha = registro.fecha_de_gestion || registro.fecha_gestion;
  const candidatas = parseFotos(registro.fotos).filter(
    (foto) => diaSQL(foto.fechaCaptura) === diaSQL(fecha) && esTipoFoto(foto, tipo),
  );
  if (!candidatas.length) return null;
  const ultima = candidatas.reduce((prev, foto) =>
    tiempoSQL(foto.fechaCaptura) > tiempoSQL(prev.fechaCaptura) ? foto : prev,
  );
  // SQL no define desempate. Conservar la selección del servidor si está disponible.
  const urlActual = tipo === "fachada" ? registro.urlImagenFachada : registro.urlImagenEvidencia;
  return candidatas.find((foto) =>
    tiempoSQL(foto.fechaCaptura) === tiempoSQL(ultima.fechaCaptura) &&
    (foto.urlImagen || foto.url) === urlActual,
  ) || ultima;
};

export const recalcularFotos = (registro) => {
  const fachada = fotoRepresentativa(registro, "fachada");
  const evidencia = fotoRepresentativa(registro, "evidencia");
  const nombreFachada = nombreFoto(fachada);
  const nombreEvidencia = nombreFoto(evidencia);
  return {
    ...registro,
    "foto fachada predio": nombreFachada != null ? 1 : 0,
    "foto evidencia predio": nombreEvidencia != null ? 1 : 0,
    nombreFotoFachada: nombreFachada,
    nombreFotoEvidencia: nombreEvidencia,
    urlImagenFachada: nombreFachada != null ? fachada?.urlImagen || fachada?.url || null : null,
    urlImagenEvidencia: nombreEvidencia != null ? evidencia?.urlImagen || evidencia?.url || null : null,
  };
};

export const aplicarCambioFoto = (registros, cambio) => registros.map((registro) => {
  const fecha = registro.fecha_de_gestion || registro.fecha_gestion;
  if (registro.cuenta !== cambio.cuenta || !diaSQL(fecha) ||
      diaSQL(fecha) !== diaSQL(cambio.fechaGestion)) return registro;
  if (cambio.foto && diaSQL(cambio.foto.fechaCaptura) !== diaSQL(fecha)) {
    throw new Error("La fotografía debe conservar el día de la gestión");
  }
  const id = cambio.foto?.idRegistroFoto ?? cambio.idRegistroFoto;
  if (id == null) throw new Error("Falta el identificador de la fotografía guardada");
  const fotos = parseFotos(registro.fotos);
  const restantes = fotos.filter((foto) => String(foto.idRegistroFoto) !== String(id));
  const nuevasFotos = cambio.foto ? [...restantes, cambio.foto] : restantes;
  return recalcularFotos({ ...registro, fotos: JSON.stringify(nuevasFotos) });
});

export const fechaNuevaFoto = (fechaGestion, fotos) => {
  const dia = diaSQL(fechaGestion);
  const base = String(fechaGestion || "").slice(0, 19);
  const msBase = Date.parse(`${base}Z`);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(base) || !Number.isFinite(msBase)) {
    throw new Error("La gestión no tiene una fecha válida para agregar fotografías");
  }
  const existentes = fotos.map((foto) => {
    if (diaSQL(foto.fechaCaptura) !== dia) throw new Error("Hay fotos de otro día en la gestión");
    const tiempo = Date.parse(`${String(foto.fechaCaptura).slice(0, 19)}Z`);
    if (!Number.isFinite(tiempo)) throw new Error("Una fotografía tiene una fecha inválida");
    return tiempo;
  });
  // UTC se usa únicamente como aritmética de calendario, sin convertir la hora SQL.
  const fecha = new Date(Math.max(msBase, ...existentes) + 1000).toISOString().slice(0, 19);
  if (diaSQL(fecha) !== dia) throw new Error("No queda una hora posterior disponible en el día de la gestión");
  return fecha;
};
