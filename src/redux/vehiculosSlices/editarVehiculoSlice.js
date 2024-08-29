import { editarVehiculoStates } from '../initialStates/editarVehiculoStates.js'

const editarVehiculoSlice = (state = editarVehiculoStates, action) => {

	switch (action.type) {

		case 'SET_QR':
			return {
				...state,
				qr: action.payload,
			}
			
		case 'SET_EDITAR':
			return {
				...state,
				editar: action.payload,
			}

		case 'SET_OPEN':
			return {
				...state,
				open: action.payload,
			}

	default:
		return state
	}

}
  
export default editarVehiculoSlice

export const setQr = (qr) => ({
	type: 'SET_QR',
	payload: qr,
})

export const setEditar = (editar) => ({
	type: 'SET_EDITAR',
	payload: editar,
})

export const setOpen = (open) => ({
	type: 'SET_OPEN',
	payload: open,
})