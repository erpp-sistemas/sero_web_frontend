const initialState = {
	paquetes: [],
	paquete:{},
	registros:{},
	idPaquete: 0,	
	rangoInicial: 0,
	rangoFinal: 0,
	rango: 0,
	fichaPreview: null,
	selectedCuenta: '',
	openPreview: false,
	openCharge: false,
	registro: null,
}

const impressionSlice = (state = initialState, action) => {

	switch (action.type) {

		case 'SET_PAQUETES':
			return {
				...state,
				paquetes: action.payload,
			}
		case 'SET_PAQUETE':
			return {
				...state,
				paquete: action.payload,
			}
		case 'SET_ID_PAQUETE':
			return {
				...state,
				idPaquete: action.payload,
			}
		case 'SET_RANGO_INICIAL':
			return {
				...state,
				rangoInicial: action.payload,
			}
		case 'SET_RANGO_FINAL':
			return {
				...state,
				rangoFinal: action.payload,
			}
		case 'SET_REGISTROS':
			return {
				...state,
				registros: action.payload,
			}
		case 'SET_RANGO':
			return {
				...state,
				rango: action.payload,
			}
		case 'SET_SELECTED_CUENTA':
			return {
				...state,
				selectedCuenta: action.payload,
			}
		case 'SET_OPEN_PREVIEW':
			return {
				...state,
				openPreview: action.payload,
			}
		case 'SET_REGISTRO':
			return {
				...state,
				registro: action.payload,
			}
		case 'SET_OPEN_CHARGE':
			return {
				...state,
				openCharge: action.payload,
			}
	default:
		return state
	}

}
  
export default impressionSlice

export const setPaquetes = (activity) => ({
	type: 'SET_PAQUETES',
	payload: activity,
})

export const setPaquete = (activity) => ({
	type: 'SET_PAQUETE',
	payload: activity,
})

export const setIdPaquete = (activity) => ({
	type: 'SET_ID_PAQUETE',
	payload: activity,
})

export const setRangoInicial = (activity) => ({
	type: 'SET_RANGO_INICIAL',
	payload: activity,
})

export const setRangoFinal = (activity) => ({
	type: 'SET_RANGO_FINAL',
	payload: activity,
})

export const setRegistros = (activity) => ({
	type: 'SET_REGISTROS',
	payload: activity,
})

export const setRango = (activity) => ({
	type: 'SET_RANGO',
	payload: activity,
})

export const setSelectedCuenta = (activity) => ({
	type: 'SET_SELECTED_CUENTA',
	payload: activity,
})

export const setOpenPreview = (activity) => ({
	type: 'SET_OPEN_PREVIEW',
	payload: activity,
})

export const setRegistro = (activity) => ({
	type: 'SET_REGISTRO',
	payload: activity,
})

export const setOpenCharge = (activity) => ({
	type: 'SET_OPEN_CHARGE',
	payload: activity,
})