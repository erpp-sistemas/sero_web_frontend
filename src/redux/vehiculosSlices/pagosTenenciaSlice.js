import { pagosTenenciaInicialState } from '../initialStates/pagosTenenciaStates.js'

const pagosTenenciaSlice = (state = pagosTenenciaInicialState, action) => {

	switch (action.type) {

		case 'SET_PAGOS_TENENCIA':
			return {
				...state,
				pagosTenencia: action.payload,
			}
		case 'SET_MES_TENENCIA':
			return {
				...state,
				mesTenencia: action.payload,
			}
		case 'SET_AÑO_TENENCIA':
			return {
				...state,
				añoTenencia: action.payload,
			}
		case 'SET_COSTO_TENENCIA':
			return {
				...state,
				costoTenencia: action.payload,
			}
		case 'SET_FILE_NAME_TENENCIA':
			return {
				...state,
				fileNameTenencia: action.payload,
			}
		case 'SET_FILE_TENENCIA':
			return {
				...state,
				fileTenencia: action.payload,
			}
		case 'REMOVE_PAGO_TENENCIA':
			return {
				...state,
				pagosTenencia: state.pagosTenencia.filter((_, index) => index !== action.payload)
			}
	default:
		return state
	}

}
  
export default pagosTenenciaSlice

export const setPagosTenencia = (pagosTenencia) => ({
	type: 'SET_PAGOS_TENENCIA',
	payload: pagosTenencia,
})

export const setMesTenencia = (mesTenencia) => ({
	type: 'SET_MES_TENENCIA',
	payload: mesTenencia,
})

export const setAñoTenencia = (añoTenencia) => ({
	type: 'SET_AÑO_TENENCIA',
	payload: añoTenencia,
})

export const setCostoTenencia = (costoTenencia) => ({
	type: 'SET_COSTO_TENENCIA',
	payload: costoTenencia,
})

export const setFileNameTenencia = (fileNameTenencia) => ({
	type: 'SET_FILE_NAME_TENENCIA',
	payload: fileNameTenencia,
})

export const setFileTenencia = (fileTenencia) => ({
	type: 'SET_FILE_TENENCIA',
	payload: fileTenencia,
})

export const removePagoTenencia = (index) => ({
	type: 'REMOVE_PAGO_TENENCIA',
	payload: index,
})