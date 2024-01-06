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


/**
 * Obtiene todos los subelementos de sub_menu_rol.
 *
 * @returns {Promise} Una promesa que se resuelve con los datos de sub_menu_rol o se rechaza con un error.
 */
export const getAllSubMenuRol = async () => {
    try {
      const response = await axios.get('/sub_menu_rol');
      // Podrías realizar operaciones adicionales aquí antes de retornar los datos
      return response.data;
    } catch (error) {
      /**
       * @typedef {Object} ErrorResponse
       * @property {string} message - Mensaje de error.
       */
  
      console.error("Error al obtener todos los subelementos de sub_menu_rol:", error.response?.data || error.message);
      throw /** @type {ErrorResponse} */ (error.response?.data || error);
    }
  };
  
  /**
   * Actualiza un subelemento de sub_menu_rol por su ID.
   *
   * @param {string} subMenuRolId - ID del subelemento de sub_menu_rol que se actualizará.
   * @param {Object} updatedSubMenuRolData - Datos actualizados del subelemento de sub_menu_rol.
   * @returns {Promise} Una promesa que se resuelve con los datos actualizados o se rechaza con un error.
   */
  export const updateSubMenuRolById = async (subMenuRolId, updatedSubMenuRolData) => {
    try {
      const response = await axios.put(`/sub_menu_rol/${subMenuRolId}`, updatedSubMenuRolData);
      // Podrías realizar operaciones adicionales aquí después de la actualización
      return response.data;
    } catch (error) {
      console.error("Error al actualizar el subelemento de sub_menu_rol por ID:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };
  
  /**
   * Elimina un subelemento de sub_menu_rol por su ID.
   *
   * @param {string} subMenuRolId - ID del subelemento de sub_menu_rol que se eliminará.
   * @returns {Promise} Una promesa que se resuelve con los datos eliminados o se rechaza con un error.
   */
  export const deleteSubMenuRolById = async (subMenuRolId) => {
    try {
      const response = await axios.delete(`/sub_menu_rol/${subMenuRolId}`);
      // Podrías realizar operaciones adicionales aquí después de la eliminación
      return response.data;
    } catch (error) {
      console.error("Error al eliminar el subelemento de sub_menu_rol por ID:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };
  
  /**
   * Crea un nuevo subelemento de sub_menu_rol.
   *
   * @param {Object} subMenuRolData - Datos del nuevo subelemento de sub_menu_rol.
   * @returns {Promise} Una promesa que se resuelve con los datos creados o se rechaza con un error.
   */
  export const createSubMenuRol = async (subMenuRolData) => {
    try {
      const response = await axios.post('/sub_menu_rol', subMenuRolData);
      // Podrías realizar operaciones adicionales aquí después de la creación
      return response.data;
    } catch (error) {
      console.error("Error al crear un nuevo subelemento de sub_menu_rol:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };



  
/**
 * Crea un nuevo elemento de menu_rol_usuario.
 *
 * @param {Object} menuRolUsuarioData - Datos del nuevo elemento de menu_rol_usuario.
 * @returns {Promise} Una promesa que se resuelve con los datos creados o se rechaza con un error.
 */
export const createMenuRolUsuario = async (menuRolUsuarioData) => {
    try {
      const response = await axios.post('/menu_rol_usuario', menuRolUsuarioData);
      // Podrías realizar operaciones adicionales aquí después de la creación
      return response.data;
    } catch (error) {
      /**
       * @typedef {Object} ErrorResponse
       * @property {string} message - Mensaje de error.
       */
  
      console.error("Error al crear un nuevo elemento de menu_rol_usuario:", error.response?.data || error.message);
      throw /** @type {ErrorResponse} */ (error.response?.data || error);
    }
  };
  
  /**
   * Obtiene todos los elementos de menu_rol_usuario.
   *
   * @returns {Promise} Una promesa que se resuelve con los datos de menu_rol_usuario o se rechaza con un error.
   */
  export const getAllMenuRolUsuario = async () => {
    try {
      const response = await axios.get('/menu_rol_usuario');
      // Podrías realizar operaciones adicionales aquí antes de retornar los datos
      return response.data;
    } catch (error) {
      /**
       * @typedef {Object} ErrorResponse
       * @property {string} message - Mensaje de error.
       */
  
      console.error("Error al obtener todos los elementos de menu_rol_usuario:", error.response?.data || error.message);
      throw /** @type {ErrorResponse} */ (error.response?.data || error);
    }
  };
  
  /**
   * Actualiza un elemento de menu_rol_usuario por su ID.
   *
   * @param {string} menuRolUsuarioId - ID del elemento de menu_rol_usuario que se actualizará.
   * @param {Object} updatedMenuRolUsuarioData - Datos actualizados del elemento de menu_rol_usuario.
   * @returns {Promise} Una promesa que se resuelve con los datos actualizados o se rechaza con un error.
   */
  export const updateMenuRolUsuarioById = async (menuRolUsuarioId, updatedMenuRolUsuarioData) => {
    try {
      const response = await axios.put(`/menu_rol_usuario/${menuRolUsuarioId}`, updatedMenuRolUsuarioData);
      // Podrías realizar operaciones adicionales aquí después de la actualización
      return response.data;
    } catch (error) {
      console.error("Error al actualizar el elemento de menu_rol_usuario por ID:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };
  
  /**
   * Elimina un elemento de menu_rol_usuario por su ID.
   *
   * @param {string} menuRolUsuarioId - ID del elemento de menu_rol_usuario que se eliminará.
   * @returns {Promise} Una promesa que se resuelve con los datos eliminados o se rechaza con un error.
   */
  export const deleteMenuRolUsuarioById = async (menuRolUsuarioId) => {
    try {
      const response = await axios.delete(`/menu_rol_usuario/${menuRolUsuarioId}`);
      // Podrías realizar operaciones adicionales aquí después de la eliminación
      return response.data;
    } catch (error) {
      console.error("Error al eliminar el elemento de menu_rol_usuario por ID:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };


  /**
 * Obtiene información de menu_rol_usuario por id_usuario.
 *
 * @param {number} userId - ID del usuario para filtrar la información.
 * @returns {Promise<Object>} - Una promesa que resuelve con los datos de menu_rol_usuario.
 * @throws {Error} - Error al obtener información de menu_rol_usuario por id_usuario.
 */
export const getMenuRolUsuarioByUserId = async (userId) => {
    try {
      // Realiza una solicitud GET a la ruta específica de la API para obtener información por id_usuario
      const response = await axios.get(`/menu-rol-usuario/by-user/${userId}`);
      
      // Retorna los datos obtenidos de menu_rol_usuario
      return response.data;
    } catch (error) {
      // Captura y lanza un error en caso de que ocurra un problema en la solicitud
      throw new Error(`Error al obtener información de menu_rol_usuario por id_usuario: ${error.message}`);
    }
  };


  /**
 * Crea un nuevo elemento de sub_menu_rol_usuario.
 *
 * @param {Object} subMenuRolUsuarioData - Datos del nuevo elemento de sub_menu_rol_usuario.
 * @returns {Promise} Una promesa que se resuelve con los datos creados o se rechaza con un error.
 */
export const createSubMenuRolUsuario = async (subMenuRolUsuarioData) => {
    try {
      const response = await axios.post('/sub_menu_rol_usuario', subMenuRolUsuarioData);
      // Podrías realizar operaciones adicionales aquí después de la creación
      return response.data;
    } catch (error) {
      /**
       * @typedef {Object} ErrorResponse
       * @property {string} message - Mensaje de error.
       */
  
      console.error("Error al crear un nuevo elemento de sub_menu_rol_usuario:", error.response?.data || error.message);
      throw /** @type {ErrorResponse} */ (error.response?.data || error);
    }
  };
  
  /**
   * Obtiene todos los elementos de sub_menu_rol_usuario.
   *
   * @returns {Promise} Una promesa que se resuelve con los datos de sub_menu_rol_usuario o se rechaza con un error.
   */
  export const getAllSubMenuRolUsuario = async () => {
    try {
      const response = await axios.get('/sub_menu_rol_usuario');
      // Podrías realizar operaciones adicionales aquí antes de retornar los datos
      return response.data;
    } catch (error) {
      /**
       * @typedef {Object} ErrorResponse
       * @property {string} message - Mensaje de error.
       */
  
      console.error("Error al obtener todos los elementos de sub_menu_rol_usuario:", error.response?.data || error.message);
      throw /** @type {ErrorResponse} */ (error.response?.data || error);
    }
  };
  
  /**
   * Actualiza un elemento de sub_menu_rol_usuario por su ID.
   *
   * @param {string} subMenuRolUsuarioId - ID del elemento de sub_menu_rol_usuario que se actualizará.
   * @param {Object} updatedSubMenuRolUsuarioData - Datos actualizados del elemento de sub_menu_rol_usuario.
   * @returns {Promise} Una promesa que se resuelve con los datos actualizados o se rechaza con un error.
   */
  export const updateSubMenuRolUsuarioById = async (subMenuRolUsuarioId, updatedSubMenuRolUsuarioData) => {
    try {
      const response = await axios.put(`/sub_menu_rol_usuario/${subMenuRolUsuarioId}`, updatedSubMenuRolUsuarioData);
      // Podrías realizar operaciones adicionales aquí después de la actualización
      return response.data;
    } catch (error) {
      console.error("Error al actualizar el elemento de sub_menu_rol_usuario por ID:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };
  
  /**
   * Elimina un elemento de sub_menu_rol_usuario por su ID.
   *
   * @param {string} subMenuRolUsuarioId - ID del elemento de sub_menu_rol_usuario que se eliminará.
   * @returns {Promise} Una promesa que se resuelve con los datos eliminados o se rechaza con un error.
   */
  export const deleteSubMenuRolUsuarioById = async (subMenuRolUsuarioId) => {
    try {
      const response = await axios.delete(`/sub_menu_rol_usuario/${subMenuRolUsuarioId}`);
      // Podrías realizar operaciones adicionales aquí después de la eliminación
      return response.data;
    } catch (error) {
      console.error("Error al eliminar el elemento de sub_menu_rol_usuario por ID:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };



  