import { comentariosInicialState } from '../initialStates/comentariosStates.js'

const comentariosSlice = (state = comentariosInicialState, action) => {

	switch (action.type) {

		case 'SET_COMENTARIO_FUGA_ACEITE':
			return {
				...state,
				comentarioFugaAceite: action.payload,
			}
		
		case 'SET_COMENTARIO_FUGA_COMBUSTIBLE':
			return {
				...state,
				comentarioFugaCombustible: action.payload,
			}
		
		case 'SET_COMENTARIO_FUGA_ACEITE_MOTOR':
			return {
				...state,
				comentarioFugaAceiteMotor: action.payload,
			}

		case 'SET_COMENTARIO_DIRECCIONALES_DELANTERAS':
			return {
				...state,
				comentarioDireccionalesDelanteras: action.payload,
			}

		case 'SET_COMENTARIO_DIRECCIONALES_TRASERAS':
			return {
				...state,
				comentarioDireccionalesTraseras: action.payload,
			}

		case 'SET_COMENTARIO_LUCES_TABLERO':
			return {
				...state,
				comentarioLucesTablero: action.payload,
			}

		case 'SET_COMENTARIO_LUZ_FRENO':
			return {
				...state,
				comentarioLuzFreno: action.payload,
			}

		case 'SET_COMENTARIO_LLANTA_DELANTERA':
			return {
				...state,
				comentarioLlantaDelantera: action.payload,
			}

		case 'SET_COMENTARIO_LLANTA_TRASERA':
			return {
				...state,
				comentarioLlantaTrasera: action.payload,
			}

		case 'SET_COMENTARIO_DEFORMACIONES_LLANTA':
			return {
				...state,
				comentarioDeformacionesLlanta: action.payload,
			}

		case 'SET_COMENTARIO_ENCENDIDO':
			return {
				...state,
				comentarioEncendido: action.payload,
			}

		case 'SET_COMENTARIO_TENSION_CADENA':
			return {
				...state,
				comentarioTensionCadena: action.payload,
			}

		case 'SET_COMENTARIO_FRENO_DELANTERO':
			return {
				...state,
				comentarioFrenoDelantero: action.payload,
			}

		case 'SET_COMENTARIO_FRENO_TRASERO':
			return {
				...state,
				comentarioFrenoTrasero: action.payload,
			}
			
		case 'SET_COMENTARIO_AMORTIGUADORES':
			return {
				...state,
				comentarioAmortiguadores: action.payload,
			}
		
		case 'SET_COMENTARIO_DIRECCION':
			return {
				...state,
				comentarioDireccion: action.payload,
			}

		case 'SET_COMENTARIO_SILLA':
			return {
				...state,
				comentarioSilla: action.payload,
			}

		case 'SET_COMENTARIO_ESPEJOS':
			return {
				...state,
				comentarioEspejos: action.payload,
			}

		case 'SET_COMENTARIO_VELOCIMETRO':
			return {
				...state,
				comentarioVelocimetro: action.payload,
			}

		case 'SET_COMENTARIO_CLAXON':
			return {
				...state,
				comentarioClaxon: action.payload,
			}

		case 'SET_COMENTARIO_PALANCAS':
			return {
				...state,
				comentarioPalancas: action.payload,
			}

	default:
		return state
	}

}
  
export default comentariosSlice

export const setComentarioFugaAceite = (comentarioFugaAceite) => ({
	type: 'SET_COMENTARIO_FUGA_ACEITE',
	payload: comentarioFugaAceite,
})

export const setComentarioFugaCombustible = (comentarioFugaCombustible) => ({
	type: 'SET_COMENTARIO_FUGA_COMBUSTIBLE',
	payload: comentarioFugaCombustible,
})

export const setComentarioFugaAceiteMotor = (comentarioFugaAceiteMotor) => ({
	type: 'SET_COMENTARIO_FUGA_ACEITE_MOTOR',
	payload: comentarioFugaAceiteMotor,
})

export const setComentarioDireccionalesDelanteras = (comentarioDireccionalesDelanteras) => ({
	type: 'SET_COMENTARIO_DIRECCIONALES_DELANTERAS',
	payload: comentarioDireccionalesDelanteras,
})

export const setComentarioDireccionalesTraseras = (comentarioDireccionalesTraseras) => ({
	type: 'SET_COMENTARIO_DIRECCIONALES_TRASERAS',
	payload: comentarioDireccionalesTraseras,
})

export const setComentarioLucesTablero = (comentarioLucesTablero) => ({
	type: 'SET_COMENTARIO_LUCES_TABLERO',
	payload: comentarioLucesTablero,
})

export const setComentarioLuzFreno = (comentarioLuzFreno) => ({
	type: 'SET_COMENTARIO_LUZ_FRENO',
	payload: comentarioLuzFreno,
})

export const setComentarioLlantaDelantera = (comentarioLlantaDelantera) => ({
	type: 'SET_COMENTARIO_LLANTA_DELANTERA',
	payload: comentarioLlantaDelantera,
})

export const setComentarioLlantaTrasera = (comentarioLlantaTrasera) => ({
	type: 'SET_COMENTARIO_LLANTA_TRASERA',
	payload: comentarioLlantaTrasera,
})

export const setComentarioDeformacionesLlanta = (comentarioDeformacionesLlanta) => ({
	type: 'SET_COMENTARIO_DEFORMACIONES_LLANTA',
	payload: comentarioDeformacionesLlanta,
})

export const setComentarioEncendido = (comentarioEncendido) => ({
	type: 'SET_COMENTARIO_ENCENDIDO',
	payload: comentarioEncendido,
})

export const setComentarioTensionCadena = (comentarioTensionCadena) => ({
	type: 'SET_COMENTARIO_TENSION_CADENA',
	payload: comentarioTensionCadena,
})

export const setComentarioFrenoDelantero = (comentarioFrenoDelantero) => ({
	type: 'SET_COMENTARIO_FRENO_DELANTERO',
	payload: comentarioFrenoDelantero,
})

export const setComentarioFrenoTrasero = (comentarioFrenoTrasero) => ({
	type: 'SET_COMENTARIO_FRENO_TRASERO',
	payload: comentarioFrenoTrasero,
})

export const setComentarioAmortiguadores = (comentarioAmortiguadores) => ({
	type: 'SET_COMENTARIO_AMORTIGUADORES',
	payload: comentarioAmortiguadores,
})

export const setComentarioDireccion = (comentarioDireccion) => ({
	type: 'SET_COMENTARIO_DIRECCION',
	payload: comentarioDireccion,
})

export const setComentarioSilla = (comentarioSilla) => ({
	type: 'SET_COMENTARIO_SILLA',
	payload: comentarioSilla,
})

export const setComentarioEspejos = (comentarioEspejos) => ({
	type: 'SET_COMENTARIO_ESPEJOS',
	payload: comentarioEspejos,
})

export const setComentarioVelocimetro = (comentarioVelocimetro) => ({
	type: 'SET_COMENTARIO_VELOCIMETRO',
	payload: comentarioVelocimetro,
})

export const setComentarioClaxon = (comentaroioClaxon) => ({
	type: 'SET_COMENTARIO_CLAXON',
	payload: comentaroioClaxon,
})

export const setComentarioPalancas = (comentarioPalancas) => ({
	type: 'SET_COMENTARIO_PALANCAS',
	payload: comentarioPalancas,
})