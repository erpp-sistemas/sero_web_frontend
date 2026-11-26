// S02-H2.5: utilidades y textos de la pantalla "Plazas y servicios".

export const normalizar = (t) => (t ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const formato = new Intl.NumberFormat('es-MX')
export const numero = (n) => (n === null || n === undefined ? 'Sin dato' : formato.format(n))

export const plural = (n, uno, varios) => `${formato.format(n ?? 0)} ${n === 1 ? uno : varios}`

// Ruta del API y permiso por tipo de elemento.
export const TIPOS = {
	plaza: { api: 'plazas', recurso: 'plazas', nombre: 'plaza', articulo: 'la plaza', idCampo: 'id_plaza' },
	servicio: { api: 'servicios', recurso: 'servicios', nombre: 'servicio', articulo: 'el servicio', idCampo: 'id_servicio' },
	proceso: { api: 'procesos', recurso: 'procesos', nombre: 'proceso', articulo: 'el proceso', idCampo: 'id_proceso' },
	tarea: { api: 'tareas', recurso: 'tareas', nombre: 'tarea', articulo: 'la tarea', idCampo: 'id_tarea' },
}

// Qué pasa en la app al desactivar (diagnóstico de los SP de la app en producción, 2026-11-25; los SP no cambian):
// - cat_tarea.activo y proceso.activo los filtran el catálogo de tareas y los procesos de la plaza → se ocultan.
// - servicio.activo y plaza.activo no los filtra la app: muestra lo asignado en usuario_plaza_servicio_proceso.
// - Las asignaciones abiertas (id_estatus_asignacion = 1) llegan sin revisar si la tarea o el proceso están activos.
export const efectoEnApp = (tipo, impacto) => {
	if (!impacto) {
		// Sin conteos (la consulta falló): mismo aviso, sin cifras.
		return {
			tarea: ['Deja de aparecer en el catálogo de tareas de la app. Las asignaciones ya hechas con esta tarea siguen llegando a los gestores.'],
			proceso: ['Se desactiva en todas las plazas donde se usa.', 'Deja de aparecer en la app en esas plazas. Las asignaciones ya hechas siguen llegando a los gestores.'],
			servicio: ['Se desactiva en todas las plazas donde se usa.', 'Solo se oculta en la web. La app lo seguirá mostrando a quienes lo tienen asignado; para quitárselo, cambia su asignación en Usuarios.'],
			plaza: ['Solo se oculta en la web. La app la seguirá mostrando a quienes la tienen asignada; para quitársela, cambia su asignación en Usuarios.'],
		}[tipo] ?? []
	}
	const abiertas = numero(impacto?.asignaciones_abiertas)
	const personas = impacto?.personas ?? 0
	const plazas = impacto?.plazas ?? 0
	switch (tipo) {
		case 'tarea':
			return [
				'Deja de aparecer en el catálogo de tareas de la app la próxima vez que la app lo cargue.',
				`Las asignaciones ya hechas con esta tarea (${abiertas} abiertas) siguen llegando a los gestores.`,
			]
		case 'proceso':
			return [
				`Se desactiva en todas las plazas donde se usa (${plural(plazas, 'plaza', 'plazas')}).`,
				`Deja de aparecer en la app en ${plazas === 1 ? 'la plaza donde se usa' : `las ${plazas} plazas donde se usa`}. Las asignaciones ya hechas (${abiertas} abiertas) siguen llegando a los gestores.`,
			]
		case 'servicio':
			return [
				`Se desactiva en todas las plazas donde se usa (${plural(plazas, 'plaza', 'plazas')}).`,
				personas === 0
					? 'Solo se oculta en la web. Nadie lo tiene asignado, así que la app no lo muestra.'
					: `Solo se oculta en la web. La app lo seguirá mostrando a ${personas === 1 ? 'la persona que lo tiene asignado' : `las ${formato.format(personas)} personas que lo tienen asignado`}; para quitárselo, cambia su asignación en Usuarios.`,
			]
		case 'plaza':
			return [
				personas === 0
					? 'Solo se oculta en la web. Nadie la tiene asignada, así que la app no la muestra.'
					: `Solo se oculta en la web. La app la seguirá mostrando a ${personas === 1 ? 'la persona que la tiene asignada' : `las ${formato.format(personas)} personas que la tienen asignada`}; para quitársela, cambia su asignación en Usuarios.`,
			]
		default:
			return []
	}
}

export const textoHorario = (h) =>
	h ? `${h.horario_entrada ?? '—'} a ${h.horario_salida ?? '—'}${h.hora_entrada_tolerancia ? ` (tolerancia ${h.hora_entrada_tolerancia})` : ''}` : 'Sin horario'

// CSV del catálogo (permiso plazas.export): una fila por plaza › servicio › proceso.
export const csvCatalogo = (catalogo) => {
	const servicios = new Map(catalogo.servicios.map((s) => [s.id_servicio, s]))
	const procesos = new Map(catalogo.procesos.map((p) => [p.id_proceso, p]))
	const celda = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
	const estado = (a) => (a ? 'Activo' : 'Inactivo')
	const filas = [['Plaza', 'Estado plaza', 'Servicio', 'Estado servicio', 'Proceso', 'Estado proceso', 'Personas asignadas']]
	for (const p of catalogo.plazas) {
		if (!p.combinaciones.length) filas.push([p.nombre, estado(p.activo), '', '', '', '', p.personas])
		for (const c of p.combinaciones) {
			const s = servicios.get(c.id_servicio)
			const r = procesos.get(c.id_proceso)
			filas.push([p.nombre, estado(p.activo), s?.nombre, estado(s?.activo), r?.nombre, estado(r?.activo), c.personas])
		}
	}
	return `${String.fromCharCode(0xfeff)}${filas.map((f) => f.map(celda).join(',')).join('\r\n')}`
}
