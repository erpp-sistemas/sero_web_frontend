import axios from 'axios';
import instance from './axios';

/**
 * Función para crear un nuevo submenú.
 *
 * @param {Object} subMenuData - Datos del submenú a crear.
 * @returns {Promise<Object>} - Promesa que se resuelve con la respuesta del servidor.
 * @throws {Error} - Lanza un error si la solicitud falla.
 */
export const createSubMenu = async (subMenuData) => {
  try {
    const response = await instance.post('/submenus', subMenuData);
    return response.data;
  } catch (error) {
    if (error.response) {
      // La solicitud fue realizada y el servidor respondió con un código de estado fuera del rango 2xx
      console.error('Error en la respuesta del servidor:', error.response.status, error.response.data);
      throw new Error(`Error en la respuesta del servidor: ${error.response.status}`);
    } else if (error.request) {
      // La solicitud fue realizada pero no se recibió respuesta del servidor
      console.error('No se recibió respuesta del servidor:', error.request);
      throw new Error('No se recibió respuesta del servidor');
    } else {
      // Ocurrió un error durante la configuración de la solicitud
      console.error('Error durante la configuración de la solicitud:', error.message);
      throw new Error('Error durante la configuración de la solicitud');
    }
  }
};

/**
 * Función para obtener todos los submenús.
 *
 * @returns {Promise<Object>} - Promesa que se resuelve con la respuesta del servidor.
 * @throws {Error} - Lanza un error si la solicitud falla.
 */
export const getAllSubMenus = async () => {
  try {
    const response = await instance.get('/submenus');
    
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Función para actualizar un submenú específico por su ID.
 *
 * @param {number} subMenuId - ID del submenú a actualizar.
 * @param {Object} updatedSubMenuData - Datos actualizados del submenú.
 * @returns {Promise<Object>} - Promesa que se resuelve con la respuesta del servidor.
 * @throws {Error} - Lanza un error si la solicitud falla.
 */
export const updateSubMenu = async (subMenuId, updatedSubMenuData) => {
  try {
    const response = await instance.put(`/submenus/${subMenuId}`, updatedSubMenuData);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/**
 * Función para eliminar un submenú específico por su ID.
 *
 * @param {number} subMenuId - ID del submenú a eliminar.
 * @returns {Promise<Object>} - Promesa que se resuelve con la respuesta del servidor.
 * @throws {Error} - Lanza un error si la solicitud falla.
 */
export const deleteSubMenu = async (subMenuId) => {
  try {
    const response = await instance.delete(`/submenus/${subMenuId}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};



  /**
   * Crea un nuevo menú utilizando los datos proporcionados.
   *
   * @param {Object} menuData - Datos del menú a crear.
   * @returns {Promise<Object>} - Una promesa que se resuelve con los datos del menú creado.
   * @throws {Error} - Se lanza un error si la solicitud falla o si hay un error en el servidor.
   */
  export const createSubMenuByUserAndRol = async (menuData) => {
    try {
      const response = await instance.post('/submenusByRolAndUsuario', menuData);
      // Podrías realizar operaciones adicionales aquí después de la creación
      return response.data;
    } catch (error) {
      handleAxiosError(error)
    }
  };

/**
 * Función para manejar errores de Axios de manera centralizada.
 *
 * @param {Error} error - Objeto de error de Axios.
 * @throws {Error} - Lanza un error con información detallada del error.
 */
const handleAxiosError = (error) => {
  if (error.response) {
    console.error('Error en la respuesta del servidor:', error.response.status, error.response.data);
    throw new Error(`Error en la respuesta del servidor: ${error.response.status}`);
  } else if (error.request) {
    console.error('No se recibió respuesta del servidor:', error.request);
    throw new Error('No se recibió respuesta del servidor');
  } else {
    console.error('Error durante la configuración de la solicitud:', error.message);
    throw new Error('Error durante la configuración de la solicitud');
  }
};







