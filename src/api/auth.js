import axios from './axios'

export const loginRequest = user => axios.post(`/login`, user)

export const verifyTokenRequest = () => axios.get('/verify')

export const registerRequest = user => axios.post(`/register`, user)


// export const registerUser = async (userData) => {
//     try {
//       console.log('userData', userData)
//       const response = await axios.post('/register', userData);
  
//       // Axios maneja automáticamente los errores de respuesta no exitosa
//       const responseData = response.data;
//       return responseData; // Puedes ajustar esto según la estructura de tu respuesta
//     } catch (error) {
//       if (error.response) {
//         // El servidor respondió con un código de error
//         throw new Error(`Error al registrar usuario: ${error.response.data.message}`);
//       } else if (error.request) {
//         // La solicitud fue realizada pero no se recibió respuesta
//         throw new Error('No se recibió respuesta del servidor');
//       } else {
//         // Ocurrió un error antes de realizar la solicitud
//         throw new Error(`Error al realizar la solicitud: ${error.message}`);
//       }
//     }
//   };