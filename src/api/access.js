import axios from './axios'


 // Función para actualizar una tarea por su ID
 export const getAccessUserByUserName = async (username) => {
    try {
      const response = await axios.get(`/AccessUsers/${username}`);
      // Podrías realizar operaciones adicionales aquí después de la actualización
      return response.data;
    } catch (error) {
      console.error("Error al obetener el id_usuario:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };



  export const updateAccessUserById = async (userID,dataUser) => {
    try {
      const response = await axios.put(`/updateAccessUserById/${userID}`,dataUser);
      // Podrías realizar operaciones adicionales aquí después de la actualización
      return response.data;
    } catch (error) {
      console.error("Error al actualizar acceso del usuario :", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };