// import { baseURL } from '../hooks/'
// import axios from 'axios'

const initialState = {
	activity: true,
	idPaquete: 0,
	plazas: [],
	servicios: [],
	plaza: 0,
	servicio: 0,
	fileName: '',
	selectionCompleted: false,
	folio: null,
	registros: [],
	fechaCorte: null,
	porcentaje: [],
	cargando: false,
}

const recordsSlice = (state = initialState, action) => {

	switch (action.type) {

		case 'SET_ACTIVITY':
			return {
				...state,
				activity: action.payload,
			}
		case 'SET_ID_PAQUETE':
			return {
				...state,
				idPaquete: action.payload,
			}
		case 'SET_PLAZAS':
			return {
				...state,
				plazas: action.payload,
			}
		case 'SET_SERVICIOS':
			return {
				...state,
				servicios: action.payload,
			}
		case 'SET_PLAZA':
			return {
				...state,
				plaza: action.payload,
			}
		case 'SET_SERVICIO':
			return {
				...state,
				servicio: action.payload,
			}
		case 'SET_FILE_NAME':
			return {
				...state,
				fileName: action.payload,
			}
		case 'SET_SELECTION_COMPLETED':
			return {
				...state,
				selectionCompleted: action.payload,
			}
		case 'SET_FOLIO':
			return {
				...state,
				folio: action.payload,
			}
		case 'SET_REGISTROS':
			return {
				...state,
				registros: action.payload,
			}
		case 'SET_FECHA_CORTE':
			return {
				...state,
				fechaCorte: action.payload,
			}
		case 'SET_PORCENTAJE':
			return {
				...state,
				porcentaje: action.payload,
			}
		case 'SET_CARGANDO':
			return {
				...state,
				cargando: action.payload,
			}
	default:
		return state
	}

}
  
export default recordsSlice

export const setActivity = (activity) => ({
	type: 'SET_ACTIVITY',
	payload: activity,
})

export const setIdPaquete = (idPaquete) => ({
	type: 'SET_ID_PAQUETE',
	payload: idPaquete,
})

export const setPlazas = (plazas) => ({
	type: 'SET_PLAZAS',
	payload: plazas,
})

export const setServicios = (servicios) => ({
	type: 'SET_SERVICIOS',
	payload: servicios,
})

export const setPlaza = (plaza) => ({
	type: 'SET_PLAZA',
	payload: plaza,
})

export const setServicio = (servicio) => ({
	type: 'SET_SERVICIO',
	payload: servicio,
})

export const setFileName = (fileName) => ({
	type: 'SET_FILE_NAME',
	payload: fileName,
})

export const setSelectionCompleted = (selectionCompleted) => ({
	type: 'SET_SELECTION_COMPLETED',
	payload: selectionCompleted,
})

export const setFolio = (folio) => ({
	type: 'SET_FOLIO',
	payload: folio,
})

export const setRegistros = (registros) => ({
	type: 'SET_REGISTROS',
	payload: registros,
})

export const setFechaCorte = (fechaCorte) => ({
	type: 'SET_REGISTROS',
	payload: fechaCorte,
})

export const setPorcentaje = (porcentaje) => ({
	type: 'SET_PORCENTAJE',
	payload: porcentaje,
})

export const setCargando = (cargando) => ({
	type: 'SET_CARGANDO',
	payload: cargando,
})