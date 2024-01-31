// Importa axios si aún no lo has hecho
import axios from 'axios';


export const getUserById = async (userId) => {
  try {
    // Usa la ruta correspondiente a '/GetUserById/:id' y proporciona el userId
    const response = await axios.get(`http://localhost:3000/api/GetUserById/${userId}`);

    console.log(response);
    
    // Axios maneja automáticamente los errores de respuesta no exitosa
    const responseData = response.data;
    

   


    return responseData; // Ajusta según la estructura de tu respuesta
  } catch (error) {
    if (error.response) {
      // El servidor respondió con un código de error
      throw new Error(`Error al obtener usuario por ID: ${error.response.data.message}`);
    } else if (error.request) {
      // La solicitud fue realizada pero no se recibió respuesta
      throw new Error('No se recibió respuesta del servidor');
    } else {
      // Ocurrió un error antes de realizar la solicitud
      throw new Error(`Error al realizar la solicitud: ${error.message}`);
    }
  }
};


getUserById(151)
