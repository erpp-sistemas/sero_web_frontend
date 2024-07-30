import { pagosExtraordinariosInicialState } from '../initialStates/pagosExtraordinariosStates.js'

const pagosExtraordinariosSlice = (state = pagosExtraordinariosInicialState, action) => {

	switch (action.type) {

		case 'SET_PAGOS_EXTRAORDINARIOS':
			return {
				...state,
				pagosExtraordinarios: action.payload,
			}
		case 'SET_MES_EXTRAORDINARIOS':
			return {
				...state,
				mesExtraordinarios: action.payload,
			}
		case 'SET_AÑO_EXTRAORDINARIOS':
			return {
				...state,
				añoExtraordinarios: action.payload,
			}
		case 'SET_COSTO_EXTRAORDINARIOS':
			return {
				...state,
				costoExtraordinarios: action.payload,
			}
		case 'SET_FILE_NAME_EXTRAORDINARIOS':
			return {
				...state,
				fileNameExtraordinarios: action.payload,
			}
		case 'SET_FILE_EXTRAORDINARIOS':
			return {
				...state,
				fileExtraordinarios: action.payload,
			}		
		case 'SET_DESCRIPCION_EXTRAORDINARIOS':
			return {
				...state,
				descripcionExtraordinarios: action.payload,
			}
		case 'REMOVE_PAGO_EXTRAORDINARIOS':
			return {
				...state,
				pagosExtraordinarios: state.pagosExtraordinarios.filter((_, index) => index !== action.payload)
			}
	default:
		return state
	}

}
  
export default pagosExtraordinariosSlice

export const setPagosExtraordinarios = (pagosExtraordinarios) => ({
	type: 'SET_PAGOS_EXTRAORDINARIOS',
	payload: pagosExtraordinarios,
})

export const setMesExtraordinarios = (mesExtraordinarios) => ({
	type: 'SET_MES_EXTRAORDINARIOS',
	payload: mesExtraordinarios,
})

export const setAñoExtraordinarios = (añoExtraordinarios) => ({
	type: 'SET_AÑO_EXTRAORDINARIOS',
	payload: añoExtraordinarios,
})

export const setCostoExtraordinarios = (costoExtraordinarios) => ({
	type: 'SET_COSTO_EXTRAORDINARIOS',
	payload: costoExtraordinarios,
})

export const setFileNameExtraordinarios = (fileNameExtraordinarios) => ({
	type: 'SET_FILE_NAME_EXTRAORDINARIOS',
	payload: fileNameExtraordinarios,
})

export const setFileExtraordinarios = (fileExtraordinarios) => ({
	type: 'SET_FILE_EXTRAORDINARIOS',
	payload: fileExtraordinarios,
})

export const setDescripcionExtraordinarios = (descripcionExtraordinarios) => ({
	type: 'SET_DESCRIPCION_EXTRAORDINARIOS',
	payload: descripcionExtraordinarios,
})

export const removePagoExtraordinarios = (index) => ({
	type: 'REMOVE_PAGO_EXTRAORDINARIOS',
	payload: index,
})
