import axios from './axios'

// Subidas a S3 sin llaves en el navegador (S00-H0.5):
// 1) el backend firma una URL de subida (POST /uploads/presign),
// 2) el navegador sube el archivo directo a S3 con PUT,
// 3) para verlo, el backend firma una URL temporal de lectura (GET /uploads/url).

export const presignUploadRequest = ({ carpeta, nombreArchivo, contentType }) =>
	axios.post('/uploads/presign', { carpeta, nombreArchivo, contentType })

export const urlArchivoRequest = (key, { segundos } = {}) =>
	axios.get('/uploads/url', { params: segundos ? { key, segundos } : { key } })

const TIPOS = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', pdf: 'application/pdf' }

// Tipo que acepta el backend; si el navegador no lo reporta, se deduce de la extensión.
const contentTypeDe = (file) => {
	if (Object.values(TIPOS).includes(file.type)) return file.type
	const extension = String(file.name || '').split('.').pop().toLowerCase()
	return TIPOS[extension] || file.type
}

// Nombre con extensión coherente con el tipo (el backend lo valida).
const nombreDe = (file, contentType) => {
	const nombre = String(file.name || 'archivo')
	const extension = nombre.split('.').pop().toLowerCase()
	const validas = contentType === 'image/jpeg' ? ['jpg', 'jpeg'] : contentType === 'image/png' ? ['png'] : ['pdf']
	return validas.includes(extension) ? nombre : `${nombre}.${validas[0]}`
}

/**
 * Sube un archivo al bucket de subidas y devuelve su key (carpeta/AAAA/MM/<uuid>.<ext>).
 * @param {File|Blob} file
 * @param {'usuarios'|'plazas'|'servicios'|'procesos'|'cuentas'} carpeta
 */
export const subirArchivo = async (file, carpeta) => {
	const contentType = contentTypeDe(file)
	const { data } = await presignUploadRequest({
		carpeta,
		nombreArchivo: nombreDe(file, contentType),
		contentType,
	})

	// PUT directo a S3: sin cookies ni encabezados de la API; el Content-Type va firmado.
	const respuesta = await fetch(data.uploadUrl, {
		method: 'PUT',
		headers: { 'Content-Type': contentType },
		body: file,
	})
	if (!respuesta.ok) throw new Error(`S3 rechazó la subida (${respuesta.status})`)

	return data.key
}

// URL temporal firmada para ver un archivo subido con subirArchivo.
export const obtenerUrlArchivo = async (key, opciones) => {
	const { data } = await urlArchivoRequest(key, opciones)
	return data
}
