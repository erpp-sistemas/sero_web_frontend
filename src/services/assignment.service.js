import {workAssignmentRequest} from '../api/assignment.js'

export const postWorkAssignment = async (place_id, service_id, excelData) => {

    try {
		const response = await workAssignmentRequest(place_id, service_id, excelData)
		return response.data
    } catch (error) {
		console.error('Error al enviar datos a la API', error.response?.data || error.message)
		throw error
    }
	
}