import { estadoErrorInitialStates } from '../initialStates/estadoErrorsStates.js'

const estadoErrorSlice = (state = estadoErrorInitialStates, action) => {

	switch (action.type) {

		case 'SET_ERROR_COMBUSTIBLE':
			return {
				...state,
				errorCombustible: action.payload,
			}
		case 'SET_ERROR_BATERIA':
			return {
				...state,
				errorBateria: action.payload,
			}
		case 'SET_ERROR_NEUMATICO':
			return {
				...state,
				errorNeumatico: action.payload,
			}
		
	default:
		return state
	}

}
  
export default estadoErrorSlice

export const setErrorCombustible = (errorCombustible) => ({
	type: 'SET_ERROR_COMBUSTIBLE',
	payload: errorCombustible,
})

export const setErrorBateria = (errorBateria) => ({
	type: 'SET_ERROR_BATERIA',
	payload: errorBateria,
})

export const setErrorNeumatico = (errorNeumatico) => ({
	type: 'SET_ERROR_NEUMATICO',
	payload: errorNeumatico,
})
