import { informacionGeneralInicialState } from '../initialStates/informacionGeneralStates.js'

const informacionGeneralSlice = (state = informacionGeneralInicialState, action) => {

	switch (action.type) {

		case 'SET_KILOMETRAJE':
			return {
				...state,
				kilometraje: action.payload,
			}
		case 'SET_SELECTED_PLACE':
			return {
				...state,
				selectedPlace: action.payload,
			}
		case 'SET_IMAGE':
			return {
				...state,
				image: action.payload,
			}
		case 'SET_MODELO':
			return {
				...state,
				modelo: action.payload,
			}
		case 'SET_PLACA':
			return {
				...state,
				placa: action.payload,
			}
		case 'SET_VEHICULO':
			return {
				...state,
				vehiculo: action.payload,
			}
		case 'SET_MARCA':
			return {
				...state,
				marca: action.payload,
			}
		case 'SET_SERIE':
			return {
				...state,
				serie: action.payload,
			}
		case 'SET_COLOR':
			return {
				...state,
				color: action.payload,
			}
		case 'SET_COLOR_LLAVERO':
			return {
				...state,
				colorLlavero: action.payload,
			}
		case 'SET_TIPO_MOTOR':
			return {
				...state,
				tipoMotor: action.payload,
			}
		case 'SET_INFORMACION_GENERAL':
			return {
				...state,
				...action.payload,
			}
	default:
		return state
	}

}
  
export default informacionGeneralSlice

export const setKilometraje = (kilometraje) => ({
	type: 'SET_KILOMETRAJE',
	payload: kilometraje,
})

export const setSelectedPlace = (selectedPlace) => ({
	type: 'SET_SELECTED_PLACE',
	payload: selectedPlace,
})

export const setImage = (image) => ({
	type: 'SET_IMAGE',
	payload: image,
})

export const setModelo = (modelo) => ({
	type: 'SET_MODELO',
	payload: modelo,
})

export const setPlaca = (placa) => ({
	type: 'SET_PLACA',
	payload: placa,
})

export const setVehiculo = (vehiculo) => ({
	type: 'SET_VEHICULO',
	payload: vehiculo,
})

export const setMarca = (marca) => ({
	type: 'SET_MARCA',
	payload: marca,
})

export const setSerie = (serie) => ({
	type: 'SET_SERIE',
	payload: serie,
})

export const setColor = (color) => ({
	type: 'SET_COLOR',
	payload: color,
})

export const setColorLlavero = (colorLlavero) => ({
	type: 'SET_COLOR_LLAVERO',
	payload: colorLlavero,
})

export const setTipoMotor = (tipoMotor) => ({
	type: 'SET_TIPO_MOTOR',
	payload: tipoMotor,
})	

export const setInformacionGeneral = (data) => ({
	type: 'SET_INFORMACION_GENERAL',
	payload: data,
})