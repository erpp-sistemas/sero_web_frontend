import { pagosVerificacionInicialState } from '../initialStates/pagosVerificacionStates.js'

const pagosVerificacionSlice = (state = pagosVerificacionInicialState, action) => {

	switch (action.type) {

		case 'SET_PAGOS_VERIFICACION':
			return {
				...state,
				pagosVerificacion: action.payload,
			}
		case 'SET_MES_VERIFICACION':
			return {
				...state,
				mesVerificacion: action.payload,
			}
		case 'SET_AÑO_VERIFICACION':
			return {
				...state,
				añoVerificacion: action.payload,
			}
		case 'SET_COSTO_VERIFICACION':
			return {
				...state,
				costoVerificacion: action.payload,
			}
		case 'SET_FILE_NAME_VERIFICACION':
			return {
				...state,
				fileNameVerificacion: action.payload,
			}
		case 'SET_FILE_VERIFICACION':
			return {
				...state,
				fileVerificacion: action.payload,
			}
		case 'SET_SIGUIENTE_PAGO_VERIFICACION':
			return {
				...state,
				siguientePagoVerificacion: action.payload,
			}
		case 'REMOVE_PAGO_VERIFICACION':
			return {
				...state,
				pagosVerificacion: state.pagosVerificacion.filter((_, index) => index !== action.payload)
			}
	default:
		return state
	}

}
  
export default pagosVerificacionSlice

export const setPagosVerificacion = (pagosVerificacion) => ({
	type: 'SET_PAGOS_VERIFICACION',
	payload: pagosVerificacion,
})

export const setMesVerificacion = (mesVerificacion) => ({
	type: 'SET_MES_VERIFICACION',
	payload: mesVerificacion,
})

export const setAñoVerificacion = (añoVerificacion) => ({
	type: 'SET_AÑO_VERIFICACION',
	payload: añoVerificacion,
})

export const setCostoVerificacion = (costoVerificacion) => ({
	type: 'SET_COSTO_VERIFICACION',
	payload: costoVerificacion,
})

export const setFileNameVerificacion = (fileNameVerificacion) => ({
	type: 'SET_FILE_NAME_VERIFICACION',
	payload: fileNameVerificacion,
})

export const setFileVerificacion = (fileVerificacion) => ({
	type: 'SET_FILE_VERIFICACION',
	payload: fileVerificacion,
})

export const setSiguientePagoVerificacion = (siguientePagoVerificacion) => ({
	type: 'SET_SIGUIENTE_PAGO_VERIFICACION',
	payload: siguientePagoVerificacion,
})

export const removePagoVerificacion = (index) => ({
	type: 'REMOVE_PAGO_VERIFICACION',
	payload: index,
})