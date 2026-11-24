// S02-H2.3: permisos de la persona que tiene la sesión (GET /me/permisos), para mostrar u ocultar acciones.
// El backend vuelve a revisar cada permiso: esto solo decide qué se ve.
import { useCallback, useEffect, useState } from 'react'
import { obtenerMisPermisosRequest } from '../api/usuariosAdmin'

const useMisPermisos = () => {
	const [estado, setEstado] = useState({ cargando: true, error: false, permisos: new Set(), idUsuario: null, idRol: null, alcanceTotal: false, alcance: [] })

	const cargar = useCallback(() => {
		let vigente = true
		setEstado((e) => ({ ...e, cargando: true, error: false }))
		obtenerMisPermisosRequest()
			.then(({ data }) => {
				if (!vigente) return
				setEstado({
					cargando: false,
					error: false,
					permisos: new Set(data.permisos || []),
					idUsuario: data.id_usuario,
					idRol: data.id_rol,
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

	return { ...estado, tiene, recargar: cargar }
}

export default useMisPermisos
