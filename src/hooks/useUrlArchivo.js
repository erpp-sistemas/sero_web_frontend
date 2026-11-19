import { useEffect, useState } from "react"
import { obtenerUrlArchivo } from "../api/uploads"

// Lo que viene de la base puede ser:
//  - una URL (vieja, o ya firmada por el backend) → se usa tal cual;
//  - una key de /uploads/presign (carpeta/AAAA/MM/<uuid>.<ext>) → se pide una URL temporal al backend;
//  - vacío o algo desconocido → sin imagen.
const PATRON_KEY =
	/^(usuarios|plazas|servicios|procesos|cuentas)\/\d{4}\/\d{2}\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|pdf)$/

export const esUrl = (valor) => typeof valor === "string" && /^(https?:|data:|blob:)/i.test(valor)
export const esKey = (valor) => typeof valor === "string" && PATRON_KEY.test(valor)

// Caché en memoria por key: se reutiliza la URL hasta 1 minuto antes de que venza.
const cache = new Map()
const MARGEN_MS = 60 * 1000

const urlDeKey = (key) => {
	const guardada = cache.get(key)
	if (guardada && (guardada.promesa || guardada.venceEn - MARGEN_MS > Date.now())) {
		return guardada.promesa ?? Promise.resolve(guardada.url)
	}
	const promesa = obtenerUrlArchivo(key)
		.then(({ url, expiresIn }) => {
			cache.set(key, { url, venceEn: Date.now() + expiresIn * 1000 })
			return url
		})
		.catch((error) => {
			cache.delete(key)
			throw error
		})
	cache.set(key, { promesa })
	return promesa
}

/**
 * @param {string|null|undefined} valor key o URL guardada en la base
 * @returns {{ url: string|null, estado: 'vacio'|'cargando'|'listo'|'error' }}
 */
export const useUrlArchivo = (valor) => {
	const inicial = esUrl(valor)
		? { url: valor, estado: "listo" }
		: esKey(valor)
			? { url: null, estado: "cargando" }
			: { url: null, estado: "vacio" }
	const [resultado, setResultado] = useState(inicial)

	useEffect(() => {
		let vigente = true
		if (esUrl(valor)) {
			setResultado({ url: valor, estado: "listo" })
		} else if (esKey(valor)) {
			setResultado({ url: null, estado: "cargando" })
			urlDeKey(valor)
				.then((url) => vigente && setResultado({ url, estado: "listo" }))
				.catch(() => vigente && setResultado({ url: null, estado: "error" }))
		} else {
			setResultado({ url: null, estado: "vacio" })
		}
		return () => {
			vigente = false
		}
	}, [valor])

	return resultado
}
