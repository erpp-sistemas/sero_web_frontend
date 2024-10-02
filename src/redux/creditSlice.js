import { creditInicialState } from "./initialStates/creditStates"

const creditSlice = (state = creditInicialState, action) => {

	switch (action.type) {

		case 'SET_OPEN_FORMATOS':
			return {
				...state,
				openFormatos: action.payload,
			}
		case 'SET_PREVIEW':
			return {
				...state,
				preview: action.payload,
			}
		case 'SET_SELECCION':
			return {
				...state,
				seleccion: action.payload,
			}
		case 'SET_DATA':
			return {
				...state,
				data: action.payload,
			}
		case 'SET_OPEN_CONFIRMATION':
			return {
				...state,
				openConfirmation: action.payload,
			}
	default:
		return state
	}

}
  
export default creditSlice

export const setOpenFormatos = (modal) => ({
	type: 'SET_OPEN_FORMATOS',
	payload: modal,
})

export const setPreview = (modal) => ({
	type: 'SET_PREVIEW',
	payload: modal,
})

export const setSeleccion = (modal) => ({
	type: 'SET_SELECCION',
	payload: modal,
})

export const setData = (modal) => ({
	type: 'SET_DATA',
	payload: modal,
})

export const setOpenConfirmation = (modal) => ({
	type: 'SET_OPEN_CONFIRMATION',
	payload: modal,
})