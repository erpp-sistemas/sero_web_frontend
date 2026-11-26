// S02-H2.5: catálogo de plazas, servicios, procesos y tareas (/admin/catalogo). Todas las llamadas llevan la sesión.
import axios from './axios'

export const obtenerCatalogoRequest = () => axios.get('/admin/catalogo')

// tipo: 'plazas' | 'servicios' | 'procesos' | 'tareas'
export const crearEnCatalogoRequest = (tipo, datos) => axios.post(`/admin/catalogo/${tipo}`, datos)

export const editarEnCatalogoRequest = (tipo, id, datos) => axios.put(`/admin/catalogo/${tipo}/${id}`, datos)

export const cambiarEstadoEnCatalogoRequest = (tipo, id, activo) => axios.patch(`/admin/catalogo/${tipo}/${id}/estado`, { activo })

export const impactoRequest = (tipo, id) => axios.get(`/admin/catalogo/${tipo}/${id}/impacto`)

export const agregarCombinacionRequest = (idPlaza, idServicio, idProceso) =>
	axios.post(`/admin/catalogo/plazas/${idPlaza}/combinaciones`, { id_servicio: idServicio, id_proceso: idProceso })
