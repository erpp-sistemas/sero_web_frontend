import { subirArchivo, obtenerUrlArchivo } from "../api/uploads"

// Sin llaves de AWS en el navegador (S00-H0.5): todo pasa por el backend con URLs firmadas.

// Vigencia de la URL que hoy se guarda en plaza/servicio/proceso.imagen (7 días, como antes).
// Se mantiene así hasta confirmar qué lee la app móvil (sero_movil); ver docs/PROGRESO.md.
const VIGENCIA_URL_GUARDADA_SEGUNDOS = 7 * 24 * 60 * 60

/**
 * Sube un archivo a S3 y devuelve su key. Es lo que se guarda en la base (p. ej. usuario.foto).
 * @param {File|Blob} file
 * @param {'usuarios'|'plazas'|'servicios'|'procesos'|'cuentas'} carpeta
 */
export const uploadToS3 = async (file, carpeta) => {
	try {
		return await subirArchivo(file, carpeta)
	} catch (err) {
		console.error("Error al subir archivo:", err.message)
		throw err
	}
}

/**
 * Comportamiento anterior para plaza, servicio y proceso: sube y devuelve una URL firmada de 7 días.
 * @param {File|Blob} file
 * @param {'plazas'|'servicios'|'procesos'} carpeta
 */
export const uploadToS3ComoUrl = async (file, carpeta) => {
	const key = await uploadToS3(file, carpeta)
	const { url } = await obtenerUrlArchivo(key, { segundos: VIGENCIA_URL_GUARDADA_SEGUNDOS })
	return url
}
