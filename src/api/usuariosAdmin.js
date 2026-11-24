// S02-H2.4: usuarios de la web (/admin/usuarios). Todas las llamadas llevan la sesión (cookie).
import axios from './axios'
import { updateActiveUserRequest } from './auth'

export const obtenerMisPermisosRequest = () => axios.get('/me/permisos')

// S02-H2.6: menú lateral calculado con permisos (misma forma que /MenusUserId)
export const obtenerMiMenuRequest = () => axios.get('/me/menu')

export const obtenerCatalogosUsuariosRequest = () => axios.get('/admin/usuarios/catalogos')

export const listarUsuariosRequest = ({ buscar, idRol, idPlaza, estado } = {}) =>
	axios.get('/admin/usuarios', {
		params: {
			...(buscar ? { buscar } : {}),
			...(idRol ? { id_rol: idRol } : {}),
			...(idPlaza ? { id_plaza: idPlaza } : {}),
			estado: estado || 'activo',
		},
	})

export const obtenerUsuarioRequest = (id) => axios.get(`/admin/usuarios/${id}`)

export const crearUsuarioRequest = (datos) => axios.post('/admin/usuarios', datos)

export const editarUsuarioRequest = (id, datos) => axios.put(`/admin/usuarios/${id}`, datos)

export const cambiarEstadoUsuarioRequest = (id, activo) => axios.patch(`/admin/usuarios/${id}/estado`, { activo })

export const cambiarAccesoAppRequest = (id, activo, contrasena) =>
	axios.patch(`/admin/usuarios/${id}/acceso-app`, contrasena ? { activo, contrasena } : { activo })

// Firebase (usuario de la app móvil): se usa el endpoint de siempre, igual que la pantalla anterior.
// En desarrollo NO se llama: src/firebase.json del backend apunta al proyecto de producción.
export const SINCRONIZA_APP = !import.meta.env.DEV

export const sincronizarAppRequest = async ({ idUsuario, nombreCompleto, usuario, contrasena, tipo, activo }) => {
	if (!SINCRONIZA_APP) return { omitido: true }
	await updateActiveUserRequest(idUsuario, nombreCompleto, usuario, contrasena ?? '', tipo, activo ? 'activo' : 'inactivo')
	return { omitido: false }
}

// Mensaje legible de un error de la API (lista de mensajes o { message }).
export const mensajeDeError = (error, porDefecto = 'Error del servidor, intenta de nuevo') => {
	const data = error?.response?.data
	if (Array.isArray(data) && data.length) return data.join(' ')
	if (data && typeof data.message === 'string') return data.message
	if (!error?.response) return 'No hay conexión con el servidor, intenta de nuevo'
	return porDefecto
}
