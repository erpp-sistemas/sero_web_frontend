import instance from './axios'

export const getAllTasks = async () => {

    try {
		const response = await instance.get(`/tasks`)
		return response.data
    } catch (error) {
		console.error("Error al obtener todas las tareas:", error.response?.data || error.message)
		throw error.response?.data || error
    }

}

export const updateTaskById = async (taskId, updatedTaskData) => {

    try {
		const response = await instance.put(`/tasks/${taskId}`, updatedTaskData)
		return response.data
    } catch (error) {
		console.error("Error al actualizar la tarea por ID:", error.response?.data || error.message)
		throw error.response?.data || error
    }

}

export const deleteTaskById = async (taskId) => {

    try {
		const response = await instance.delete(`/tasks/${taskId}`)
		return response.data
    } catch (error) {
		console.error("Error al eliminar la tarea por ID:", error.response?.data || error.message)
		throw error.response?.data || error
    }

}
  
export const createTask = async (taskData) => {

    try {
		const response = await instance.post('/task', taskData)
		return response.data
    } catch (error) {
		console.error("Error al crear una nueva tarea:", error.response?.data || error.message)
		throw error.response?.data || error
    }
	
}