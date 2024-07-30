import { pagosPlacasInicialState } from '../initialStates/pagosPlacasStates.js'

const pagosPlacasSlice = (state = pagosPlacasInicialState, action) => {

	switch (action.type) {

		case 'SET_PAGOS_PLACAS':
			return {
				...state,
				pagosPlacas: action.payload,
			}
		case 'SET_MES_PLACAS':
			return {
				...state,
				mesPlacas: action.payload,
			}
		case 'SET_AÑO_PLACAS':
			return {
				...state,
				añoPlacas: action.payload,
			}
		case 'SET_COSTO_PLACAS':
			return {
				...state,
				costoPlacas: action.payload,
			}
		case 'SET_FILE_NAME_PLACAS':
			return {
				...state,
				fileNamePlacas: action.payload,
			}
		case 'SET_FILE_PLACAS':
			return {
				...state,
				filePlacas: action.payload,
			}
		case 'REMOVE_PAGO_PLACAS':
			return {
				...state,
				pagosPlacas: state.pagosPlacas.filter((_, index) => index !== action.payload)
			}
		case 'REMOVE_ALL_PAGO_PLACAS':
			return {
				...state,
				pagosPlacas: [],
			}
	default:
		return state
	}

}
  
export default pagosPlacasSlice

export const setPagosPlacas = (pagosPlacas) => ({
	type: 'SET_PAGOS_PLACAS',
	payload: pagosPlacas,
})

export const setMesPlacas = (mesPlacas) => ({
	type: 'SET_MES_PLACAS',
	payload: mesPlacas,
})

export const setAñoPlacas = (añoPlacas) => ({
	type: 'SET_AÑO_PLACAS',
	payload: añoPlacas,
})

export const setCostoPlacas = (costoPlacas) => ({
	type: 'SET_COSTO_PLACAS',
	payload: costoPlacas,
})

export const setFileNamePlacas = (fileNamePlacas) => ({
	type: 'SET_FILE_NAME_PLACAS',
	payload: fileNamePlacas,
})

export const setFilePlacas = (filePlacas) => ({
	type: 'SET_FILE_PLACAS',
	payload: filePlacas,
})

export const removePagoPlacas = (index) => ({
	type: 'REMOVE_PAGO_PLACAS',
	payload: index,
})

export const removeAllPagoPlacas = (pagosPlacas) => ({
	type: 'REMOVE_ALL_PAGO_PLACAS',
	payload: pagosPlacas,
})
