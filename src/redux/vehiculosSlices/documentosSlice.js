import { documentosInicialState } from '../initialStates/documentosStates.js'

const documentosSlice = (state = documentosInicialState, action) => {

	switch (action.type) {

		case 'SET_TARJETA_CIRCULACION':
			return {
				...state,
				tarjetaCirculacion: action.payload,
			}
		case 'SET_FACTURA':
			return {
				...state,
				factura: action.payload,
			}
		case 'SET_SEGURO':
			return {
				...state,
				seguro: action.payload,
			}
		case 'SET_GARANTIA':
			return {
				...state,
				garantia: action.payload,
			}
		case 'SET_NOMBRE_TARJETA_CIRCULACION':
			return {
				...state,
				nombreTarjetaCirculacion: action.payload,
			}
		case 'SET_NOMBRE_FACTURA':
			return {
				...state,
				nombreFactura: action.payload,
			}
		case 'SET_NOMBRE_SEGURO':
			return {
				...state,
				nombreSeguro: action.payload,
			}
		case 'SET_NOMBRE_GARANTIA':
			return {
				...state,
				nombreGarantia: action.payload,
			}
		case 'SET_FRENTE':
			return {
				...state,
				frente: action.payload,
			}
		case 'SET_TRASERA':
			return {
				...state,
				trasera: action.payload,
			}
		case 'SET_LADO_IZQUIERDO':
			return {
				...state,
				ladoIzquierdo: action.payload,
			}
		case 'SET_LADO_DERECHO':
			return {
				...state,
				ladoDerecho: action.payload,
			}
		
	default:
		return state
	}

}
  
export default documentosSlice

export const setTarjetaCirculacion = (tarjetaCirculacion) => ({
	type: 'SET_TARJETA_CIRCULACION',
	payload: tarjetaCirculacion,
})

export const setFactura = (factura) => ({
	type: 'SET_FACTURA',
	payload: factura,
})

export const setSeguro = (seguro) => ({
	type: 'SET_SEGURO',
	payload: seguro,
})

export const setGarantia = (garantia) => ({
	type: 'SET_GARANTIA',
	payload: garantia,
})

export const setNombreTarjetaCirculacion = (nombreTarjetaCirculacion) => ({
	type: 'SET_NOMBRE_TARJETA_CIRCULACION',
	payload: nombreTarjetaCirculacion,
})

export const setNombreFactura = (nombreFactura) => ({
	type: 'SET_NOMBRE_FACTURA',
	payload: nombreFactura,
})

export const setNombreSeguro = (nombreSeguro) => ({
	type: 'SET_NOMBRE_SEGURO',
	payload: nombreSeguro,
})

export const setNombreGarantia = (nombreGarantia) => ({
	type: 'SET_NOMBRE_GARANTIA',
	payload: nombreGarantia,
})

export const setFrente = (frente) => ({
	type: 'SET_FRENTE',
	payload: frente,
})

export const setTrasera = (trasera) => ({
	type: 'SET_TRASERA',
	payload: trasera,
})

export const setLadoDerecho = (ladoDerecho) => ({
	type: 'SET_LADO_DERECHO',
	payload: ladoDerecho,
})

export const setLadoIzquierdo = (ladoIzquierdo) => ({
	type: 'SET_LADO_IZQUIERDO',
	payload: ladoIzquierdo,
})