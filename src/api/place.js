import instance from './axios'
import axios from './axios'

export const placeById = (place_id) => axios.get(`/PlaceById/${place_id}`)
export const placeByUserIdRequest = (user_id) => axios.get(`/PlaceByUserId/${user_id}`)

export const getPlaceServiceByUserId = async (userId,placeId) => {

    try {
		const response = await instance.get(`/PlaceServiceByUserId/${userId}/${placeId}`)
		return response.data
    } catch (error) {
		console.error("Error updating place by ID:", error.response?.data || error.message)
		throw error.response?.data || error
    }

}

export const getProcessesByUserPlaceAndServiceId = async(userId,placeId,serviceId)=>{

    try {
        const response = await axios.get(`/getProcessesByUserPlaceAndServiceId/${userId}/${placeId}/${serviceId}`)
        return response.data
    } catch (error) {
        console.error("Error updating place by ID:", error.response?.data || error.message)
        throw error.response?.data || error
    }

}

export const createPlace = async (placeData) => {

    try {
		const response = await instance.post('/places', placeData)
		return response.data
    } catch (error) {
		console.error("Error creating a new place:", error.response?.data || error.message)
		throw error.response?.data || error
    }

}
  
export const deletePlaceById = async (placeId) => {

    try {
		const response = await axios.delete(`/places/${placeId}`)
		return response.data
    } catch (error) {
		console.error("Error deleting place by ID:", error.response?.data || error.message)
		throw error.response?.data || error
    }

}
  
export const getAllPlaces = async () => {

    try {
      const response = await instance.get('/places')
      return response.data
    } catch (error) {
		console.error("Error getting all places:", error.response?.data || error.message)
		throw error.response?.data || error
    }

}

export const getPlaceAndServiceAndProcess = async (idPlaza) => {

    try {
		const response = await instance.get(`/plazas/${idPlaza}`)
		return response.data
    } catch (error) {
		console.error("Error getting all places:", error.response?.data || error.message)
		throw error.response?.data || error
    }

}

export const updatePlaceById = async (placeId, updatedPlaceData) => {

    try {
      const response = await axios.put(`/places/${placeId}`, updatedPlaceData)
      return response.data
    } catch (error) {
      console.error("Error updating place by ID:", error.response?.data || error.message)
      throw error.response?.data || error
    }

}


export const getAllPlaceAndServiceAndProcess = async ()=>{

    try {
		const response = await instance.get('/placesAndServiceAndProcess')
		return response.data
    } catch (error) {
		console.error("Error updating place by ID:", error.response?.data || error.message);
		throw error.response?.data || error;
    }

}

export const createPlazaServiceProcess = async (PlazaServiceProcessData) => {

	try {
		const response = await instance.post('/placesAndServiceAndProcess', PlazaServiceProcessData)
		return response.data
	} catch (error) {
		console.error("Error creating user plaza service process data:", error.response?.data || error.message)
		throw error.response?.data || error
	}

}

export const createUserPlazaServiceProcess = async (userPlazaServiceProcessData) => {

    try {
      const response = await axios.post('/userPlazaServiceProcess', userPlazaServiceProcessData)
      return response.data
    } catch (error) {
      console.error("Error creating user plaza service process data:", error.response?.data || error.message)
      throw error.response?.data || error
    }

}

export const createPlaceAndServiceAndProcess = async(data)=>{

	try {
		const response = await instance.post('/insertPlaceAndServiceAndProcess',data)
		return response.data
	} catch (error) {
		console.error("Error creating user plaza service process data:", error.response?.data || error.message)
		throw error.response?.data || error
	}
		
}







