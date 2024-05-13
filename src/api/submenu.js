import instance from './axios'

export const createSubMenu = async (subMenuData) => {

	try {
		const response = await instance.post('/submenus', subMenuData)
		return response.data
	} catch (error) {
		if (error.response) {
			console.error('Error en la respuesta del servidor:', error.response.status, error.response.data)
			throw new Error(`Error en la respuesta del servidor: ${error.response.status}`)
		} else if (error.request) {
			console.error('No se recibió respuesta del servidor:', error.request)
			throw new Error('No se recibió respuesta del servidor')
		} else {
			console.error('Error durante la configuración de la solicitud:', error.message)
			throw new Error('Error durante la configuración de la solicitud')
		}

	}

}

export const getAllSubMenus = async () => {

	try {
		const response = await instance.get('/submenus')
		return response.data
	} catch (error) {
		console.error(error)
	}

}

export const updateSubMenu = async (subMenuId, updatedSubMenuData) => {

	try {
		const response = await instance.put(`/submenus/${subMenuId}`, updatedSubMenuData)
		return response.data
	} catch (error) {
		handleAxiosError(error)
	}

}

export const deleteSubMenu = async (subMenuId) => {

	try {
		const response = await instance.delete(`/submenus/${subMenuId}`)
		return response.data
	} catch (error) {
		handleAxiosError(error)
	}

}

export const createSubMenuByUserAndRol = async (menuData) => {

    try {
		const response = await instance.post('/submenusByRolAndUsuario', menuData)
		return response.data;
    } catch (error) {
		handleAxiosError(error)
    }

}

const handleAxiosError = (error) => {
	
	if (error.response) {
		console.error('Error en la respuesta del servidor:', error.response.status, error.response.data)
		throw new Error(`Error en la respuesta del servidor: ${error.response.status}`)
	} else if (error.request) {
		console.error('No se recibió respuesta del servidor:', error.request)
		throw new Error('No se recibió respuesta del servidor')
	} else {
		console.error('Error durante la configuración de la solicitud:', error.message)
		throw new Error('Error durante la configuración de la solicitud')
	}

}







