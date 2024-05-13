import axios from './axios'

export const getAllMenuRol = async () => {

	try {
		const response = await axios.get('/menu_rol')
		return response.data
	} catch (error) {
		console.error("Error al obtener todos los elementos de menu_rol:", error.response?.data || error.message)
		throw /** @type {ErrorResponse} */ (error.response?.data || error)
	}

}

export const updateMenuRolById = async (menuRolId, updatedMenuRolData) => {

	try {
		const response = await axios.put(`/menu_rol/${menuRolId}`, updatedMenuRolData)
		return response.data
	} catch (error) {
		console.error("Error al actualizar el elemento de menu_rol por ID:", error.response?.data || error.message)
		throw error.response?.data || error
	}

}

export const getMenuRolByIdRol = async (rolId) => {

	try {
		const response = await axios.get(`http://localhost:3000/api/menu_rol/rol/${rolId}`)
		return response.data
	} catch (error) {
		console.error('Error al obtener menu_rol entries por ID de rol:', error)
		throw error
	}

}

export const deleteMenuRolById = async (menuRolId) => {

	try {
		const response = await axios.delete(`/menu_rol/${menuRolId}`)
		return response.data
	} catch (error) {
		console.error("Error al eliminar el elemento de menu_rol por ID:", error.response?.data || error.message)
		throw error.response?.data || error
	}

}

export const createMenuRol = async (menuRolData) => {

	try {
		const response = await axios.post('/menu_rol', menuRolData)
		return response.data
	} catch (error) {
		console.error("Error al crear un nuevo elemento de menu_rol:", error.response?.data || error.message)
		throw error.response?.data || error
	}

}

export const getAllSubMenuRol = async () => {

    try {
		const response = await axios.get('/sub_menu_rol')
		return response.data
    } catch (error) {
		console.error("Error al obtener todos los subelementos de sub_menu_rol:", error.response?.data || error.message)
		throw /** @type {ErrorResponse} */ (error.response?.data || error)
    }

}
  
export const updateSubMenuRolById = async (subMenuRolId, updatedSubMenuRolData) => {

    try {
		const response = await axios.put(`/sub_menu_rol/${subMenuRolId}`, updatedSubMenuRolData)
		return response.data
    } catch (error) {
		console.error("Error al actualizar el subelemento de sub_menu_rol por ID:", error.response?.data || error.message)
		throw error.response?.data || error
    }

}

export const deleteSubMenuRolById = async (subMenuRolId) => {

	try {
		const response = await axios.delete(`/sub_menu_rol/${subMenuRolId}`)
		return response.data
	} catch (error) {
		console.error("Error al eliminar el subelemento de sub_menu_rol por ID:", error.response?.data || error.message)
		throw error.response?.data || error
	}

}

export const getSubMenuRolByIdRol = async (id) => {

	try {
		const response = await axios.get(`/sub_menu_rol/rol/${id}`)
		return response.data
	} catch (error) {
		console.error('Error al obtener sub_menu_rol por ID de rol:', error)
		throw error
	}

}

export const createSubMenuRol = async (subMenuRolData) => {

    try {
		const response = await axios.post('/sub_menu_rol', subMenuRolData)
		return response.data
    } catch (error) {
		console.error("Error al crear un nuevo subelemento de sub_menu_rol:", error.response?.data || error.message)
		throw error.response?.data || error
    }

}

export const createMenuRolUsuario = async (menuRolUsuarioData) => {

    try {
		const response = await axios.post('/menu_rol_usuario', menuRolUsuarioData)
		return response.data
    } catch (error) {
		console.error("Error al crear un nuevo elemento de menu_rol_usuario:", error.response?.data || error.message)
		throw /** @type {ErrorResponse} */ (error.response?.data || error)
    }
	
}

export const getAllMenuRolUsuario = async () => {

    try {
		const response = await axios.get('/menu_rol_usuario')
		return response.data
    } catch (error) {
		console.error("Error al obtener todos los elementos de menu_rol_usuario:", error.response?.data || error.message)
		throw /** @type {ErrorResponse} */ (error.response?.data || error)
    }

}
  
export const updateMenuRolUsuarioById = async (menuRolUsuarioId, updatedMenuRolUsuarioData) => {

    try {
		const response = await axios.put(`/menu_rol_usuario/${menuRolUsuarioId}`, updatedMenuRolUsuarioData)
		return response.data
    } catch (error) {
		console.error("Error al actualizar el elemento de menu_rol_usuario por ID:", error.response?.data || error.message)
		throw error.response?.data || error
    }

}
  
export const deleteMenuRolUsuarioById = async (menuRolUsuarioId) => {

    try {
		const response = await axios.delete(`/menu_rol_usuario/${menuRolUsuarioId}`)
		return response.data
    } catch (error) {
		console.error("Error al eliminar el elemento de menu_rol_usuario por ID:", error.response?.data || error.message)
		throw error.response?.data || error
    }

}

export const getMenuRolUsuarioByUserId = async (userId) => {

    try {
		const response = await axios.get(`/menu-rol-usuario/by-user/${userId}`)
		return response.data
    } catch (error) {
		throw new Error(`Error al obtener información de menu_rol_usuario por id_usuario: ${error.message}`)
    }

}

export const createSubMenuRolUsuario = async (subMenuRolUsuarioData) => {

    try {
		const response = await axios.post('/sub_menu_rol_usuario', subMenuRolUsuarioData)
		return response.data
    } catch (error) {
		console.error("Error al crear un nuevo elemento de sub_menu_rol_usuario:", error.response?.data || error.message)
		throw /** @type {ErrorResponse} */ (error.response?.data || error)
    }

}
  
export const getAllSubMenuRolUsuario = async () => {

    try {
		const response = await axios.get('/sub_menu_rol_usuario')
		return response.data
    } catch (error) {
		console.error("Error al obtener todos los elementos de sub_menu_rol_usuario:", error.response?.data || error.message)
		throw /** @type {ErrorResponse} */ (error.response?.data || error)
    }

}
  
export const updateSubMenuRolUsuarioById = async (subMenuRolUsuarioId, updatedSubMenuRolUsuarioData) => {

    try {
		const response = await axios.put(`/sub_menu_rol_usuario/${subMenuRolUsuarioId}`, updatedSubMenuRolUsuarioData)
		return response.data
    } catch (error) {
		console.error("Error al actualizar el elemento de sub_menu_rol_usuario por ID:", error.response?.data || error.message)
		throw error.response?.data || error
    }

}

export const deleteSubMenuRolUsuarioById = async (subMenuRolUsuarioId) => {
	
    try {
		const response = await axios.delete(`/sub_menu_rol_usuario/${subMenuRolUsuarioId}`)
		return response.data
    } catch (error) {
		console.error("Error al eliminar el elemento de sub_menu_rol_usuario por ID:", error.response?.data || error.message)
		throw error.response?.data || error
    }

}



  