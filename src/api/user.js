/* eslint-disable no-undef */
import axios from "./axios"

export const getUsersByUserIdRequest = (user_id) => axios.get(`/GetUserById/${user_id}`)

export const getUserById = async (userId) => {

	try {
		const response = await instance.get(
			`/GetUserById/${userId}`
		)
		const responseData = response.data
		return responseData
	} catch (error) {
		if (error.response) {
		throw new Error(
			`Error al obtener usuario por ID: ${error.response.data.message}`
		)
		} else if (error.request) {
			throw new Error("No se recibió respuesta del servidor")
		} else {
			throw new Error(`Error al realizar la solicitud: ${error.message}`)
		}

	}

}

export const updateUser = async (userId, updatedUserData) => {
	try {
		const response = await instance.put(
			`/usuarios/${userId}`,
			updatedUserData
		)
		return response.data
	} catch (error) {
		console.error(
			"Error al actualizar el usuario por ID:",
			error.response?.data || error.message
		)
		throw error.response?.data || error
	}

}

export const getPlaceAndServiceAndProcessByUser = async (userId) => {

	try {
		const response = await instance.get(
			`/getPlaceAndServiceAndProcessByUser/${userId}`
		)
		return response.data
	} catch (error) {
		console.error(
			"Error al actualizar el usuario por ID:",
			error.response?.data || error.message
		)
		throw error.response?.data || error
	}

}

export const updateUserPlazaServicioProceso = async (userData) => {
	
	try {
		const response = await instance.put(
			`/updateUserPlazaServicioProceso`,
			userData
		)
		return response.data
	} catch (error) {
		console.error(
			"Error al actualizar el usuario por ID:",
			error.response?.data || error.message
		)
		throw error.response?.data || error;
	}

}
