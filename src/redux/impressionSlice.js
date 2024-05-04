const initialState = {
	paquetes: [],
	paquete:{},
	idPaquete: 0,
	rangoInicial: 1,
	rangoFinal: 2,
	fichaPreview: null,
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