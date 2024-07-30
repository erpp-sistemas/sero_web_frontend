import { imagenesEstadoStates } from '../initialStates/imagenesEstadoStates.js'

const imagenesEstadoSlice = (state = imagenesEstadoStates, action) => {

	switch (action.type) {

		case 'SET_IMAGEN_FUGA_ACEITE':
			return {
				...state,
				imagenesFugaAceite: action.payload,
			}
		case 'SET_IMAGEN_FUGA_COMBUSTIBLE':
			return {
				...state,
				imagenesFugaCombustible: action.payload,
			}
		case 'SET_IMAGEN_FUGA_ACEITE_MOTOR':
			return {
				...state,
				imagenesFugaAceiteMotor: action.payload,
			}
		case 'SET_IMAGEN_DIRECCIONALES_DELANTERAS':
			return {
				...state,
				imagenesDireccionalesDelanteras: action.payload,
			}
		case 'SET_IMAGEN_DIRECCIONALES_TRASERAS':
			return {
				...state,
				imagenesDireccionalesTraseras: action.payload,
			}
		case 'SET_IMAGEN_LUCES_TABLERO':
			return {
				...state,
				imagenesLucesTablero: action.payload,
			}
		case 'SET_IMAGEN_LUZ_FRENO':
			return {
				...state,
				imagenesLuzFreno: action.payload,
			}
		case 'SET_IMAGEN_LLANTA_DELANTERA':
			return {
				...state,
				imagenesLlantaDelantera: action.payload,
			}
		case 'SET_IMAGEN_LLANTA_TRASERA':
			return {
				...state,
				imagenesLlantaTrasera: action.payload,
			}
		case 'SET_IMAGEN_DEFORMACIONES_LLANTA':
			return {
				...state,
				imagenesDeformacionesLlanta: action.payload,
			}
		case 'SET_IMAGEN_ENCENDIDO':
			return {
				...state,
				imagenesEncendido: action.payload,
			}
		case 'SET_IMAGEN_TENSION_CADENA':
			return {
				...state,
				imagenesTensionCadena: action.payload,
			}
		case 'SET_IMAGEN_FRENO_DELANTERO':
			return {
				...state,
				imagenesFrenoDelantero: action.payload,
			}
		case 'SET_IMAGEN_FRENO_TRASERO':
			return {
				...state,
				imagenesFrenoTrasero: action.payload,
			}
		case 'SET_IMAGEN_AMORTIGUADORES':
			return {
				...state,
				imagenesAmortiguadores: action.payload,
			}
		case 'SET_IMAGEN_DIRECCION':
			return {
				...state,
				imagenesDireccion: action.payload,
			}
		case 'SET_IMAGEN_SILLA':
			return {
				...state,
				imagenesSilla: action.payload,
			}
		case 'SET_IMAGEN_ESPEJOS':
			return {
				...state,
				imagenesEspejos: action.payload,
			}
		case 'SET_IMAGEN_VELOCIMETRO':
			return {
				...state,
				imagenesVelocimetro: action.payload,
			}
		case 'SET_IMAGEN_CLAXON':
			return {
				...state,
				imagenesClaxon: action.payload,
			}
		case 'SET_IMAGEN_PALANCAS':
			return {
				...state,
				imagenesPalancas: action.payload,
			}
	default:
		return state
	}

}
  
export default imagenesEstadoSlice

export const setImagenFugaAceite = (imagenesFugaAceite) => ({
	type: 'SET_IMAGEN_FUGA_ACEITE',
	payload: imagenesFugaAceite,
})

export const setImagenFugaCombustible = (imagenesFugaCombustible) => ({
	type: 'SET_IMAGEN_FUGA_COMBUSTIBLE',
	payload: imagenesFugaCombustible,
})

export const setImagenFugaAceiteMotor = (imagenesFugaAceiteMotor) => ({
	type: 'SET_IMAGEN_FUGA_ACEITE_MOTOR',
	payload: imagenesFugaAceiteMotor,
})

export const setImagenDireccionalesDelanteras = (imagenesDireccionalesDelanteras) => ({
	type: 'SET_IMAGEN_DIRECCIONALES_DELANTERAS',
	payload: imagenesDireccionalesDelanteras,
})

export const setImagenDireccionalesTraseras = (imagenesDireccionalesTraseras) => ({
	type: 'SET_IMAGEN_DIRECCIONALES_TRASERAS',
	payload: imagenesDireccionalesTraseras,
})

export const setImagenLucesTablero = (imagenesLucesTablero) => ({
	type: 'SET_IMAGEN_LUCES_TABLERO',
	payload: imagenesLucesTablero,
})

export const setImagenLuzFreno = (imagenesLuzFreno) => ({
	type: 'SET_IMAGEN_LUZ_FRENO',
	payload: imagenesLuzFreno,
})

export const setImagenLlantaDelantera = (imagenesLlantaDelantera) => ({
	type: 'SET_IMAGEN_LLANTA_DELANTERA',
	payload: imagenesLlantaDelantera,
})

export const setImagenLlantaTrasera = (imagenesLlantaTrasera) => ({
	type: 'SET_IMAGEN_LLANTA_TRASERA',
	payload: imagenesLlantaTrasera,
})

export const setImagenDeformacionesLlanta = (imagenesDeformacionesLlanta) => ({
	type: 'SET_IMAGEN_DEFORMACIONES_LLANTA',
	payload: imagenesDeformacionesLlanta,
})

export const setImagenEncendido = (imagenesEncendido) => ({
	type: 'SET_IMAGEN_ENCENDIDO',
	payload: imagenesEncendido,
})

export const setImagenTensionCadena = (imagenesTensionCadena) => ({
	type: 'SET_IMAGEN_TENSION_CADENA',
	payload: imagenesTensionCadena,
})

export const setImagenFrenoDelantero = (imagenesFrenoDelantero) => ({
	type: 'SET_IMAGEN_FRENO_DELANTERO',
	payload: imagenesFrenoDelantero,
})

export const setImagenFrenoTrasero = (imagenesFrenoTrasero) => ({
	type: 'SET_IMAGEN_FRENO_TRASERO',
	payload: imagenesFrenoTrasero,
})

export const setImagenAmortiguadores = (imagenesAmortiguadores) => ({
	type: 'SET_IMAGEN_AMORTIGUADORES',
	payload: imagenesAmortiguadores,
})

export const setImagenDireccion = (imagenesDireccion) => ({
	type: 'SET_IMAGEN_DIRECCION',
	payload: imagenesDireccion,
})

export const setImagenSilla = (imagenesSilla) => ({
	type: 'SET_IMAGEN_SILLA',
	payload: imagenesSilla,
})

export const setImagenEspejos = (imagenesEspejos) => ({
	type: 'SET_IMAGEN_ESPEJOS',
	payload: imagenesEspejos,
})

export const setImagenVelocimetro = (imagenesVelocimetro) => ({
	type: 'SET_IMAGEN_VELOCIMETRO',
	payload: imagenesVelocimetro,
})

export const setImagenClaxon = (imagenesClaxon) => ({
	type: 'SET_IMAGEN_CLAXON',
	payload: imagenesClaxon,
})

export const setImagenPalancas = (imagenesPalancas) => ({
	type: 'SET_IMAGEN_PALANCAS',
	payload: imagenesPalancas,
})