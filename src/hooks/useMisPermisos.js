// S02-H2.3 / H2.6: permisos de la persona que tiene la sesión (GET /me/permisos), para mostrar u ocultar acciones.
// El backend vuelve a revisar cada permiso: esto solo decide qué se ve.
// Una sola petición compartida por todos los componentes de la página (vigencia corta, como el caché del servidor);
// recargar() la descarta y vuelve a pedir. Al cambiar de sesión (token) se pide de nuevo.
import { useCallback, useEffect, useState } from 'react'
import { obtenerMisPermisosRequest } from '../api/usuariosAdmin'

const VIGENCIA_MS = 30 * 1000
let compartido = null // { token, promesa, hasta }

const tokenActual = () => {
	try {
		return localStorage.getItem('token') ?? ''
	} catch {
		return ''
	}
}

const pedir = (forzar = false) => {
	const token = tokenActual()
	if (!forzar && compartido && compartido.token === token && compartido.hasta > Date.now()) return compartido.promesa
	const promesa = obtenerMisPermisosRequest().then(({ data }) => data)
	compartido = { token, promesa, hasta: Date.now() + VIGENCIA_MS }
	promesa.catch(() => {
		if (compartido?.promesa === promesa) compartido = null
	})
	return promesa
}

// Para llamar después de cambiar permisos propios (o al cerrar sesión).
export const olvidarMisPermisos = () => {
	compartido = null
}

const vacio = { permisos: new Set(), acciones: {}, idUsuario: null, idRol: null, nivel: 0, idRolPersonalizado: null, rolPersonalizado: null, alcanceTotal: false, alcance: [] }

const useMisPermisos = () => {
	const [estado, setEstado] = useState({ cargando: true, error: false, ...vacio })

	const cargar = useCallback((forzar = false) => {
		let vigente = true
		// Al recargar con datos ya cargados no se vuelve a "cargando" (la pantalla no se reinicia)
		setEstado((e) => ({ ...e, cargando: e.idUsuario == null, error: false }))
		pedir(forzar)
			.then((data) => {
				if (!vigente) return
				setEstado({
					cargando: false,
					error: false,
					permisos: new Set(data.permisos || []),
					acciones: data.acciones || {},
					idUsuario: data.id_usuario,
					idRol: data.id_rol,
					nivel: data.nivel ?? 0,
					idRolPersonalizado: data.id_rol_personalizado ?? null,
					rolPersonalizado: data.rol_personalizado ?? null,
					alcanceTotal: Boolean(data.alcance_total),
					alcance: data.alcance || [],
				})
			})
			.catch(() => {
				if (vigente) setEstado((e) => ({ ...e, cargando: false, error: true }))
			})
		return () => {
			vigente = false
		}
	}, [])

	useEffect(() => cargar(), [cargar])

	const tiene = useCallback((codigo) => estado.permisos.has(codigo), [estado.permisos])
	// puede('usuarios', 'create') — recurso + acción
	const puede = useCallback((recurso, accion) => estado.permisos.has(`${recurso}.${accion}`), [estado.permisos])

	return { ...estado, tiene, puede, recargar: () => cargar(true) }
}

export default useMisPermisos
