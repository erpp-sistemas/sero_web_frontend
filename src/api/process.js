import axios from './axios'

export const placeServiceProcessByUserIdRequest = (user_id, place_id, service_id) => axios.get(`/PlaceServiceProcessByUserId/${user_id}/${place_id}/${service_id}`)

export const createProcess = async (processData) => {

    try {
		const response = await axios.post(`/processes`, processData)
		return response.data
    } catch (error) {
		console.error("Error al crear un nuevo proceso:", error)
		throw error
    }

}

export const getAllProcesses = async () => {

    try {
		const response = await axios.get(`/processes`)
		return response.data
    } catch (error) {
		console.error("Error al obtener todos los procesos:", error)
		throw error
    }

}

export const updateProcess = async (processId, updatedData) => {

    try {
		const response = await axios.put(`/processes/${processId}`, updatedData)
		return response.data
    } catch (error) {
		console.error(`Error al actualizar el proceso con ID ${processId}:`, error)
		throw error
    }

}

export const deleteProcess = async (processId) => {
	
    try {
		const response = await axios.delete(`/processes/${processId}`)
		return response.data
    } catch (error) {
		console.error(`Error al eliminar el proceso con ID ${processId}:`, error)
		throw error
    }

}