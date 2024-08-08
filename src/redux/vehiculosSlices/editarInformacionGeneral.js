import { editarInformacionGeneralInitialState } from '../initialStates/editarInformacionGeneral.js'

const editarInformacionGeneralSlice = (state = editarInformacionGeneralInitialState, action) => {

	switch (action.type) {

		case 'SET_EDIT_KILOMETRAJE':
			return {
				...state,
				editKilometraje: action.payload,
			}

		case 'SET_EDIT_SELECTED_PLACE':
			return {
				...state,
				editSelectedPlace: action.payload,
			}

		case 'SET_EDIT_IMAGE':
			return {
				...state,
				editImage: action.payload,
			}

		case 'SET_EDIT_IMAGE_PREVIEW':
			return {
				...state,
				editImagePreview: action.payload,
			}

		case 'SET_EDIT_MODELO':
			return {
				...state,
				editModelo: action.payload,
			}

		case 'SET_EDIT_PLACA':
			return {
				...state,
				editPlaca: action.payload,
			}

		case 'SET_EDIT_VEHICULO':
			return {
				...state,
				editVehiculo: action.payload,
			}

		case 'SET_EDIT_MARCA':
			return {
				...state,
				editMarca: action.payload,
			}

		case 'SET_EDIT_SERIE':
			return {
				...state,
				editSerie: action.payload,
			}

		case 'SET_EDIT_COLOR':
			return {
				...state,
				editColor: action.payload,
			}

		case 'SET_EDIT_COLOR_LLAVERO':
			return {
				...state,
				editColorLlavero: action.payload,
			}

		case 'SET_EDIT_TIPO_MOTOR':
			return {
				...state,
				editTipoMotor: action.payload,
			}

	default:
		return state
	}

}
  
export default editarInformacionGeneralSlice

export const setEditKilometraje = (editKilometraje) => ({
	type: 'SET_EDIT_KILOMETRAJE',
	payload: editKilometraje,
})

export const setEditSelectedPlace = (editSelectedPlace) => ({
	type: 'SET_EDIT_SELECTED_PLACE',
	payload: editSelectedPlace,
})

export const setEditImage = (editImage) => ({
	type: 'SET_EDIT_IMAGE',
	payload: editImage,
})

export const setEditImagePreview = (editImagePreview) => ({
	type: 'SET_EDIT_IMAGE_PREVIEW',
	payload: editImagePreview,
})

export const setEditModelo = (editModelo) => ({
	type: 'SET_EDIT_MODELO',
	payload: editModelo,
})

export const setEditPlaca = (editPlaca) => ({
	type: 'SET_EDIT_PLACA',
	payload: editPlaca,
})

export const setEditVehiculo = (editVehiculo) => ({
	type: 'SET_EDIT_VEHICULO',
	payload: editVehiculo,
})

export const setEditMarca = (editMarca) => ({
	type: 'SET_EDIT_MARCA',
	payload: editMarca,
})

export const setEditSerie = (editSerie) => ({
	type: 'SET_EDIT_SERIE',
	payload: editSerie,
})

export const setEditColor = (editColor) => ({
	type: 'SET_EDIT_COLOR',
	payload: editColor,
})

export const setEditColorLlavero = (editColorLlavero) => ({
	type: 'SET_EDIT_COLOR_LLAVERO',
	payload: editColorLlavero,
})

export const setEditTipoMotor = (editTipoMotor) => ({
	type: 'SET_EDIT_TIPO_MOTOR',
	payload: editTipoMotor,
})