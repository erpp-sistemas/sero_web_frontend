import instance from './axios'
import axios from './axios'

export const menusUserIdRequest = (user_id) => axios.get(`/MenusUserId/${user_id}`)
export const menusProfileRequest = (profile_id) => axios.get(`/MenusProfile/${profile_id}`)

export const getMenusByUserId = async (userId) => {

    try {
		const response = await instance.get(`/MenusUserId/${userId}`)
		return response.data
    } catch (error) {
		console.error("Error al obtener los menús por ID de usuario:", error.response?.data || error.message)
		throw error.response?.data || error
    }

}
  
export const createMenu = async (menuData) => {

    try {
		const response = await instance.post('/menus', menuData)
		return response.data
    } catch (error) {
		console.error("Error al crear un nuevo menú:", error.response?.data || error.message)
		throw error.response?.data || error
    }

}
  
export const getAllMenus = async () => {

    try {
		const response = await instance.get('/menus')
		return response.data
    } catch (error) {
		console.error("Error al obtener todos los menús:", error.response?.data || error.message)
		throw error.response?.data || error
    }

}
  
export const updateMenu = async (menuId, updatedMenuData) => {

    try {
      const response = await instance.put(`/menus/${menuId}`, updatedMenuData)
      return response.data
    } catch (error) {
      console.error("Error al actualizar el menú por ID:", error.response?.data || error.message)
      throw error.response?.data || error
    }
}

export const deleteMenu = async (menuId) => {

    try {
		const response = await instance.delete(`/menus/${menuId}`)
		return response.data
    } catch (error) {
		console.error("Error al eliminar el menú por ID:", error.response?.data || error.message)
		throw error.response?.data || error
    }

}

export const createMenuByUserAndRol = async (menuData) => {

    try {
		const response = await instance.post('/menusByRolAndUsuario', menuData)
		return response.data
    } catch (error) {
		console.error("Error al crear un nuevo menú:", error.response?.data || error.message)
		throw error.response?.data || error
    }

}

export const menuByUserAndRol = async (userId,rolId) => {

    try {
		const response = await instance.get(`/menuByUserAndRol/${userId}/${rolId}`)
		return response.data
    } catch (error) {
		console.error("Error al crear un nuevo menú:", error.response?.data || error.message)
		throw error.response?.data || error;
    }

}

export const updateActivoInMenuRolUsuario = async (menuData) => {
	
    try {
		const response = await instance.put(`/updateUserPlazaServicioProceso`, menuData)
		return response.data
    } catch (error) {
		console.error("Error :", error.response?.data || error.message)
		throw error.response?.data || error
    }
	
}


  

