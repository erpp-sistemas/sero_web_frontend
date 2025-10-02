// Función para solicitar OTP
import instance from "./axios";

export const requestOTP = async (email, documentData) => {
  try {
    console.log('📧 Enviando OTP a:', email);
    console.log('📄 Datos del documento:', documentData);
    
    const response = await instance.post('/request', {
      email: email,
      documentId: documentData?.id,
      employeeId: documentData?.employeeId,
      type: 'responsiva_signature'
    });
    
    console.log('✅ Respuesta del backend:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error requesting OTP:', error);
    
    // Mejor manejo de errores
    if (error.response) {
      // El servidor respondió con un código de error
      console.error('Detalles del error:', error.response.data);
      throw new Error(error.response.data.message || 'Error al enviar el código');
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor');
      throw new Error('No se pudo conectar con el servidor');
    } else {
      // Error al configurar la solicitud
      console.error('Error de configuración:', error.message);
      throw error;
    }
  }
};

// Función para validar OTP
export const validateOTP = async (email, otp, documentData) => {
  try {
    console.log('🔍 Validando OTP:', { email, otp });
    
    const response = await instance.post('/validate', {
      email: email,
      otp: otp,
      documentId: documentData?.id,
      employeeId: documentData?.employeeId
    });
    
    console.log('✅ Respuesta de validación:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error validating OTP:', error);
    
    if (error.response) {
      throw new Error(error.response.data.message || 'Error al validar el código');
    } else if (error.request) {
      throw new Error('No se pudo conectar con el servidor para validar');
    } else {
      throw error;
    }
  }
};