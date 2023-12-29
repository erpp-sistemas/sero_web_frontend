import axios from './axios'; // Asegúrate de que el path sea correcto


/**
 * Función para crear un nuevo rol.
 *
 * @returns {Promise} Promesa que se resuelve con los datos del nuevo rol creado.
 * @throws {Error} Error que indica el motivo del fallo en la creación del rol.
 */
export const createRol = async () => {
    try {
      const response = await axios.post('/roles');
      // Podrías realizar operaciones adicionales aquí después de la creación del rol
      return response.data;
    } catch (error) {
      console.error("Error al crear un nuevo rol:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };
  
  /**
   * Función para obtener todos los roles.
   *
   * @returns {Promise} Promesa que se resuelve con los datos de todos los roles.
   * @throws {Error} Error que indica el motivo del fallo en la obtención de roles.
   */
  export const getAllRoles = async () => {
    try {
      const response = await axios.get('/roles');
      // Podrías realizar operaciones adicionales aquí antes de retornar los datos
      return response.data;
    } catch (error) {
      console.error("Error al obtener todos los roles:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };
  
  /**
   * Función para actualizar un rol por su ID.
   *
   * @param {number} rolId - ID del rol que se va a actualizar.
   * @param {object} updatedRolData - Datos actualizados del rol.
   * @returns {Promise} Promesa que se resuelve con los datos del rol actualizado.
   * @throws {Error} Error que indica el motivo del fallo en la actualización del rol.
   */
  export const updateRolById = async (rolId, updatedRolData) => {
    try {
      const response = await axios.put(`/roles/${rolId}`, updatedRolData);
      // Podrías realizar operaciones adicionales aquí después de la actualización
      return response.data;
    } catch (error) {
      console.error("Error al actualizar el rol por ID:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };
  
  /**
   * Función para eliminar un rol por su ID.
   *
   * @param {number} rolId - ID del rol que se va a eliminar.
   * @returns {Promise} Promesa que se resuelve con los datos del rol eliminado.
   * @throws {Error} Error que indica el motivo del fallo en la eliminación del rol.
   */
  export const deleteRolById = async (rolId) => {
    try {
      const response = await axios.delete(`/roles/${rolId}`);
      // Podrías realizar operaciones adicionales aquí después de la eliminación
      return response.data;
    } catch (error) {
      console.error("Error al eliminar el rol por ID:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };