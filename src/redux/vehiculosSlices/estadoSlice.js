import { estadoInicialState } from '../initialStates/estadoStates.js'

const estadoSlice = (state = estadoInicialState, action) => {

	switch (action.type) {

		case 'SET_COMBUSTIBLE':
			return {
				...state,
				combustible: action.payload,
			}
		case 'SET_BATERIA':
			return {
				...state,
				bateria: action.payload,
			}
		case 'SET_NEUMATICOS':
			return {
				...state,
				neumaticos: action.payload,
			}
		case 'SET_FUGA_ACEITE':
			return {
				...state,
				fugaAceite: action.payload,
			}
		case 'SET_FUGA_COMBUSTIBLE':
			return {
				...state,
				fugaCombustible: action.payload,
			}
		case 'SET_FUGA_ACEITE_MOTOR':
			return {
				...state,
				fugaAceiteMotor: action.payload,
			}
		case 'SET_DIRECCIONALES_DELANTERAS':
			return {
				...state,
				direccionalesDelanteras: action.payload,
			}
		case 'SET_DIRECCIONALES_TRASERAS':
			return {
				...state,
				direccionalesTraseras: action.payload,
			}
		case 'SET_LUCES_TABLERO':
			return {
				...state,
				lucesTablero: action.payload,
			}
		case 'SET_LUZ_FRENO':
			return {
				...state,
				luzFreno: action.payload,
			}
		case 'SET_LLANTA_DELANTERA':
			return {
				...state,
				llantaDelantera: action.payload,
			}
		case 'SET_LLANTA_TRASERA':
			return {
				...state,
				llantaTrasera: action.payload,
			}
		case 'SET_DEFORMACIONES_LLANTAS':
			return {
				...state,
				deformacionesLlanta: action.payload,
			}
		case 'SET_ENCENDIDO':
			return {
				...state,
				encendido: action.payload,
			}
		case 'SET_TENSION_CADENA':
			return {
				...state,
				tensionCadena: action.payload,
			}
		case 'SET_FRENO_DELANTERO':
			return {
				...state,
				frenoDelantero: action.payload,
			}
		case 'SET_FRENO_TRASERO':
			return {
				...state,
				frenoTrasero: action.payload,
			}
		case 'SET_AMORTIGUADORES':
			return {
				...state,
				amortiguadores: action.payload,
			}
		case 'SET_DIRECCION':
			return {
				...state,
				direccion: action.payload,
			}
		case 'SET_SILLA':
			return {
				...state,
				silla: action.payload,
			}
		case 'SET_ESPEJOS':
			return {
				...state,
				espejos: action.payload,
			}
		case 'SET_VELOCIMETRO':
			return {
				...state,
				velocimetro: action.payload,
			}
		case 'SET_CLAXON':
			return {
				...state,
				claxon: action.payload,
			}
		case 'SET_PALANCAS':
			return {
				...state,
				palancas: action.payload,
			}
		case 'SET_OBSERVACIONES':
			return {
				...state,
				observaciones: action.payload,
			}
	default:
		return state
	}

}
  
export default estadoSlice

export const setCombustible = (combustible) => ({
	type: 'SET_COMBUSTIBLE',
	payload: combustible,
})

export const setBateria = (bateria) => ({
	type: 'SET_BATERIA',
	payload: bateria,
})

export const setNeumaticos = (neumaticos) => ({
	type: 'SET_NEUMATICOS',
	payload: neumaticos,
})

export const setFugaAceite = (fugaAceite) => ({
	type: 'SET_FUGA_ACEITE',
	payload: fugaAceite,
})

export const setFugaCombustible = (fugaCombustible) => ({
	type: 'SET_FUGA_COMBUSTIBLE',
	payload: fugaCombustible,
})

export const setFugaAceiteMotor = (fugaAceiteMotor) => ({
	type: 'SET_FUGA_ACEITE_MOTOR',
	payload: fugaAceiteMotor,
})

export const setDireccionalesDelanteras = (direccionalesDelanteras) => ({
	type: 'SET_DIRECCIONALES_DELANTERAS',
	payload: direccionalesDelanteras,
})

export const setDireccionalesTraseras = (direccionalesTraseras) => ({
	type: 'SET_DIRECCIONALES_TRASERAS',
	payload: direccionalesTraseras,
})

export const setLucesTablero = (lucesTablero) => ({
	type: 'SET_LUCES_TABLERO',
	payload: lucesTablero,
})

export const setLuzFreno = (luzFreno) => ({
	type: 'SET_LUZ_FRENO',
	payload: luzFreno,
})

export const setLlantaDelantera = (llantaDelantera) => ({
	type: 'SET_LLANTA_DELANTERA',
	payload: llantaDelantera,
})

export const setLlantaTrasera = (llantaTrasera) => ({
	type: 'SET_LLANTA_TRASERA',
	payload: llantaTrasera,
})

export const setDeformacionesLlanta = (deformacionesLlanta) => ({
	type: 'SET_DEFORMACIONES_LLANTAS',
	payload: deformacionesLlanta,
})

export const setEncendido = (encendido) => ({
	type: 'SET_ENCENDIDO',
	payload: encendido,
})

export const setTensionCadena = (tensionCadena) => ({
	type: 'SET_TENSION_CADENA',
	payload: tensionCadena,
})

export const setFrenoDelantero = (frenoDelantero) => ({
	type: 'SET_FRENO_DELANTERO',
	payload: frenoDelantero,
})

export const setFrenoTrasero = (frenoTrasero) => ({
	type: 'SET_FRENO_TRASERO',
	payload: frenoTrasero,
})

export const setAmortiguadores= (amortiguadores) => ({
	type: 'SET_AMORTIGUADORES',
	payload: amortiguadores,
})

export const setDireccion = (direccion) => ({
	type: 'SET_DIRECCION',
	payload: direccion,
})

export const setSilla = (silla) => ({
	type: 'SET_SILLA',
	payload: silla,
})

export const setEspejos = (espejos) => ({
	type: 'SET_ESPEJOS',
	payload: espejos,
})

export const setVelocimetro = (velocimetro) => ({
	type: 'SET_VELOCIMETRO',
	payload: velocimetro,
})

export const setClaxon = (claxon) => ({
	type: 'SET_CLAXON',
	payload: claxon,
})

export const setPalancas = (palancas) => ({
	type: 'SET_PALANCAS',
	payload: palancas,
})

export const setObservaciones = (observaciones) => ({
	type: 'SET_OBSERVACIONES',
	payload: observaciones,
})