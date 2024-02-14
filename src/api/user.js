// Importa axios si aún no lo has hecho
import axios from "axios";
import instance from "./axios";

export const getUserById = async (userId) => {
  try {
    // Usa la ruta correspondiente a '/GetUserById/:id' y proporciona el userId
    const response = await instance.get(
      `/GetUserById/${userId}`
    );

    console.log(response);

    // Axios maneja automáticamente los errores de respuesta no exitosa
    const responseData = response.data;

    return responseData; // Ajusta según la estructura de tu respuesta
  } catch (error) {
    if (error.response) {
      // El servidor respondió con un código de error
      throw new Error(
        `Error al obtener usuario por ID: ${error.response.data.message}`
      );
    } else if (error.request) {
      // La solicitud fue realizada pero no se recibió respuesta
      throw new Error("No se recibió respuesta del servidor");
    } else {
      // Ocurrió un error antes de realizar la solicitud
      throw new Error(`Error al realizar la solicitud: ${error.message}`);
    }
  }
};

// Función para actualizar una tarea por su ID
export const updateUser = async (userId, updatedUserData) => {
  try {
    const response = await instance.put(
      `/usuarios/${userId}`,
      updatedUserData
    );
    // Podrías realizar operaciones adicionales aquí después de la actualización
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(
      "Error al actualizar el usuario por ID:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

// Función para actualizar una tarea por su ID
export const getPlaceAndServiceAndProcessByUser = async (userId) => {
  console.log(userId);

  try {
    const response = await instance.get(
      `/getPlaceAndServiceAndProcessByUser/${userId}`
    );
    // Podrías realizar operaciones adicionales aquí después de la actualización
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(
      "Error al actualizar el usuario por ID:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const updateUserPlazaServicioProceso = async (userData) => {
  try {
    const response = await instance.put(
      `/updateUserPlazaServicioProceso`,
      userData
    );
    // Podrías realizar operaciones adicionales aquí después de la actualización
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(
      "Error al actualizar el usuario por ID:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};
