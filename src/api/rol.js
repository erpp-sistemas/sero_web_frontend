import instance from './axios'

export const createRol = async (rolData) => {

    try {
		const response = await instance.post('/roles',rolData)
		return response.data
    } catch (error) {
		console.error("Error al crear un nuevo rol:", error.response?.data || error.message)
		throw error.response?.data || error
    }

}
 
export const getAllRoles = async () => {

    try {
		const response = await instance.get('/roles')
		return response.data
    } catch (error) {
		console.error("Error al obtener todos los roles:", error.response?.data || error.message)
		throw error.response?.data || error
    }

}

export const updateRolById = async (rolId, updatedRolData) => {

    try {
		const response = await instance.put(`/roles/${rolId}`, updatedRolData)
		return response.data
    } catch (error) {
		console.error("Error al actualizar el rol por ID:", error.response?.data || error.message)
		throw error.response?.data || error
    }

}
  

export const deleteRolById = async (rolId) => {

    try {
		const response = await instance.delete(`/roles/${rolId}`)
		return response.data
    } catch (error) {
		console.error("Error al eliminar el rol por ID:", error.response?.data || error.message)
		throw error.response?.data || error
    }

}