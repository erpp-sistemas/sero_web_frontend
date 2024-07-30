import { informacionGeneralErrorsInicialState } from '../initialStates/informacionGeneralErrorsStates.js'

const informacionGeneralErrorsSlice = (state = informacionGeneralErrorsInicialState, action) => {

	switch (action.type) {

		case 'SET_ERROR_KILOMETRAJE':
			return {
				...state,
				errorKilometraje: action.payload,
			}
		case 'SET_ERROR_SELECTED_PLACE':
			return {
				...state,
				errorSelectedPlace: action.payload,
			}
		case 'SET_ERROR_IMAGE':
			return {
				...state,
				errorImage: action.payload,
			}
		case 'SET_ERROR_MODELO':
			return {
				...state,
				errorModelo: action.payload,
			}
		case 'SET_ERROR_VEHICULO':
			return {
				...state,
				errorVehiculo: action.payload,
			}
		case 'SET_ERROR_MARCA':
			return {
				...state,
				errorMarca: action.payload,
			}
		case 'SET_ERROR_SERIE':
			return {
				...state,
				errorSerie: action.payload,
			}
		case 'SET_ERROR_COLOR':
			return {
				...state,
				errorColor: action.payload,
			}
		case 'SET_ERROR_COLOR_LLAVERO':
			return {
				...state,
				errorColorLlavero: action.payload,
			}
		case 'SET_ERROR_TIPO_MOTOR':
			return {
				...state,
				errorTipoMotor: action.payload,
			}
		case 'SET_ERROR_PLACA':
			return {
				...state,
				errorPlaca: action.payload,
			}
	default:
		return state
	}

}
  
export default informacionGeneralErrorsSlice

export const setErrorKilometraje = (errorKilometraje) => ({
	type: 'SET_ERROR_KILOMETRAJE',
	payload: errorKilometraje,
})

export const setErrorSelectedPlace = (errorSelectedPlace) => ({
	type: 'SET_ERROR_SELECTED_PLACE',
	payload: errorSelectedPlace,
})

export const setErrorImage = (errorImage) => ({
	type: 'SET_ERROR_IMAGE',
	payload: errorImage,
})

export const setErrorModelo = (errorModelo) => ({
	type: 'SET_ERROR_MODELO',
	payload: errorModelo,
})

export const setErrorVehiculo = (errorVehiculo) => ({
	type: 'SET_ERROR_VEHICULO',
	payload: errorVehiculo,
})

export const setErrorMarca = (errorMarca) => ({
	type: 'SET_ERROR_MARCA',
	payload: errorMarca,
})

export const setErrorSerie = (errorSerie) => ({
	type: 'SET_ERROR_SERIE',
	payload: errorSerie,
})

export const setErrorColor = (errorColor) => ({
	type: 'SET_ERROR_COLOR',
	payload: errorColor,
})

export const setErrorColorLlavero = (errorColorLlavero) => ({
	type: 'SET_ERROR_COLOR_LLAVERO',
	payload: errorColorLlavero,
})

export const setErrorTipoMotor = (errorTipoMotor) => ({
	type: 'SET_ERROR_TIPO_MOTOR',
	payload: errorTipoMotor,
})	

export const setErrorPlaca = (errorPlaca) => ({
	type: 'SET_ERROR_PLACA',
	payload: errorPlaca,
})	