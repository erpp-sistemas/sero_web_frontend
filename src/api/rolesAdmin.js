// S02-H2.6: roles y matriz de permisos de la web (/admin/roles). Todas las llamadas llevan la sesión.
import axios from './axios'

export const listarRolesRequest = () => axios.get('/admin/roles')

export const obtenerCatalogoRolesRequest = () => axios.get('/admin/roles/catalogo')

export const obtenerRolRequest = (id) => axios.get(`/admin/roles/${id}`)

export const vistaPreviaRolRequest = (id, permisos) => axios.post(`/admin/roles/${id}/vista-previa`, { permisos })

export const guardarPermisosRolRequest = (id, permisos, version) => axios.put(`/admin/roles/${id}/permisos`, { permisos, version })

export const crearRolRequest = (datos) => axios.post('/admin/roles', datos)

export const editarRolRequest = (id, datos) => axios.patch(`/admin/roles/${id}`, datos)

export const cambiarEstadoRolRequest = (id, activo) => axios.patch(`/admin/roles/${id}/estado`, { activo })
