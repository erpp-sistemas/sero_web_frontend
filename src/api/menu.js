import axios from './axios'

//export const loginRequest = user => axios.post(`/login`, user)

export const menusUserIdRequest = (user_id) => axios.get(`/MenusUserId/${user_id}`)



/**
 * Obtiene todos los menús asociados a un usuario por su ID.
 *
 * @param {number} userId - ID del usuario.
 * @returns {Promise<Array>} - Una promesa que se resuelve con un array de menús.
 * @throws {Error} - Se lanza un error si la solicitud falla o si hay un error en el servidor.
 */
export const getMenusByUserId = async (userId) => {
    try {
      const response = await axios.get(`/MenusUserId/${userId}`);
      // Podrías realizar operaciones adicionales aquí antes de retornar los datos
      return response.data;
    } catch (error) {
      console.error("Error al obtener los menús por ID de usuario:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };
  
  /**
   * Crea un nuevo menú utilizando los datos proporcionados.
   *
   * @param {Object} menuData - Datos del menú a crear.
   * @returns {Promise<Object>} - Una promesa que se resuelve con los datos del menú creado.
   * @throws {Error} - Se lanza un error si la solicitud falla o si hay un error en el servidor.
   */
  export const createMenu = async (menuData) => {
    try {
      const response = await axios.post('/menus', menuData);
      // Podrías realizar operaciones adicionales aquí después de la creación
      return response.data;
    } catch (error) {
      console.error("Error al crear un nuevo menú:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };
  
  /**
   * Obtiene todos los menús del sistema.
   *
   * @returns {Promise<Array>} - Una promesa que se resuelve con un array de todos los menús.
   * @throws {Error} - Se lanza un error si la solicitud falla o si hay un error en el servidor.
   */
  export const getAllMenus = async () => {
    try {
      const response = await axios.get('/menus');
      // Podrías realizar operaciones adicionales aquí antes de retornar los datos
      return response.data;
    } catch (error) {
      console.error("Error al obtener todos los menús:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };
  
  /**
   * Actualiza un menú específico por su ID.
   *
   * @param {number} menuId - ID del menú a actualizar.
   * @param {Object} updatedMenuData - Datos actualizados del menú.
   * @returns {Promise<Object>} - Una promesa que se resuelve con los datos del menú actualizado.
   * @throws {Error} - Se lanza un error si la solicitud falla o si hay un error en el servidor.
   */
  export const updateMenu = async (menuId, updatedMenuData) => {
    try {
      const response = await axios.put(`/menus/${menuId}`, updatedMenuData);
      // Podrías realizar operaciones adicionales aquí después de la actualización
      return response.data;
    } catch (error) {
      console.error("Error al actualizar el menú por ID:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };
  
  /**
   * Elimina un menú específico por su ID.
   *
   * @param {number} menuId - ID del menú a eliminar.
   * @returns {Promise<Object>} - Una promesa que se resuelve con los datos del menú eliminado.
   * @throws {Error} - Se lanza un error si la solicitud falla o si hay un error en el servidor.
   */
  export const deleteMenu = async (menuId) => {
    try {
      const response = await axios.delete(`/menus/${menuId}`);
      // Podrías realizar operaciones adicionales aquí después de la eliminación
      return response.data;
    } catch (error) {
      console.error("Error al eliminar el menú por ID:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };





  /**
   * Crea un nuevo menú utilizando los datos proporcionados.
   *
   * @param {Object} menuData - Datos del menú a crear.
   * @returns {Promise<Object>} - Una promesa que se resuelve con los datos del menú creado.
   * @throws {Error} - Se lanza un error si la solicitud falla o si hay un error en el servidor.
   */
  export const createMenuByUserAndRol = async (menuData) => {

    console.log(menuData);
    try {
      const response = await axios.post('/menusByRolAndUsuario', menuData);
      // Podrías realizar operaciones adicionales aquí después de la creación
      return response.data;
    } catch (error) {
      console.error("Error al crear un nuevo menú:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };


   /**
   * Crea un nuevo menú utilizando los datos proporcionados.
   *
   * @param {Object} menuData - Datos del menú a crear.
   * @returns {Promise<Object>} - Una promesa que se resuelve con los datos del menú creado.
   * @throws {Error} - Se lanza un error si la solicitud falla o si hay un error en el servidor.
   */
   export const menuByUserAndRol = async (userId,rolId) => {
    try {
      const response = await axios.get(`/menuByUserAndRol/${userId}/${rolId}`);
      // Podrías realizar operaciones adicionales aquí después de la creación
      return response.data;
    } catch (error) {
      console.error("Error al crear un nuevo menú:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };