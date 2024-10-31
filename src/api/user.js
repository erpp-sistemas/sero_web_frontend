/* eslint-disable no-undef */
import instance from "./axios"
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


export const getLastPositionUsers = async (place_id) => {
	try {
		const response = await instance.get(`/last-position-by-plaza/${place_id}`);
		return response.data;
	} catch (error) {
		console.error("Error al obtener las posiciones de los gestores",
			error.response?.data || error.message)
		throw error.response?.data || error;
	}
}

export const getGestores = async () => {
	try {
		const response = await instance.get(`/managers-place`);
		return response.data;
	} catch (error) {
		console.error("Error al obtener las posiciones de los gestores",
			error.response?.data || error.message)
		throw error.response?.data || error;
	}
}

export const getPositionsGestorByFecha = async (user_id, fecha) => {
	try {
		const response = await instance.get(`/positions-user-fecha/${user_id}/${fecha}`);
		return response.data;
	} catch (error) {
		console.error("Error al obtener las posiciones del gestor",
			error.response?.data || error.message)
		throw error.response?.data || error;
	}
}

export const getPositionsGestionesGestorByFecha = async (place_id, user_id, fecha) => {
	try {
		const response = await instance.get(`/positions-gestiones-user-fecha/${place_id}/${user_id}/${fecha}`);
		return response.data;
	} catch (error) {
		console.error("Error al obtener las posiciones del gestor",
			error.response?.data || error.message)
		throw error.response?.data || error;
	}
}

export const getUsersForNotification = async () => {
	try {
		const response = await instance.get(`/usuarios`);
		return response.data;
	} catch (error) {
		console.error("Error al obtener a los usuarios",
			error.response?.data || error.message)
		throw error.response?.data || error;
	}
}

