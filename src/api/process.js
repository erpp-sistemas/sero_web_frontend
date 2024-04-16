import axios from './axios'

export const placeServiceProcessByUserIdRequest = (user_id, place_id, service_id) => axios.get(`/PlaceServiceProcessByUserId/${user_id}/${place_id}/${service_id}`)

/**
 * Crea un nuevo proceso.
 *
 * @param {Object} processData - Datos del nuevo proceso.
 * @returns {Promise} - Promesa que se resuelve con los datos del nuevo proceso creado.
 * @throws {Error} - Error en caso de fallo durante la creación del proceso.
 */
export const createProcess = async (processData) => {
    try {
      const response = await axios.post(`/processes`, processData);
      return response.data;
    } catch (error) {
      console.error("Error al crear un nuevo proceso:", error);
      throw error;
    }
  };
  
  /**
   * Obtiene todos los procesos.
   *
   * @returns {Promise} - Promesa que se resuelve con un array de todos los procesos.
   * @throws {Error} - Error en caso de fallo durante la obtención de los procesos.
   */
  export const getAllProcesses = async () => {
    try {
      const response = await axios.get(`/processes`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener todos los procesos:", error);
      throw error;
    }
  };
  
  /**
   * Actualiza un proceso por su ID.
   *
   * @param {string} processId - ID del proceso que se va a actualizar.
   * @param {Object} updatedData - Datos actualizados para el proceso.
   * @returns {Promise} - Promesa que se resuelve con los datos del proceso actualizado.
   * @throws {Error} - Error en caso de fallo durante la actualización del proceso.
   */
  export const updateProcess = async (processId, updatedData) => {
    console.log(updatedData);
    try {
      const response = await axios.put(`/processes/${processId}`, updatedData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el proceso con ID ${processId}:`, error);
      throw error;
    }
  };
  
  /**
   * Elimina un proceso por su ID.
   *
   * @param {string} processId - ID del proceso que se va a eliminar.
   * @returns {Promise} - Promesa que se resuelve con un mensaje de éxito después de eliminar el proceso.
   * @throws {Error} - Error en caso de fallo durante la eliminación del proceso.
   */
  export const deleteProcess = async (processId) => {
    try {
      const response = await axios.delete(`/processes/${processId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar el proceso con ID ${processId}:`, error);
      throw error;
    }
  };