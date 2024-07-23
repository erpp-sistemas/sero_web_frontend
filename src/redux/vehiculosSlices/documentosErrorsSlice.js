import { documentosErrorsInicialState } from '../initialStates/documentosErrorsStates.js'

const documentosErrorSlice = (state = documentosErrorsInicialState, action) => {

	switch (action.type) {

		case 'SET_ERROR_TARJETA_CIRCULACION':
			return {
				...state,
				errorTarjetaCirculacion: action.payload,
			}
		case 'SET_ERROR_FACTURA':
			return {
				...state,
				errorFactura: action.payload,
			}
		case 'SET_ERROR_SEGURO':
			return {
				...state,
				errorSeguro: action.payload,
			}
		case 'SET_ERROR_GARANTIA':
			return {
				...state,
				errorGarantia: action.payload,
			}
		case 'SET_ERROR_FRENTE':
			return {
				...state,
				errorFrente: action.payload,
			}
		case 'SET_ERROR_TRASERA':
			return {
				...state,
				errorTrasera: action.payload,
			}
		case 'SET_ERROR_LADO_DERECHO':
			return {
				...state,
				errorLadoDerecho: action.payload,
			}
		case 'SET_ERROR_LADO_IZQUIERDO':
			return {
				...state,
				errorLadoIzquierdo: action.payload,
			}

	default:
		return state
	}

}
  
export default documentosErrorSlice

export const setErrorTarjetaCirculacion = (errorTarjetaCirculacion) => ({
	type: 'SET_ERROR_TARJETA_CIRCULACION',
	payload: errorTarjetaCirculacion,
})

export const setErrorFactura = (errorFactura) => ({
	type: 'SET_ERROR_FACTURA',
	payload: errorFactura,
})

export const setErrorSeguro = (errorSeguro) => ({
	type: 'SET_ERROR_SEGURO',
	payload: errorSeguro,
})

export const setErrorGarantia = (errorGarantia) => ({
	type: 'SET_ERROR_GARANTIA',
	payload: errorGarantia,
})

export const setErrorFrente = (errorFrente) => ({
	type: 'SET_ERROR_FRENTE',
	payload: errorFrente,
})

export const setErrorTrasera = (errorTrasera) => ({
	type: 'SET_ERROR_TRASERA',
	payload: errorTrasera,
})

export const setErrorLadoDerecho = (errorLadoDerecho) => ({
	type: 'SET_ERROR_LADO_DERECHO',
	payload: errorLadoDerecho,
})

export const setErrorLadoIzquierdo = (errorLadoIzquierdo) => ({
	type: 'SET_ERROR_LADO_IZQUIERDO',
	payload: errorLadoIzquierdo,
})