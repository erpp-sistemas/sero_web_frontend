
import axios from './axios'; // Asegúrate de que el path sea correcto

// Función para obtener todas las tareas de un servicio por ID
export const getAllTasks = async () => {
    try {
      const response = await axios.get(`/tasks`);
      // Podrías realizar operaciones adicionales aquí antes de retornar los datos
      return response.data;
    } catch (error) {
      console.error("Error al obtener todas las tareas:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };

  // Función para actualizar una tarea por su ID
export const updateTaskById = async (taskId, updatedTaskData) => {
    try {
      const response = await axios.put(`/api/tasks/${taskId}`, updatedTaskData);
      // Podrías realizar operaciones adicionales aquí después de la actualización
      return response.data;
    } catch (error) {
      console.error("Error al actualizar la tarea por ID:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };


// Función para eliminar una tarea por su ID
export const deleteTaskById = async (taskId) => {
    try {
      const response = await axios.delete(`/api/tasks/${taskId}`);
      // Podrías realizar operaciones adicionales aquí después de la eliminación
      return response.data;
    } catch (error) {
      console.error("Error al eliminar la tarea por ID:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };
  
  // Función para crear una nueva tarea
  export const createTask = async (taskData) => {
    try {
      const response = await axios.post('/api/task', taskData);
      // Podrías realizar operaciones adicionales aquí después de la creación
      return response.data;
    } catch (error) {
      console.error("Error al crear una nueva tarea:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };