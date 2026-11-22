// S02-H2.1: menús del usuario (los mismos que hoy devuelve /MenusUserId) agrupados para el menú lateral y el buscador.
import { useEffect, useMemo, useState } from 'react'
import { getMenusUserId } from '../services/menu.service'

// Agrupa como lo hacía el menú anterior: menús padre (parent_menu_id = 0) ordenados por "orden" y sus hijos debajo.
export const agruparMenus = (menus) => {
	const lista = Array.isArray(menus) ? menus : []
	const grupos = lista
		.filter((m) => m.parent_menu_id === 0)
		.sort((a, b) => (a.orden || 0) - (b.orden || 0))
		.map((m) => ({ id: m.menu_id, nombre: m.name, icono: m.icon_mui, items: [] }))
	const porId = new Map(grupos.map((g) => [g.id, g]))
	lista.forEach((m) => {
		if (m.parent_menu_id === 0) return
		const grupo = porId.get(m.parent_menu_id)
		if (grupo) {
			grupo.items.push({ id: m.menu_id, nombre: m.name, icono: m.icon_mui, ruta: m.route || '#', grupo: grupo.nombre })
		}
	})
	return grupos.filter((g) => g.items.length > 0)
}

// Ruta con "/" al inicio, para comparar con location.pathname (en la base hay rutas sin "/", p. ej. "account-details").
export const rutaAbsoluta = (ruta) => (ruta && !ruta.startsWith('/') && ruta !== '#' ? `/${ruta}` : ruta)

const useMenusUsuario = (idUsuario) => {
	const [menus, setMenus] = useState([])
	const [cargando, setCargando] = useState(true)
	const [error, setError] = useState(false)

	useEffect(() => {
		let vigente = true
		if (!idUsuario) {
			setMenus([])
			setCargando(false)
			return undefined
		}
		setCargando(true)
		setError(false)
		getMenusUserId(idUsuario)
			.then((res) => {
				if (!vigente) return
				// getMenusUserId devuelve undefined si la petición falla (atrapa el error).
				if (Array.isArray(res)) setMenus(res)
				else setError(true)
			})
			.finally(() => vigente && setCargando(false))
		return () => {
			vigente = false
		}
	}, [idUsuario])

	const grupos = useMemo(() => agruparMenus(menus), [menus])
	const pantallas = useMemo(() => grupos.flatMap((g) => g.items), [grupos])

	return { grupos, pantallas, cargando, error }
}

export default useMenusUsuario
