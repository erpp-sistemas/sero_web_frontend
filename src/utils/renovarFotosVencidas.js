import { renovarUrlFotoRequest } from '../api/uploads'

// Fotos con URL firmada al momento (S01-H1.6): el backend entrega URLs que vencen en 15 minutos.
// Si una pestaña queda abierta más tiempo, la foto deja de abrir (S3 responde 403). Este listener
// global detecta el error de cualquier <img> de las fotos del sistema, pide una URL nueva al backend
// y la pone en la imagen. Un solo intento por URL, para no entrar en ciclo.
const FOTO_DEL_SISTEMA = /^https:\/\/(fotos-sero-movil|fotos-usuarios-sero)\.s3[.-][^/]*amazonaws\.com\//i

export const instalarRenovacionDeFotos = () => {
	if (window.__renovacionDeFotosInstalada) return
	window.__renovacionDeFotosInstalada = true

	window.addEventListener(
		'error',
		async (evento) => {
			const img = evento.target
			if (!(img instanceof HTMLImageElement)) return
			const src = img.currentSrc || img.src
			if (!FOTO_DEL_SISTEMA.test(src) || img.dataset.fotoRenovada === src) return
			img.dataset.fotoRenovada = src
			try {
				const { data } = await renovarUrlFotoRequest(src)
				if (data?.url) {
					img.dataset.fotoRenovada = data.url
					img.src = data.url
				}
			} catch {
				// Si no se pudo renovar, la imagen se queda como estaba (rota).
			}
		},
		true // fase de captura: los errores de <img> no burbujean hasta window
	)
}
