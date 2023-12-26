import axios from './axios'

//export const loginRequest = user => axios.post(`/login`, user)

export const placeServiceByUserIdRequest = (user_id, place_id) => axios.get(`/PlaceServiceByUserId/${user_id}/${place_id}`)


/**
 * Manejador de errores común para las solicitudes.
 * @function
 * @param {Error} error - Objeto de error.
 * @throws {Error} - Lanza un error con un mensaje descriptivo.
 */
const handleError = (error) => {
    console.error('Error en la solicitud:', error);
    throw new Error('Error en la solicitud. Consulta la consola para más detalles.');
  };
  
  /**
 * Crea un nuevo servicio mediante una solicitud POST.
 * @function
 * @async
 * @param {Object} serviceData - Datos del servicio a crear.
 * @returns {Promise<Object>} - Promesa que resuelve con los datos del nuevo servicio.
 * @throws {Error} - Lanza un error si la solicitud falla.
 */
  export const createService = async (serviceData) => {
    try {
      const response = await axios.post(`/services`, serviceData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  };
  
  /**
 * Obtiene todos los servicios mediante una solicitud GET.
 * @function
 * @async
 * @returns {Promise<Array>} - Promesa que resuelve con un array de servicios.
 * @throws {Error} - Lanza un error si la solicitud falla.
 */
  export const getAllServices = async () => {
    try {
      const response = await axios.get(`/services`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  };
  
/**
 * Actualiza un servicio existente mediante una solicitud PUT.
 * @function
 * @async
 * @param {string} id - ID del servicio a actualizar.
 * @param {Object} updatedServiceData - Datos actualizados para el servicio.
 * @returns {Promise<Object>} - Promesa que resuelve con los datos del servicio actualizado.
 * @throws {Error} - Lanza un error si la solicitud falla.
 */
  export const updateService = async (id, updatedServiceData) => {
    try {
      const response = await axios.put(`/service/${id}`, updatedServiceData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  };
  
 /**
 * Elimina un servicio existente mediante una solicitud DELETE.
 * @function
 * @async
 * @param {string} id - ID del servicio a eliminar.
 * @returns {Promise<Object>} - Promesa que resuelve con los datos del servicio eliminado.
 * @throws {Error} - Lanza un error si la solicitud falla.
 */
  export const deleteService = async (id) => {
    try {
      const response = await axios.delete(`/services/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  };