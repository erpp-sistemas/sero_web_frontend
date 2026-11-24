// S02-H2.6: estructura y reglas de la cuadrícula de permisos (grupos › pantallas × acciones).
// Reglas iguales a las del backend: una acción necesita "ver" su pantalla y una pantalla necesita "ver" su grupo.
//   Al marcar algo se marcan en cadena lo que necesita; al desmarcar un "ver" se desmarca lo que depende de él.

// Desde el catálogo plano de /admin/usuarios/catalogos (permisos con recurso, recurso_tipo, grupo y codigo_padre)
// arma [{ codigo, nombre, acciones: [{accion, codigo}], pantallas: [{ codigo, nombre, acciones }] }] en el mismo orden.
export const arbolDesdePermisos = (permisos) => {
	const grupos = []
	const porGrupo = new Map()
	const porPantalla = new Map()
	const grupoDe = (codigoGrupo, nombre) => {
		let g = porGrupo.get(codigoGrupo)
		if (!g) {
			g = { codigo: codigoGrupo, nombre, acciones: [], pantallas: [] }
			porGrupo.set(codigoGrupo, g)
			grupos.push(g)
		}
		return g
	}
	for (const p of permisos) {
		if (!p.recurso) continue
		if (p.recurso_tipo === 'grupo') {
			grupoDe(p.recurso, p.recurso_nombre).acciones.push({ accion: p.accion, codigo: p.codigo })
			continue
		}
		let pantalla = porPantalla.get(p.recurso)
		if (!pantalla) {
			// El grupo de una pantalla: el recurso del "ver" del que depende su "ver"
			const lectura = permisos.find((x) => x.recurso === p.recurso && x.accion === 'read')
			const codigoGrupo = lectura?.codigo_padre?.split('.')[0] ?? `sin_grupo_${p.grupo}`
			pantalla = { codigo: p.recurso, nombre: p.recurso_nombre, acciones: [] }
			porPantalla.set(p.recurso, pantalla)
			grupoDe(codigoGrupo, p.grupo).pantallas.push(pantalla)
		}
		pantalla.acciones.push({ accion: p.accion, codigo: p.codigo })
	}
	return grupos
}

// Mapa codigo → lo que necesita (padre) y codigo → lo que depende de él (hijos).
export const dependenciasDe = (grupos) => {
	const padre = new Map()
	const hijos = new Map()
	const enlazar = (h, p) => {
		if (!p || h === p) return
		padre.set(h, p)
		hijos.set(p, [...(hijos.get(p) ?? []), h])
	}
	for (const g of grupos) {
		const verGrupo = g.acciones.find((a) => a.accion === 'read')?.codigo
		for (const a of g.acciones) if (a.accion !== 'read') enlazar(a.codigo, verGrupo)
		for (const p of g.pantallas) {
			const ver = p.acciones.find((a) => a.accion === 'read')?.codigo
			enlazar(ver, verGrupo)
			for (const a of p.acciones) if (a.accion !== 'read') enlazar(a.codigo, ver)
		}
	}
	return { padre, hijos }
}

// Devuelve el conjunto nuevo después de marcar (true) o desmarcar (false) un código, con sus dependencias.
export const aplicarCambio = (conjunto, codigo, valor, { padre, hijos }) => {
	const nuevo = new Set(conjunto)
	if (valor) {
		for (let c = codigo, vueltas = 0; c && vueltas < 5; c = padre.get(c), vueltas += 1) nuevo.add(c)
	} else {
		const pila = [codigo]
		while (pila.length) {
			const c = pila.pop()
			nuevo.delete(c)
			pila.push(...(hijos.get(c) ?? []))
		}
	}
	return nuevo
}

// Columnas que se usan (en el orden del catálogo de acciones)
export const columnasUsadas = (grupos, acciones) => {
	const usadas = new Set(grupos.flatMap((g) => [...g.acciones, ...g.pantallas.flatMap((p) => p.acciones)]).map((a) => a.accion))
	return acciones.filter((a) => usadas.has(a.codigo))
}

// Catálogo de acciones por omisión (por si la pantalla no lo trae): código en inglés, nombre en español.
export const ACCIONES = [
	{ codigo: 'read', nombre: 'Ver', es_especial: false },
	{ codigo: 'export', nombre: 'Exportar', es_especial: false },
	{ codigo: 'create', nombre: 'Crear', es_especial: false },
	{ codigo: 'update', nombre: 'Editar', es_especial: false },
	{ codigo: 'deactivate', nombre: 'Desactivar', es_especial: false },
	{ codigo: 'delete', nombre: 'Borrar definitivamente', es_especial: true },
	{ codigo: 'approve', nombre: 'Aprobar', es_especial: true },
]

// Nombre legible de un código ("pagos_validos.export" → "Pagos Validos: Exportar")
export const nombrePermiso = (codigo, grupos, acciones = ACCIONES) => {
	const [recurso, accion] = codigo.split('.')
	let nombre = recurso
	for (const g of grupos) {
		if (g.codigo === recurso) nombre = g.nombre
		const p = g.pantallas.find((x) => x.codigo === recurso)
		if (p) nombre = `${g.nombre} › ${p.nombre}`
	}
	return `${nombre}: ${acciones.find((a) => a.codigo === accion)?.nombre ?? accion}`
}
