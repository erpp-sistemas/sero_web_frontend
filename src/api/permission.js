import axios from './axios'; // Asegúrate de que el path sea correcto

/**
 * Obtiene todos los elementos de menu_rol.
 *
 * @returns {Promise} Una promesa que se resuelve con los datos de menu_rol o se rechaza con un error.
 */
export const getAllMenuRol = async () => {
  try {
    const response = await axios.get('/menu_rol');
    // Podrías realizar operaciones adicionales aquí antes de retornar los datos
    return response.data;
  } catch (error) {
    /**
     * @typedef {Object} ErrorResponse
     * @property {string} message - Mensaje de error.
     */

    console.error("Error al obtener todos los elementos de menu_rol:", error.response?.data || error.message);
    throw /** @type {ErrorResponse} */ (error.response?.data || error);
  }
};

/**
 * Actualiza un elemento de menu_rol por su ID.
 *
 * @param {string} menuRolId - ID del elemento de menu_rol que se actualizará.
 * @param {Object} updatedMenuRolData - Datos actualizados del elemento de menu_rol.
 * @returns {Promise} Una promesa que se resuelve con los datos actualizados o se rechaza con un error.
 */
export const updateMenuRolById = async (menuRolId, updatedMenuRolData) => {
  try {
    const response = await axios.put(`/menu_rol/${menuRolId}`, updatedMenuRolData);
    // Podrías realizar operaciones adicionales aquí después de la actualización
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el elemento de menu_rol por ID:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

/**
 * Elimina un elemento de menu_rol por su ID.
 *
 * @param {string} menuRolId - ID del elemento de menu_rol que se eliminará.
 * @returns {Promise} Una promesa que se resuelve con los datos eliminados o se rechaza con un error.
 */
export const deleteMenuRolById = async (menuRolId) => {
  try {
    const response = await axios.delete(`/menu_rol/${menuRolId}`);
    // Podrías realizar operaciones adicionales aquí después de la eliminación
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el elemento de menu_rol por ID:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

/**
 * Crea un nuevo elemento de menu_rol.
 *
 * @param {Object} menuRolData - Datos del nuevo elemento de menu_rol.
 * @returns {Promise} Una promesa que se resuelve con los datos creados o se rechaza con un error.
 */
export const createMenuRol = async (menuRolData) => {
  try {
    const response = await axios.post('/menu_rol', menuRolData);
    // Podrías realizar operaciones adicionales aquí después de la creación
    return response.data;
  } catch (error) {
    console.error("Error al crear un nuevo elemento de menu_rol:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};