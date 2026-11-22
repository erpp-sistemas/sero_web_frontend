// S02-H2.1: contexto de trabajo elegido en la barra superior (Plaza › Servicio › Proceso).
// Se guarda entre sesiones (redux-persist) y se limpia al iniciar o cerrar sesión.
// Las opciones salen de user.place_service_process (lo que el usuario tiene asignado).
import { createSlice } from '@reduxjs/toolkit'
import { setUser } from '../user/userSlice'

const initialState = { id_plaza: null, id_servicio: null, id_proceso: null }

export const contextoSlice = createSlice({
	name: 'contexto',
	initialState,
	reducers: {
		setContexto: (state, action) => {
			const { id_plaza = null, id_servicio = null, id_proceso = null } = action.payload || {}
			state.id_plaza = id_plaza
			state.id_servicio = id_servicio
			state.id_proceso = id_proceso
		},
	},
	extraReducers: (builder) => {
		// setUser solo se usa al iniciar sesión y al cerrarla: el contexto anterior ya no aplica.
		builder.addCase(setUser, () => initialState)
	},
})

export const { setContexto } = contextoSlice.actions
export default contextoSlice.reducer

// Devuelve el contexto elegido resuelto contra lo asignado al usuario.
// Si lo guardado ya no existe (p. ej. cambió su asignación), toma la primera opción disponible.
export const resolverContexto = (asignado, contexto) => {
	const plazas = Array.isArray(asignado) ? asignado : []
	const plaza = plazas.find((p) => p.id_plaza === contexto?.id_plaza) || plazas[0] || null
	const servicios = plaza?.servicios || []
	const servicio = servicios.find((s) => s.id_servicio === contexto?.id_servicio) || servicios[0] || null
	const procesos = servicio?.procesos || []
	const proceso = procesos.find((p) => p.id_proceso === contexto?.id_proceso) || procesos[0] || null
	return { plaza, servicio, proceso }
}
