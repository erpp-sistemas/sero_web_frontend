import instance from './axios'
import axios from './axios'

export const placeServiceByUserIdRequest = (user_id, place_id) => axios.get(`/PlaceServiceByUserId/${user_id}/${place_id}`)

const handleError = (error) => {
    console.error('Error en la solicitud:', error)
    throw new Error('Error en la solicitud. Consulta la consola para más detalles.')
}

export const createService = async (serviceData) => {

    try {
		const response = await instance.post(`/services`, serviceData)
		return response.data
    } catch (error) {
		handleError(error)
    }

}
  
export const getAllServices = async () => {

    try {
		const response = await instance.get(`/services`)
		return response.data.services
    } catch (error) {
		handleError(error)
    }

}
  
export const updateService = async (id, updatedServiceData) => {

    try {
		const response = await instance.put(`/service/${id}`, updatedServiceData)
		return response.data
    } catch (error) {
		handleError(error)
    }

}
  
export const deleteService = async (id) => {

    try {
		const response = await instance.delete(`/services/${id}`)
		return response.data
    } catch (error) {
		handleError(error)
    }

}